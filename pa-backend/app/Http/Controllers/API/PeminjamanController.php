<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\PeminjamanResource;
use App\Models\Peminjaman;
use App\Models\DetailPeminjaman;
use App\Models\Alat;
use App\Models\LogAktivitas;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\PeminjamanExport;

class PeminjamanController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'tanggal_pinjam' => 'required|date|after_or_equal:today',
            'tanggal_kembali_rencana' => 'required|date|after:tanggal_pinjam',
            'keperluan' => 'nullable|string',
            'details' => 'required|array|min:1',
            'details.*.alat_id' => 'required|exists:alat,id',
            'details.*.jumlah' => 'required|integer|min:1',
        ]);

        DB::beginTransaction();
        
        try {
            foreach ($validated['details'] as $detail) {
                $alat = Alat::findOrFail($detail['alat_id']);
                if ($alat->stok_total < $detail['jumlah']) {
                    return response()->json([
                        'message' => "Stok alat {$alat->nama_alat} tidak mencukupi."
                    ], 422);
                }
            }

            $peminjaman = Peminjaman::create([
                'user_id' => $request->user()->id,
                'tanggal_pinjam' => $validated['tanggal_pinjam'],
                'tanggal_kembali_rencana' => $validated['tanggal_kembali_rencana'],
                'keperluan' => $validated['keperluan'],
                'status' => 'menunggu',
            ]);

            foreach ($validated['details'] as $detail) {
                DetailPeminjaman::create([
                    'peminjaman_id' => $peminjaman->id,
                    'alat_id' => $detail['alat_id'],
                    'jumlah' => $detail['jumlah'],
                ]);
            }

            DB::commit();

            // Notifikasi konfirmasi pengajuan
\App\Models\Notification::create([
    'user_id'       => $peminjaman->user_id,
    'peminjaman_id' => $peminjaman->id,
    'judul'         => 'Pengajuan Diterima',
    'pesan'         => 'Pengajuan peminjaman #' . $peminjaman->id . ' sudah diterima dan sedang menunggu persetujuan petugas.',
    'tipe'          => 'menunggu',
]);

            return (new PeminjamanResource($peminjaman->load(['user', 'detailPeminjaman.alat'])))
                ->additional(['message' => 'Peminjaman berhasil diajukan'])
                ->response()
                ->setStatusCode(201);
                
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Terjadi kesalahan: ' . $e->getMessage()], 500);
        }
    }

    public function peminjamanSaya(Request $request)
    {
        $query = Peminjaman::with(['user', 'petugasApproval', 'detailPeminjaman.alat'])
            ->where('user_id', $request->user()->id);

        if ($request->filled('search')) {
            $searchTerm = '%' . $request->search . '%';
            $query->whereHas('detailPeminjaman.alat', function ($q) use ($searchTerm) {
                $q->where('nama_alat', 'like', $searchTerm);
            });
        }

        if ($request->has('filter.status')) {
            $query->where('status', $request->input('filter.status'));
        }

        if ($request->has('filter.tanggal_pinjam')) {
            $query->whereDate('tanggal_pinjam', $request->input('filter.tanggal_pinjam'));
        }

        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        
        $allowedSorts = ['tanggal_pinjam', 'tanggal_kembali_rencana', 'created_at'];
        
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder === 'asc' ? 'asc' : 'desc');
        } else {
            $query->latest();
        }

        $limit = $request->input('limit', 10);
        $peminjamans = $query->paginate($limit)->withQueryString();
        
        return PeminjamanResource::collection($peminjamans);
    }

    public function showPeminjamanSaya(Peminjaman $peminjaman, Request $request)
    {
        if ($peminjaman->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return new PeminjamanResource($peminjaman->load(['user', 'petugasApproval', 'detailPeminjaman.alat']));
    }

    public function ajukanKembali(Peminjaman $peminjaman, Request $request)
    {
        if ($peminjaman->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($peminjaman->status !== 'ditolak') {
            return response()->json([
                'message' => 'Hanya peminjaman yang ditolak yang dapat diajukan kembali.'
            ], 422);
        }

        DB::beginTransaction();
        
        try {
            foreach ($peminjaman->detailPeminjaman as $detail) {
                $alat = Alat::findOrFail($detail->alat_id);
                if ($alat->stok_total < $detail->jumlah) {
                    return response()->json([
                        'message' => "Stok alat {$alat->nama_alat} tidak mencukupi."
                    ], 422);
                }
            }

            $peminjaman->update([
                'status' => 'menunggu',
            ]);

            DB::commit();

            return (new PeminjamanResource($peminjaman->load(['user', 'petugasApproval', 'detailPeminjaman.alat'])))
                ->additional(['message' => 'Peminjaman berhasil diajukan kembali']);
                
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Terjadi kesalahan: ' . $e->getMessage()], 500);
        }
    }

      /**
     * EXPORT PEMINJAMAN (untuk admin)
     */
    public function export(Request $request)
    {
        $query = Peminjaman::with(['user', 'petugasApproval', 'detailPeminjaman.alat']);

        // SEARCH
        if ($request->filled('search')) {
            $searchTerm = '%' . $request->search . '%';
            $query->where(function ($q) use ($searchTerm) {
                $q->whereHas('user', function ($q2) use ($searchTerm) {
                    $q2->where('name', 'like', $searchTerm)
                      ->orWhere('email', 'like', $searchTerm);
                })->orWhereHas('detailPeminjaman.alat', function ($q2) use ($searchTerm) {
                    $q2->where('nama_alat', 'like', $searchTerm);
                });
            });
        }

        // FILTER STATUS
        if ($request->has('filter.status')) {
            $query->where('status', $request->input('filter.status'));
        }

        // FILTER TANGGAL PINJAM
        if ($request->has('filter.tanggal_pinjam_from') && $request->has('filter.tanggal_pinjam_to')) {
            $query->whereBetween('tanggal_pinjam', [
                $request->input('filter.tanggal_pinjam_from'),
                $request->input('filter.tanggal_pinjam_to')
            ]);
        }

        $peminjamans = $query->orderBy('created_at', 'desc')->get();
        
        $format = $request->input('format', 'excel');
        
        if ($format === 'pdf') {
            $pdf = Pdf::loadView('reports.peminjaman', [
                'peminjamans' => $peminjamans,
                'title' => 'Laporan Peminjaman - Admin',
                'user' => $request->user(),
                'tanggal_from' => $request->input('filter.tanggal_pinjam_from'),
                'tanggal_to' => $request->input('filter.tanggal_pinjam_to'),
                'exported_at' => now()
            ]);
            
            return $pdf->download('laporan_peminjaman_' . now()->format('Ymd_His') . '.pdf');
        }
        
        return Excel::download(new PeminjamanExport($peminjamans), 'laporan_peminjaman_' . now()->format('Ymd_His') . '.xlsx');
    }
}