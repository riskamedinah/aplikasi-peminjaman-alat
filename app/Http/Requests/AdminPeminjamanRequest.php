<?php

namespace App\Http\Requests\AdminPeminjamanRequest;
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AdminPeminjamanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => 'required|exists:users,id',
            'petugas_approval_id' => 'nullable|exists:users,id',
            'tanggal_pinjam' => 'required|date',
            'tanggal_kembali_rencana' => 'required|date|after_or_equal:tanggal_pinjam',
            'tanggal_kembali_actual' => 'nullable|date|after_or_equal:tanggal_pinjam',
            'status' => ['required', Rule::in(['pending', 'disetujui', 'ditolak', 'dipinjam', 'dikembalikan'])],
            'keperluan' => 'nullable|string',
            'catatan_petugas' => 'nullable|string',
            'details' => 'required|array|min:1',
            'details.*.alat_id' => 'required|exists:alat,id',
            'details.*.jumlah' => 'required|integer|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'user_id.required' => 'Peminjam wajib dipilih.',
            'user_id.exists' => 'Peminjam tidak ditemukan.',
            'tanggal_pinjam.required' => 'Tanggal pinjam wajib diisi.',
            'tanggal_pinjam.date' => 'Format tanggal pinjam tidak valid.',
            'tanggal_kembali_rencana.required' => 'Tanggal kembali rencana wajib diisi.',
            'tanggal_kembali_rencana.after_or_equal' => 'Tanggal kembali harus setelah atau sama dengan tanggal pinjam.',
            'status.required' => 'Status wajib dipilih.',
            'status.in' => 'Status tidak valid.',
            'details.required' => 'Detail peminjaman wajib diisi.',
            'details.min' => 'Minimal satu alat harus dipinjam.',
            'details.*.alat_id.required' => 'Alat wajib dipilih.',
            'details.*.alat_id.exists' => 'Alat tidak ditemukan.',
            'details.*.jumlah.required' => 'Jumlah wajib diisi.',
            'details.*.jumlah.min' => 'Jumlah minimal 1.',
        ];
    }
}