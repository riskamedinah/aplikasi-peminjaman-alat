<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\PetugasPeminjamanRequest;
use App\Http\Resources\PeminjamanResource;
use App\Models\Peminjaman;
use App\Models\DetailPeminjaman;
use App\Models\Alat;
use App\Models\LogAktivitas;
use App\Models\User;
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

        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        
        $allowedSorts = ['tanggal_pinjam', 'created_at'];
        
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder === 'asc' ? 'asc' : 'desc');
        } else {
            $query->latest();
        }

        $limit = $request->input('limit', 10);
        $peminjamans = $query->paginate($limit)->withQueryString();
        
        return PeminjamanResource::collection($peminjamans);
    }

    public function store(PetugasPeminjamanRequest $request)
    {
        DB::beginTransaction();
        
        try {
            $currentUser = $request->user();
            
            if (!$currentUser) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }
            
            $validated = $request->validated();
            
            // Cek stok
            foreach ($validated['details'] as $detail) {
                $alat = Alat::findOrFail($detail['alat_id']);
                if ($alat->stok_total < $detail['jumlah']) {
                    return response()->json([
                        'message' => "Stok alat {$alat->nama_alat} tidak mencukupi. Stok tersedia: {$alat->stok_total}"
                    ], 422);
                }
            }
            
            // Buat peminjaman
            $peminjaman = Peminjaman::create([
                'user_id' => $validated['user_id'],
                'petugas_approval_id' => $validated['petugas_approval_id'] ?? null,
                'tanggal_pinjam' => $validated['tanggal_pinjam'],
                'tanggal_kembali_rencana' => $validated['tanggal_kembali_rencana'],
                'tanggal_kembali_actual' => $validated['tanggal_kembali_actual'] ?? null,
                'status' => $validated['status'],
                'keperluan' => $validated['keperluan'],
            ]);
            
            // Buat detail peminjaman
            foreach ($validated['details'] as $detail) {
                DetailPeminjaman::create([
                    'peminjaman_id' => $peminjaman->id,
                    'alat_id' => $detail['alat_id'],
                    'jumlah' => $detail['jumlah'],
                ]);
            }
            
            // Update stock jika status 'dipinjam' atau 'disetujui'
            if ($validated['status'] === 'dipinjam' || $validated['status'] === 'disetujui') {
                foreach ($validated['details'] as $detail) {
                    $alat = Alat::findOrFail($detail['alat_id']);
                    $alat->stok_total -= $detail['jumlah'];
                    $alat->save();
                }
            }
            
            // Ambil nama user target
            $targetUser = User::find($validated['user_id']);
            $targetUserName = $targetUser ? $targetUser->name : 'Unknown';
            
            // LOG AKTIVITAS
            LogAktivitas::create([
                'user_id' => $currentUser->id,
                'peminjaman_id' => $peminjaman->id,
                'aksi' => 'create',
                'keterangan' => 'Petugas ' . $currentUser->name . ' membuat peminjaman untuk ' . $targetUserName . ' (Status: ' . $peminjaman->status . ')',
            ]);
            
            DB::commit();

            
            
            return (new PeminjamanResource($peminjaman->load(['user', 'petugasApproval', 'detailPeminjaman.alat'])))
                ->additional(['message' => 'Peminjaman berhasil ditambahkan'])
                ->response()
                ->setStatusCode(201);
                
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Terjadi kesalahan: ' . $e->getMessage()], 500);
        }
    }

    public function show(Peminjaman $peminjaman)
    {
        return new PeminjamanResource($peminjaman->load(['user', 'petugasApproval', 'detailPeminjaman.alat']));
    }

    public function update(PetugasPeminjamanRequest $request, Peminjaman $peminjaman)
    {
        DB::beginTransaction();
        
        try {
            $currentUser = $request->user();
            
            if (!$currentUser) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }
            
            $validated = $request->validated();
            
            $oldStatus = $peminjaman->status;
            $newStatus = $validated['status'];
            
            if ($oldStatus === 'dikembalikan' && $newStatus !== 'dikembalikan') {
                return response()->json([
                    'message' => 'Peminjaman yang sudah dikembalikan tidak dapat diubah statusnya.'
                ], 422);
            }
            
            if ($newStatus === 'disetujui' || $newStatus === 'dipinjam') {
                foreach ($validated['details'] as $detail) {
                    $alat = Alat::findOrFail($detail['alat_id']);
                    if ($alat->stok_total < $detail['jumlah']) {
                        return response()->json([
                            'message' => "Stok alat {$alat->nama_alat} tidak mencukupi."
                        ], 422);
                    }
                }
            }
            
            $peminjaman->update([
                'user_id' => $validated['user_id'],
                'petugas_approval_id' => $validated['petugas_approval_id'] ?? $peminjaman->petugas_approval_id,
                'tanggal_pinjam' => $validated['tanggal_pinjam'],
                'tanggal_kembali_rencana' => $validated['tanggal_kembali_rencana'],
                'tanggal_kembali_actual' => $validated['tanggal_kembali_actual'] ?? $peminjaman->tanggal_kembali_actual,
                'status' => $validated['status'],
                'keperluan' => $validated['keperluan'],
            ]);
            
            // Handle stock update saat status berubah
            if ($oldStatus !== $newStatus) {
                $isOldStatusPinjam = ($oldStatus === 'dipinjam' || $oldStatus === 'disetujui');
                $isNewStatusPinjam = ($newStatus === 'dipinjam' || $newStatus === 'disetujui');
                
                // Jika status berubah MENJADI 'dipinjam' atau 'disetujui', kurangi stok
                if (!$isOldStatusPinjam && $isNewStatusPinjam) {
                    foreach ($peminjaman->detailPeminjaman as $detail) {
                        $alat = Alat::findOrFail($detail->alat_id);
                        $alat->stok_total -= $detail->jumlah;
                        $alat->save();
                    }
                }
                
                // Jika status berubah DARI 'dipinjam'/'disetujui' MENJADI 'dikembalikan' atau 'ditolak', tambah stok kembali
                if ($isOldStatusPinjam && ($newStatus === 'dikembalikan' || $newStatus === 'ditolak')) {
                    foreach ($peminjaman->detailPeminjaman as $detail) {
                        $alat = Alat::findOrFail($detail->alat_id);
                        $alat->stok_total += $detail->jumlah;
                        $alat->save();
                    }
                }
            }
            
            if ($request->has('details')) {
                // Hapus detail lama
                $peminjaman->detailPeminjaman()->delete();
                
                // Tambah detail baru
                foreach ($validated['details'] as $detail) {
                    DetailPeminjaman::create([
                        'peminjaman_id' => $peminjaman->id,
                        'alat_id' => $detail['alat_id'],
                        'jumlah' => $detail['jumlah'],
                    ]);
                }
            }
            
            // LOG AKTIVITAS
            LogAktivitas::create([
                'user_id' => $currentUser->id,
                'peminjaman_id' => $peminjaman->id,
                'aksi' => 'update',
                'keterangan' => 'Petugas ' . $currentUser->name . ' mengupdate peminjaman (Status: ' . $oldStatus . ' → ' . $newStatus . ')',
            ]);
            
            DB::commit();

            // Notifikasi perubahan status ke peminjam
if ($oldStatus !== $newStatus) {
    $judulMap = [
        'disetujui'    => 'Peminjaman Disetujui',
        'ditolak'      => 'Peminjaman Ditolak',
        'dipinjam'     => 'Alat Siap Diambil',
        'dikembalikan' => 'Peminjaman Selesai',
        'dibatalkan'   => 'Peminjaman Dibatalkan',
    ];
    $pesanMap = [
        'disetujui'    => 'Pengajuan peminjaman #' . $peminjaman->id . ' telah disetujui oleh petugas.',
        'ditolak'      => 'Pengajuan peminjaman #' . $peminjaman->id . ' ditolak.' . ($peminjaman->catatan_petugas ? ' Catatan: ' . $peminjaman->catatan_petugas : ''),
        'dipinjam'     => 'Peminjaman #' . $peminjaman->id . ' aktif. Alat sudah siap diambil.',
        'dikembalikan' => 'Peminjaman #' . $peminjaman->id . ' selesai. Terima kasih sudah mengembalikan tepat waktu.',
        'dibatalkan'   => 'Peminjaman #' . $peminjaman->id . ' telah dibatalkan.',
    ];

    if (isset($judulMap[$newStatus])) {
        \App\Models\Notification::create([
            'user_id'       => $peminjaman->user_id,
            'peminjaman_id' => $peminjaman->id,
            'judul'         => $judulMap[$newStatus],
            'pesan'         => $pesanMap[$newStatus],
            'tipe'          => $newStatus,
        ]);
    }
}
            
            return (new PeminjamanResource($peminjaman->load(['user', 'petugasApproval', 'detailPeminjaman.alat'])))
                ->additional(['message' => 'Peminjaman berhasil diperbarui']);
                
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Terjadi kesalahan: ' . $e->getMessage()], 500);
        }
    }

    public function destroy(Request $request, Peminjaman $peminjaman)
    {
        if ($peminjaman->status === 'dipinjam') {
            return response()->json([
                'message' => 'Peminjaman yang sedang berlangsung tidak dapat dihapus.'
            ], 409);
        }
        
        DB::beginTransaction();
        
        try {
            $currentUser = $request->user();
            
            if (!$currentUser) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }
            
            $peminjamanId = $peminjaman->id;
            $peminjamanStatus = $peminjaman->status;
            
            // Log aktivitas SEBELUM delete
            LogAktivitas::create([
                'user_id' => $currentUser->id,
                'peminjaman_id' => $peminjamanId,
                'aksi' => 'delete',
                'keterangan' => 'Petugas ' . $currentUser->name . ' menghapus peminjaman status ' . $peminjamanStatus,
            ]);
            
            // Hapus peminjaman
            $peminjaman->detailPeminjaman()->delete();
            $peminjaman->delete();
            
            DB::commit();
            
            return response()->json([
                'message' => 'Peminjaman berhasil dihapus'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Terjadi kesalahan: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Export peminjaman ke Excel atau PDF
     */
    public function export(Request $request)
    {
        $query = Peminjaman::with(['user', 'petugasApproval', 'detailPeminjaman.alat']);
        $user = $request->user();

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

        // FILTER TANGGAL
        if ($request->has('filter.tanggal_pinjam_from') && $request->has('filter.tanggal_pinjam_to')) {
            $query->whereBetween('tanggal_pinjam', [
                $request->input('filter.tanggal_pinjam_from'),
                $request->input('filter.tanggal_pinjam_to')
            ]);
        }

        $peminjamans = $query->orderBy('created_at', 'desc')->get();
        $format = $request->input('format', 'excel');

        if ($format === 'pdf') {
            $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('reports.peminjaman', [
                'peminjamans' => $peminjamans,
                'user' => $user,
                'tanggal_from' => $request->input('filter.tanggal_pinjam_from'),
                'tanggal_to' => $request->input('filter.tanggal_pinjam_to'),
            ]);
            return $pdf->download('laporan_peminjaman_petugas_' . now()->format('Ymd_His') . '.pdf');
        }

        return \Maatwebsite\Excel\Facades\Excel::download(
            new \App\Exports\PeminjamanExport($peminjamans),
            'laporan_peminjaman_petugas_' . now()->format('Ymd_His') . '.xlsx'
        );
    }
}