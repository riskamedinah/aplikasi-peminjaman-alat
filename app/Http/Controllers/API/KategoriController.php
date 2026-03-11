<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\KategoriRequest;
use App\Http\Resources\KategoriResource;
use App\Models\Kategori;
use Illuminate\Http\Request;

class KategoriController extends Controller
{
    /**
     * GET /api/kategori
     * Menampilkan daftar semua kategori
     */
    public function index(Request $request)
    {
        $query = Kategori::query();

        if ($request->has('search')) {
            $query->where('nama_kategori', 'like', '%' . $request->search . '%');
        }

        $query->latest();

        $kategoris = $query->get();
        return KategoriResource::collection($kategoris);
    }

    /**
     * POST /api/kategori
     * Menambah kategori baru
     */
    public function store(KategoriRequest $request)
    {
        $kategori = Kategori::create($request->validated());

        return (new KategoriResource($kategori))
            ->additional(['message' => 'Kategori berhasil ditambahkan'])
            ->response()
            ->setStatusCode(201);
    }

    /**
     * PUT /api/kategori/{id}
     * Mengupdate data kategori
     */
    public function update(KategoriRequest $request, Kategori $kategori)
    {
        $kategori->update($request->validated());

        return (new KategoriResource($kategori))
            ->additional(['message' => 'Kategori berhasil diperbarui']);
    }

    /**
     * DELETE /api/kategori/{id}
     * Menghapus kategori
     */
    public function destroy(Kategori $kategori)
    {
        if ($kategori->alats()->exists()) {
            return response()->json([
                'message' => 'Kategori tidak dapat dihapus karena masih memiliki alat.'
            ], 409);
        }

        $kategori->delete();

        return response()->json([
            'message' => 'Kategori berhasil dihapus'
        ]);
    }
}