<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LogAktivitasResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user' => [
                'id' => $this->user?->id,
                'name' => $this->user?->name,
                'email' => $this->user?->email,
                'role' => $this->user?->role,
            ],
            'peminjaman' => $this->peminjaman ? [
                'id' => $this->peminjaman->id,
                'status' => $this->peminjaman->status,
            ] : null,
            'aksi' => $this->aksi,
            'keterangan' => $this->keterangan,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}