<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class PeminjamanExport implements FromCollection, WithHeadings, WithMapping, WithStyles
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
            'Petugas Approval',
            'Tanggal Pinjam',
            'Tanggal Kembali Rencana',
            'Tanggal Kembali Actual',
            'Status',
            'Keperluan',
            'Alat yang Dipinjam',
            'Total Jumlah',
            'Dibuat Pada'
        ];
    }

    public function map($peminjaman): array
    {
        $alatList = [];
        $totalJumlah = 0;
        
        foreach ($peminjaman->detailPeminjaman as $detail) {
            $alatList[] = $detail->alat->nama_alat . ' (' . $detail->jumlah . ')';
            $totalJumlah += $detail->jumlah;
        }
        
        return [
            $peminjaman->id,
            $peminjaman->user?->name ?? '-',
            $peminjaman->petugasApproval?->name ?? '-',
            $peminjaman->tanggal_pinjam,
            $peminjaman->tanggal_kembali_rencana,
            $peminjaman->tanggal_kembali_actual ?? '-',
            $peminjaman->status,
            $peminjaman->keperluan ?? '-',
            implode(', ', $alatList),
            $totalJumlah,
            $peminjaman->created_at,
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}