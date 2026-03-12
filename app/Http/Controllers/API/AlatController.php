<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Alat;
use App\Http\Resources\AlatResource;
use Illuminate\Http\Request;

class AlatController extends Controller
{
    /**
     * GET /api/alat
     */
    public function index(Request $request)
    {
        $query = Alat::query();

        if ($request->filled('search')) {
            $query->where('nama_alat', 'like', '%' . $request->search . '%');
        }

        if ($request->has('filter.kategori_id')) {
            $query->where('kategori_id', $request->input('filter.kategori_id'));
        }

        if ($request->has('filter.kondisi')) {
            $query->where('kondisi', $request->input('filter.kondisi'));
        }

        if ($request->has('filter.status')) {
            $query->where('status', $request->input('filter.status'));
        }

        if ($request->has('sort')) {
            $sortField = $request->input('sort');
            $sortOrder = $request->input('order', 'asc');
            
            $allowedSorts = ['nama_alat', 'stok', 'created_at'];
            
            if (in_array($sortField, $allowedSorts)) {
                $query->orderBy($sortField, $sortOrder);
            }
        } else {
            $query->latest();
        }

        $alats = $query->paginate(10)->withQueryString();
        
        return AlatResource::collection($alats);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'kategori_id' => 'required|exists:kategoris,id',
            'nama_alat'   => 'required|string|max:255',
            'deskripsi'   => 'nullable|string',
            'stok'        => 'required|integer|min:0',
            'kondisi'     => 'required|string',
            'status'      => 'required|string',
            'gambar'      => 'nullable|string',
        ]);

        $alat = Alat::create($validated);

        return (new AlatResource($alat))
            ->additional(['message' => 'Alat berhasil ditambahkan'])
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Alat $alat)
    {
        return new AlatResource($alat);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Alat $alat)
    {
        $validated = $request->validate([
            'kategori_id' => 'sometimes|exists:kategoris,id',
            'nama_alat'   => 'sometimes|string|max:255',
            'deskripsi'   => 'nullable|string',
            'stok'        => 'sometimes|integer|min:0',
            'kondisi'     => 'sometimes|string',
            'status'      => 'sometimes|string',
            'gambar'      => 'nullable|string',
        ]);

        $alat->update($validated);

        return (new AlatResource($alat))
            ->additional(['message' => 'Alat berhasil diperbarui']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Alat $alat)
    {
        if ($alat->peminjaman()->exists()) {
            return response()->json([
                'message' => 'Alat tidak dapat dihapus karena memiliki riwayat peminjaman.'
            ], 409);
        }

        $alat->delete();

        return response()->json([
            'message' => 'Alat berhasil dihapus'
        ]);
    }
}
