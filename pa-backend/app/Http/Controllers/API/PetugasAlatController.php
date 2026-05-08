<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\AlatResource;
use App\Models\Alat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PetugasAlatController extends Controller
{
    /**
     * GET /petugas/alat
     * Petugas bisa melihat semua alat (READ ONLY untuk data utama)
     */
    public function index(Request $request)
    {
        $query = Alat::with('kategori');

        // Filter search
        if ($request->filled('search')) {
            $query->where('nama_alat', 'like', '%' . $request->search . '%');
        }

        // Filter kategori
        if ($request->has('filter.kategori_id')) {
            $query->where('kategori_id', $request->input('filter.kategori_id'));
        }

        // Filter kondisi
        if ($request->has('filter.kondisi')) {
            $query->where('kondisi', $request->input('filter.kondisi'));
        }

        // Sorting
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        
        $allowedSorts = ['nama_alat', 'stok_total', 'kondisi', 'created_at'];
        
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder === 'asc' ? 'asc' : 'desc');
        } else {
            $query->latest();
        }

        $limit = $request->input('limit', 10);
        $alats = $query->paginate($limit)->withQueryString();
        
        return AlatResource::collection($alats);
    }

    /**
     * GET /petugas/alat/{id}
     * Petugas bisa melihat detail alat
     */
    public function show(Alat $alat)
    {
        return new AlatResource($alat->load('kategori'));
    }

    /**
     * PUT/PATCH /petugas/alat/{id}/stok
     * Petugas bisa mengupdate stok alat (tambah/kurangi)
     */
    public function updateStok(Request $request, Alat $alat)
    {
        $request->validate([
            'stok_total' => 'required|integer|min:0',
            'catatan' => 'nullable|string|max:255'
        ]);

        $oldStok = $alat->stok_total;
        $newStok = $request->stok_total;
        $perubahan = $newStok - $oldStok;

        DB::beginTransaction();
        try {
            $alat->update([
                'stok_total' => $newStok
            ]);

            // Catat log aktivitas (opsional)
            // ActivityLog::create([...]);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => "Stok alat '{$alat->nama_alat}' berhasil diupdate dari {$oldStok} menjadi {$newStok}",
                'data' => [
                    'id' => $alat->id,
                    'nama_alat' => $alat->nama_alat,
                    'stok_sebelumnya' => $oldStok,
                    'stok_sekarang' => $newStok,
                    'perubahan' => $perubahan
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengupdate stok: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * PUT/PATCH /petugas/alat/{id}/kondisi
     * Petugas bisa mengupdate kondisi alat
     */
    public function updateKondisi(Request $request, Alat $alat)
    {
        $request->validate([
            'kondisi' => 'required|in:baik,rusak_ringan,rusak_berat',
            'catatan' => 'nullable|string|max:255'
        ]);

        $oldKondisi = $alat->kondisi;
        $newKondisi = $request->kondisi;

        DB::beginTransaction();
        try {
            $alat->update([
                'kondisi' => $newKondisi
            ]);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => "Kondisi alat '{$alat->nama_alat}' berhasil diupdate dari {$oldKondisi} menjadi {$newKondisi}",
                'data' => [
                    'id' => $alat->id,
                    'nama_alat' => $alat->nama_alat,
                    'kondisi_sebelumnya' => $oldKondisi,
                    'kondisi_sekarang' => $newKondisi
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengupdate kondisi: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * POST /petugas/alat/{id}/tambah-stok
     * Petugas bisa menambah stok (lebih praktis)
     */
    public function tambahStok(Request $request, Alat $alat)
    {
        $request->validate([
            'jumlah' => 'required|integer|min:1',
            'catatan' => 'nullable|string|max:255'
        ]);

        $oldStok = $alat->stok_total;
        $newStok = $oldStok + $request->jumlah;

        DB::beginTransaction();
        try {
            $alat->update([
                'stok_total' => $newStok
            ]);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => "Stok alat '{$alat->nama_alat}' bertambah +{$request->jumlah} (sekarang: {$newStok})",
                'data' => [
                    'id' => $alat->id,
                    'nama_alat' => $alat->nama_alat,
                    'stok_sebelumnya' => $oldStok,
                    'stok_sekarang' => $newStok,
                    'stok_bertambah' => $request->jumlah
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menambah stok: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * POST /petugas/alat/{id}/kurangi-stok
     * Petugas bisa mengurangi stok (misal alat rusak/hilang)
     */
    public function kurangiStok(Request $request, Alat $alat)
    {
        $request->validate([
            'jumlah' => 'required|integer|min:1',
            'catatan' => 'nullable|string|max:255'
        ]);

        $oldStok = $alat->stok_total;
        
        if ($oldStok < $request->jumlah) {
            return response()->json([
                'status' => 'error',
                'message' => "Stok tidak mencukupi! Stok saat ini: {$oldStok}"
            ], 400);
        }

        $newStok = $oldStok - $request->jumlah;

        DB::beginTransaction();
        try {
            $alat->update([
                'stok_total' => $newStok
            ]);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => "Stok alat '{$alat->nama_alat}' berkurang -{$request->jumlah} (sekarang: {$newStok})",
                'data' => [
                    'id' => $alat->id,
                    'nama_alat' => $alat->nama_alat,
                    'stok_sebelumnya' => $oldStok,
                    'stok_sekarang' => $newStok,
                    'stok_berkurang' => $request->jumlah
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengurangi stok: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * GET /petugas/alat/kondisi/rusak
     * Mendapatkan semua alat yang dalam kondisi rusak
     */
    public function getRusak()
    {
        $alats = Alat::with('kategori')
            ->whereIn('kondisi', ['rusak_ringan', 'rusak_berat'])
            ->orderBy('kondisi', 'asc')
            ->get();

        return AlatResource::collection($alats);
    }

    /**
     * GET /petugas/alat/stok/rendah
     * Mendapatkan alat dengan stok di bawah threshold (default 5)
     */
    public function getStokRendah(Request $request)
    {
        $threshold = $request->input('threshold', 5);
        
        $alats = Alat::with('kategori')
            ->where('stok_total', '<', $threshold)
            ->orderBy('stok_total', 'asc')
            ->get();

        return AlatResource::collection($alats);
    }
}