<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PeminjamanResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'jumlah' => $this->jumlah,
            'status' => $this->status,
            'tanggal_pinjam' => $this->tanggal_pinjam,
            'tanggal_kembali_rencana' => $this->tanggal_kembali_rencana,
            'tanggal_kembali_aktual' => $this->tanggal_kembali_aktual,
            'created_at' => $this->created_at,
            'user' => new UserResource($this->whenLoaded('user')),
            'alat' => new AlatResource($this->whenLoaded('alat')),
        ];
    }
}
