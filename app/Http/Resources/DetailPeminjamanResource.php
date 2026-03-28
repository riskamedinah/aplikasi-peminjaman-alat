<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DetailPeminjamanResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'alat' => [
                'id' => $this->alat?->id,
                'kode_alat' => $this->alat?->kode_alat,
                'nama_alat' => $this->alat?->nama_alat,
                'kondisi' => $this->alat?->kondisi,
            ],
            'jumlah' => $this->jumlah,
        ];
    }
}