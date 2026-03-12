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
            'tanggal_pinjam' => $this->tanggal_pinjam,
            'tanggal_kembali_rencana' => $this->tanggal_kembali_rencana,
            'tanggal_kembali_aktual' => $this->tanggal_kembali_aktual,
            'status' => $this->status,
            'keterangan' => $this->keterangan,
            'catatan_petugas' => $this->catatan_petugas,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'user' => new UserResource($this->whenLoaded('user')),
            'alat' => new AlatResource($this->whenLoaded('alat')),
            'petugas' => new UserResource($this->whenLoaded('petugas')),
        ];
    }
}