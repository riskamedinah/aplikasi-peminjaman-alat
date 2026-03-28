<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\PeminjamanResource;
use App\Models\Peminjaman;
use App\Models\Alat;
use App\Models\LogAktivitas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PetugasPeminjamanController extends Controller
{
    public function index(Request $request)
    {
        $query = Peminjaman::with(['user', 'petugasApproval', 'detailPeminjaman.alat']);

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

        if ($request->has('filter.status')) {
            $query->where('status', $request->input('filter.status'));
        }

        if ($request->has('filter.tanggal_pinjam')) {
            $query->whereDate('tanggal_pinjam', $request->input('filter.tanggal_pinjam'));
        }

        if ($request->has('filter.tanggal_pinjam_from') && $request->has('filter.tanggal_pinjam_to')) {
            $query->whereBetween('tanggal_pinjam', [
                $request->input('filter.tanggal_pinjam_from'),
                $request->input('filter.tanggal_pinjam_to')
            ]);
        }

        if ($request->has('filter.deadline')) {
            $query->whereDate('tanggal_kembali_rencana', $request->input('filter.deadline'));
        }

        if ($request->has('filter.deadline_from') && $request->has('filter.deadline_to')) {
            $query->whereBetween('tanggal_kembali_rencana', [
                $request->input('filter.deadline_from'),
                $request->input('filter.deadline_to')
            ]);
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

    public function show(Peminjaman $peminjaman)
    {
        return new PeminjamanResource($peminjaman->load(['user', 'petugasApproval', 'detailPeminjaman.alat']));
    }

    public function approve(Request $request, Peminjaman $peminjaman)
    {
        if ($peminjaman->status !== 'pending') {
            return response()->json([
                'message' => 'Peminjaman hanya dapat disetujui jika status masih pending.'
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

            foreach ($peminjaman->detailPeminjaman as $detail) {
                $alat = Alat::findOrFail($detail->alat_id);
                $alat->decrement('stok_total', $detail->jumlah);
            }

            $peminjaman->update([
                'status' => 'dipinjam',
                'petugas_approval_id' => $request->user()->id,
            ]);

            LogAktivitas::create([
                'user_id' => $request->user()->id,
                'peminjaman_id' => $peminjaman->id,
                'aksi' => 'approve',
                'keterangan' => 'Petugas ' . $request->user()->name . ' menyetujui peminjaman',
            ]);

            DB::commit();

            return (new PeminjamanResource($peminjaman->load(['user', 'petugasApproval', 'detailPeminjaman.alat'])))
                ->additional(['message' => 'Peminjaman berhasil disetujui']);
                
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Terjadi kesalahan: ' . $e->getMessage()], 500);
        }
    }

    public function reject(Request $request, Peminjaman $peminjaman)
    {
        if ($peminjaman->status !== 'pending') {
            return response()->json([
                'message' => 'Peminjaman hanya dapat ditolak jika status masih pending.'
            ], 422);
        }

        $request->validate([
            'alasan' => 'nullable|string|max:255',
        ]);

        $peminjaman->update([
            'status' => 'ditolak',
            'petugas_approval_id' => $request->user()->id,
            'catatan_petugas' => $request->alasan,
        ]);

        LogAktivitas::create([
            'user_id' => $request->user()->id,
            'peminjaman_id' => $peminjaman->id,
            'aksi' => 'reject',
            'keterangan' => 'Petugas ' . $request->user()->name . ' menolak peminjaman. Alasan: ' . ($request->alasan ?? '-'),
        ]);

        return (new PeminjamanResource($peminjaman->load(['user', 'petugasApproval', 'detailPeminjaman.alat'])))
            ->additional(['message' => 'Peminjaman berhasil ditolak']);
    }

    public function kembalikan(Request $request, Peminjaman $peminjaman)
    {
        if ($peminjaman->status !== 'dipinjam') {
            return response()->json([
                'message' => 'Pengembalian hanya dapat dilakukan untuk peminjaman yang sedang dipinjam.'
            ], 422);
        }

        DB::beginTransaction();
        
        try {
            foreach ($peminjaman->detailPeminjaman as $detail) {
                $alat = Alat::findOrFail($detail->alat_id);
                $alat->increment('stok_total', $detail->jumlah);
            }

            $peminjaman->update([
                'status' => 'dikembalikan',
                'tanggal_kembali_actual' => now()->format('Y-m-d'),
            ]);

            LogAktivitas::create([
                'user_id' => $request->user()->id,
                'peminjaman_id' => $peminjaman->id,
                'aksi' => 'return',
                'keterangan' => 'Petugas ' . $request->user()->name . ' mengkonfirmasi pengembalian alat',
            ]);

            DB::commit();

            return (new PeminjamanResource($peminjaman->load(['user', 'petugasApproval', 'detailPeminjaman.alat'])))
                ->additional(['message' => 'Peminjaman berhasil dikembalikan']);
                
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Terjadi kesalahan: ' . $e->getMessage()], 500);
        }
    }
}