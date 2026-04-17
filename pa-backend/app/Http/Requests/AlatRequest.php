<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AlatRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'kategori_id' => 'required|exists:kategori,id',
            'kode_alat' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('alat')->ignore($this->alat),
            ],
            'nama_alat' => 'required|string|max:100',
            'deskripsi' => 'nullable|string',
            'gambar_data' => 'nullable|string',
            'stok_total' => 'required|integer|min:0',
            'kondisi' => 'required|in:baik,rusak,perbaikan',
        ];
    }

    public function messages(): array
    {
        return [
            'kategori_id.required' => 'Kategori wajib dipilih.',
            'kategori_id.exists' => 'Kategori tidak ditemukan.',
            'kode_alat.unique' => 'Kode alat sudah digunakan.',
            'nama_alat.required' => 'Nama alat wajib diisi.',
            'stok_total.required' => 'Stok wajib diisi.',
            'stok_total.min' => 'Stok tidak boleh kurang dari 0.',
            'kondisi.required' => 'Kondisi alat wajib dipilih.',
            'kondisi.in' => 'Kondisi harus berupa baik, rusak, atau perbaikan.',
            'gambar_data.string' => 'Format gambar tidak valid',
        ];
    }
}