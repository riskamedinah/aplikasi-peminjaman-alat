<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PeminjamanResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user' => [
                'id' => $this->user?->id,
                'name' => $this->user?->name,
                'email' => $this->user?->email,
            ],
            'petugas_approval' => $this->petugasApproval ? [
                'id' => $this->petugasApproval->id,
                'name' => $this->petugasApproval->name,
            ] : null,
            'tanggal_pinjam' => $this->tanggal_pinjam,
            'tanggal_kembali_rencana' => $this->tanggal_kembali_rencana,
            'tanggal_kembali_actual' => $this->tanggal_kembali_actual,
            'status' => $this->status,
            'keperluan' => $this->keperluan,
            'catatan_petugas' => $this->catatan_petugas,
            'details' => DetailPeminjamanResource::collection($this->whenLoaded('detailPeminjaman')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}