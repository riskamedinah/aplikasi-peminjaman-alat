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
     */
    public function index(Request $request)
    {
        $query = Kategori::query();

        if ($request->filled('search')) {
            $query->where('nama_kategori', 'like', '%' . $request->search . '%');
        }

        if ($request->has('filter.nama_kategori')) {
            $query->where('nama_kategori', 'like', '%' . $request->input('filter.nama_kategori') . '%');
        }

        $query->latest();

        $kategoris = $query->paginate(10)->withQueryString();
        return KategoriResource::collection($kategoris);
    }

    /**
     * POST /api/kategori
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
     * GET /api/kategori/{id}
     */
    public function show(Kategori $kategori)
    {
        return new KategoriResource($kategori);
    }

    /**
     * PUT /api/kategori/{id}
     */
    public function update(KategoriRequest $request, Kategori $kategori)
    {
        $kategori->update($request->validated());

        return (new KategoriResource($kategori))
            ->additional(['message' => 'Kategori berhasil diperbarui']);
    }

    /**
     * DELETE /api/kategori/{id}
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