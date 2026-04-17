<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AdminPeminjamanRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize()
    {
        // Hanya admin yang bisa akses
        return $this->user() && $this->user()->hasRole('admin');
        // Atau jika pakai guard: return true; dulu untuk testing
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules()
    {
        // Rules untuk CREATE (POST)
        $rules = [
            'user_id' => 'required|exists:users,id',
            'tanggal_pinjam' => 'required|date',
            'tanggal_kembali_rencana' => 'required|date|after_or_equal:tanggal_pinjam',
            'status' => 'required|in:menunggu,disetujui,dipinjam,dikembalikan,ditolak',
            'keperluan' => 'required|string|min:3',
            'details' => 'required|array|min:1',
            'details.*.alat_id' => 'required|exists:alat,id',
            'details.*.jumlah' => 'required|integer|min:1',
            'petugas_approval_id' => 'nullable|exists:users,id',
            'tanggal_kembali_actual' => 'nullable|date'
        ];

        // Rules untuk UPDATE (PUT/PATCH)
        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            $rules = [
                'user_id' => 'sometimes|required|exists:users,id',
                'tanggal_pinjam' => 'sometimes|required|date',
                'tanggal_kembali_rencana' => 'sometimes|required|date|after_or_equal:tanggal_pinjam',
                'status' => 'sometimes|required|in:menunggu,disetujui,dipinjam,dikembalikan,ditolak',
                'keperluan' => 'sometimes|required|string|min:3',
                'details' => 'sometimes|required|array|min:1',
                'details.*.alat_id' => 'required_with:details|exists:alat,id',
                'details.*.jumlah' => 'required_with:details|integer|min:1',
                'petugas_approval_id' => 'nullable|exists:users,id',
                'tanggal_kembali_actual' => 'nullable|date'
            ];
        }

        return $rules;
    }

    /**
     * Get custom messages for validation errors.
     */
    public function messages()
    {
        return [
            // User ID
            'user_id.required' => 'User ID wajib diisi',
            'user_id.exists' => 'User tidak ditemukan',
            
            // Tanggal
            'tanggal_pinjam.required' => 'Tanggal pinjam wajib diisi',
            'tanggal_pinjam.date' => 'Format tanggal pinjam tidak valid',
            'tanggal_kembali_rencana.required' => 'Tanggal kembali rencana wajib diisi',
            'tanggal_kembali_rencana.date' => 'Format tanggal kembali tidak valid',
            'tanggal_kembali_rencana.after_or_equal' => 'Tanggal kembali harus setelah atau sama dengan tanggal pinjam',
            'tanggal_kembali_actual.date' => 'Format tanggal kembali aktual tidak valid',
            
            // Status
            'status.required' => 'Status wajib diisi',
            'status.in' => 'Status tidak valid. Pilih: menunggu, disetujui, dipinjam, dikembalikan, ditolak',
            
            // Keperluan
            'keperluan.required' => 'Keperluan wajib diisi',
            'keperluan.string' => 'Keperluan harus berupa teks',
            'keperluan.min' => 'Keperluan minimal 3 karakter',
            
            // Details array
            'details.required' => 'Detail peminjaman wajib diisi',
            'details.array' => 'Format detail peminjaman tidak valid',
            'details.min' => 'Minimal 1 detail peminjaman',
            
            // Details items
            'details.*.alat_id.required' => 'ID alat wajib diisi',
            'details.*.alat_id.exists' => 'Alat tidak ditemukan',
            'details.*.jumlah.required' => 'Jumlah wajib diisi',
            'details.*.jumlah.integer' => 'Jumlah harus berupa angka',
            'details.*.jumlah.min' => 'Jumlah minimal 1',
            
            // Petugas approval
            'petugas_approval_id.exists' => 'Petugas approval tidak ditemukan',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation()
    {
        if ($this->has('tanggal_kembali_actual') && empty($this->tanggal_kembali_actual)) {
            $this->merge(['tanggal_kembali_actual' => null]);
        }
        
        if ($this->has('petugas_approval_id') && empty($this->petugas_approval_id)) {
            $this->merge(['petugas_approval_id' => null]);
        }
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($this->has('details')) {
                $alatIds = array_column($this->details, 'alat_id');
                if (count($alatIds) !== count(array_unique($alatIds))) {
                    $validator->errors()->add(
                        'details',
                        'Terdapat duplikasi alat dalam detail peminjaman.'
                    );
                }
            }
        });
    }
}