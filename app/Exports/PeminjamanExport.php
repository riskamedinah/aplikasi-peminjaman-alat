<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class PeminjamanExport implements FromCollection, WithHeadings, WithMapping
{
    protected $peminjamans;

    public function __construct($peminjamans)
    {
        $this->peminjamans = $peminjamans;
    }

    public function collection()
    {
        return $this->peminjamans;
    }

    public function headings(): array
    {
        return [
            'ID',
            'Peminjam',
            'Email Peminjam',
            'Petugas Approval',
            'Tanggal Pinjam',
            'Tanggal Kembali Rencana',
            'Tanggal Kembali Aktual',
            'Status',
            'Keperluan',
            'Catatan Petugas',
            'Dibuat Pada',
        ];
    }

    public function map($peminjaman): array
    {
        $alatDetails = $peminjaman->detailPeminjaman->map(function ($detail) {
            return $detail->alat->nama_alat . ' (' . $detail->jumlah . ')';
        })->implode(', ');

        return [
            $peminjaman->id,
            $peminjaman->user->name ?? '-',
            $peminjaman->user->email ?? '-',
            $peminjaman->petugasApproval->name ?? '-',
            $peminjaman->tanggal_pinjam,
            $peminjaman->tanggal_kembali_rencana,
            $peminjaman->tanggal_kembali_actual ?? '-',
            $peminjaman->status,
            $peminjaman->keperluan ?? '-',
            $peminjaman->catatan_petugas ?? '-',
            $peminjaman->created_at,
        ];
    }
}