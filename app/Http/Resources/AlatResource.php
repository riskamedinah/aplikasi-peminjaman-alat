<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AlatResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'kode_alat' => $this->kode_alat,
            'nama_alat' => $this->nama_alat,
            'deskripsi' => $this->deskripsi,
            'gambar' => $this->gambar,
            'stok_total' => $this->stok_total,
            'kondisi' => $this->kondisi,
            'kategori' => $this->whenLoaded('kategori', function () {
                return [
                    'id' => $this->kategori->id,
                    'nama_kategori' => $this->kategori->nama_kategori,
                ];
            }),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}