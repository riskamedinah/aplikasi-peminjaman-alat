<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminPeminjamanRequest;
use App\Http\Resources\PeminjamanResource;
use App\Models\Peminjaman;
use App\Models\DetailPeminjaman;
use App\Models\Alat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminPeminjamanController extends Controller
{
    public function index(Request $request)
    {
        $query = Peminjaman::with(['user', 'petugasApproval', 'detailPeminjaman.alat']);

        if ($request->filled('search')) {
            $searchTerm = '%' . $request->search . '%';
            $query->whereHas('user', function ($q) use ($searchTerm) {
                $q->where('name', 'like', $searchTerm)
                  ->orWhere('email', 'like', $searchTerm);
            })->orWhereHas('detailPeminjaman.alat', function ($q) use ($searchTerm) {
                $q->where('nama_alat', 'like', $searchTerm);
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

    public function show(Peminjaman $peminjaman)
    {
        return new PeminjamanResource($peminjaman->load(['user', 'petugasApproval', 'detailPeminjaman.alat']));
    }

    public function update(AdminPeminjamanRequest $request, Peminjaman $peminjaman)
    {
        DB::beginTransaction();
        
        try {
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
                'catatan_petugas' => $validated['catatan_petugas'] ?? $peminjaman->catatan_petugas,
            ]);
            
            if ($request->has('details')) {
                $peminjaman->detailPeminjaman()->delete();
                
                foreach ($validated['details'] as $detail) {
                    DetailPeminjaman::create([
                        'peminjaman_id' => $peminjaman->id,
                        'alat_id' => $detail['alat_id'],
                        'jumlah' => $detail['jumlah'],
                    ]);
                }
            }
            
            DB::commit();
            
            return (new PeminjamanResource($peminjaman->load(['user', 'petugasApproval', 'detailPeminjaman.alat'])))
                ->additional(['message' => 'Peminjaman berhasil diperbarui']);
                
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Terjadi kesalahan: ' . $e->getMessage()], 500);
        }
    }

    public function destroy(Peminjaman $peminjaman)
    {
        if ($peminjaman->status === 'dipinjam' || $peminjaman->status === 'dikembalikan') {
            return response()->json([
                'message' => 'Peminjaman yang sedang berlangsung atau sudah dikembalikan tidak dapat dihapus.'
            ], 409);
        }
        
        DB::beginTransaction();
        
        try {
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
}