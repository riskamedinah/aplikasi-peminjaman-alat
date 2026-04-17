<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PetugasPeminjamanRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'user_id' => 'required|exists:users,id',
            'tanggal_pinjam' => 'required|date',
            'tanggal_kembali_rencana' => 'required|date|after_or_equal:tanggal_pinjam',
            'tanggal_kembali_actual' => 'nullable|date',
            'status' => 'required|in:pending,dipinjam,ditolak,dikembalikan,disetujui',
            'keperluan' => 'required|string',
            'catatan_petugas' => 'nullable|string|max:255',
            'details' => 'required|array|min:1',
            'details.*.alat_id' => 'required|exists:alat,id',
            'details.*.jumlah' => 'required|integer|min:1',
        ];
    }
}