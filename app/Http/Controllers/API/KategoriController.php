<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\KategoriRequest;
use App\Http\Resources\KategoriResource;
use App\Models\Kategori;
use Illuminate\Http\Request;

class KategoriController extends Controller
{
    public function index(Request $request)
{
    $query = Kategori::query();

    if ($request->filled('search')) {
        $query->where('nama_kategori', 'like', '%' . $request->search . '%');
    }

    if ($request->has('filter.nama_kategori')) {
        $query->where('nama_kategori', 'like', '%' . $request->input('filter.nama_kategori') . '%');
    }

    $sortBy = $request->input('sort_by', 'created_at');
    $sortOrder = $request->input('sort_order', 'desc');
    
    if (in_array($sortBy, ['nama_kategori', 'created_at'])) {
        $query->orderBy($sortBy, $sortOrder === 'asc' ? 'asc' : 'desc');
    } else {
        $query->latest();
    }

    $limit = $request->input('limit', 10);
    $kategoris = $query->paginate($limit)->withQueryString();
    
    return KategoriResource::collection($kategoris);
}

    public function store(KategoriRequest $request)
    {
        $kategori = Kategori::create($request->validated());

        return (new KategoriResource($kategori))
            ->additional(['message' => 'Kategori berhasil ditambahkan'])
            ->response()
            ->setStatusCode(201);
    }

    public function show(Kategori $kategori)
    {
        return new KategoriResource($kategori);
    }

    public function update(KategoriRequest $request, Kategori $kategori)
    {
        $kategori->update($request->validated());

        return (new KategoriResource($kategori))
            ->additional(['message' => 'Kategori berhasil diperbarui']);
    }

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