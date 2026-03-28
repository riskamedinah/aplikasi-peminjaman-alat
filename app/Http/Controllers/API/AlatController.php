<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\AlatRequest;
use App\Http\Resources\AlatResource;
use App\Models\Alat;
use Illuminate\Http\Request;

class AlatController extends Controller
{
    public function index(Request $request)
    {
        $query = Alat::with('kategori');

        if ($request->filled('search')) {
            $query->where('nama_alat', 'like', '%' . $request->search . '%');
        }

        if ($request->has('filter.kategori_id')) {
            $query->where('kategori_id', $request->input('filter.kategori_id'));
        }

        if ($request->has('filter.kondisi')) {
            $query->where('kondisi', $request->input('filter.kondisi'));
        }

        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        
        $allowedSorts = ['nama_alat', 'stok_total', 'created_at'];
        
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder === 'asc' ? 'asc' : 'desc');
        } else {
            $query->latest();
        }

        $limit = $request->input('limit', 10);
        $alats = $query->paginate($limit)->withQueryString();
        
        return AlatResource::collection($alats);
    }

    public function store(AlatRequest $request)
    {
        $alat = Alat::create($request->validated());

        return (new AlatResource($alat))
            ->additional(['message' => 'Alat berhasil ditambahkan'])
            ->response()
            ->setStatusCode(201);
    }

    public function show(Alat $alat)
    {
        return new AlatResource($alat->load('kategori'));
    }

    public function update(AlatRequest $request, Alat $alat)
    {
        $alat->update($request->validated());

        return (new AlatResource($alat))
            ->additional(['message' => 'Alat berhasil diperbarui']);
    }

    public function destroy(Alat $alat)
    {
        if ($alat->detailPeminjaman()->exists()) {
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