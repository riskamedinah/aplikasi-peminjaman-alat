<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\AlatRequest;
use App\Http\Resources\AlatResource;
use App\Models\Alat;
use App\Models\Kategori;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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
        $data = $request->validated();

        //generate kode alat otomatis
        $kategori = Kategori::find($data['kategori_id']);
        $prefix = strtoupper(substr($kategori->nama_kategori, 0, 3));

        $lastAlat = Alat::where('kode_alat', 'LIKE', $prefix . '-%')
            ->orderBy('id', 'desc')
            ->first();

        if ($lastAlat) {
            $lastNumber = (int) substr($lastAlat->kode_alat, -3);
            $newNumber = str_pad($lastNumber + 1, 3, '0', STR_PAD_LEFT);
        } else {
            $newNumber = '001';
        }

        $data['kode_alat'] = $prefix . '-' . $newNumber;
        
        // Handle base64 gambar dari canvas
        if ($request->has('gambar_data')) {
            $imagePath = $this->saveBase64Image($request->input('gambar_data'));
            $data['gambar'] = $imagePath;
        }
        
        $alat = Alat::create($data);

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
         $data = $request->validated();

         //jika kategori diubah, update kode alat
         if (isset($data['kategori_id']) && $data['kategori_id'] != $alat->kategori_id) {
            $kategori = Kategori::find($data['kategori_id']);
            $prefix = strtoupper(substr($kategori->nama_kategori, 0, 3));
            
            $lastAlat = Alat::where('kode_alat', 'LIKE', $prefix . '-%')
                ->orderBy('id', 'desc')
                ->first();

            if ($lastAlat) {
                $lastNumber = (int) substr($lastAlat->kode_alat, -3);
                $newNumber = str_pad($lastNumber + 1, 3, '0', STR_PAD_LEFT);
            } else {
                $newNumber = '001';
            }

            $data['kode_alat'] = $prefix . '-' . $newNumber;
        }
        
        if ($request->has('gambar_data')) {
            if ($alat->gambar) {
                Storage::disk('public')->delete($alat->gambar);
            }
            
            $imagePath = $this->saveBase64Image($request->input('gambar_data'));
            $data['gambar'] = $imagePath;
        }
        
        $alat->update($data);

        return (new AlatResource($alat))
            ->additional(['message' => 'Alat berhasil diperbarui']);
    }

    public function destroy(Alat $alat)
    {
         if ($alat->gambar) {
            Storage::disk('public')->delete($alat->gambar);
        }

        // Delete related detail_peminjaman first
        $alat->detailPeminjaman()->delete();
        
        $alat->delete();

        return response()->json([
            'message' => 'Alat berhasil dihapus'
        ]);
    }

     /**
     * Save base64 image to storage
     */
    private function saveBase64Image($base64Image)
    {
        // Remove data:image/png;base64, prefix
        $imageData = explode(',', $base64Image);
        $base64 = end($imageData);
        
        // Decode base64
        $image = base64_decode($base64);
        
        // Generate unique filename
        $filename = 'alat/' . Str::uuid() . '.png';
        
        // Save to storage
        Storage::disk('public')->put($filename, $image);
        
        return $filename;
    }
}