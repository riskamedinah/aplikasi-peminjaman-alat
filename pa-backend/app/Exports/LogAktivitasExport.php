<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class LogAktivitasExport implements FromCollection, WithHeadings, WithMapping, WithStyles
{
    protected $logs;

    public function __construct($logs)
    {
        $this->logs = $logs;
    }

    public function collection()
    {
        return $this->logs;
    }

    public function headings(): array
    {
        return [
            'ID',
            'Pengguna',
            'Role',
            'Aksi',
            'Keterangan',
            'Peminjaman ID',
            'Waktu'
        ];
    }

    public function map($log): array
    {
        return [
            $log->id,
            $log->user?->name ?? '-',
            $log->user?->role ?? '-',
            $log->aksi,
            $log->keterangan,
            $log->peminjaman_id ?? '-',
            $log->created_at,
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}