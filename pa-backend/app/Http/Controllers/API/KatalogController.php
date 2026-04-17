<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Alat;
use App\Http\Resources\AlatResource;
use Illuminate\Http\Request;

class KatalogController extends Controller
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

        $sortBy = $request->input('sort_by', 'nama_alat');
        $sortOrder = $request->input('sort_order', 'asc');
        
        $allowedSorts = ['nama_alat', 'stok_total'];
        
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder === 'asc' ? 'asc' : 'desc');
        } else {
            $query->orderBy('nama_alat', 'asc');
        }

        $limit = $request->input('limit', 10);
        $alats = $query->paginate($limit)->withQueryString();
        
        return AlatResource::collection($alats);
    }

    public function show(Alat $alat)
    {
        return new AlatResource($alat->load('kategori'));
    }
}