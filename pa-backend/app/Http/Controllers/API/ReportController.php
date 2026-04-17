<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Peminjaman;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\PeminjamanExport;

class ReportController extends Controller
{
    public function peminjaman(Request $request)
    {
        $query = Peminjaman::with(['user', 'petugasApproval', 'detailPeminjaman.alat']);

        if ($request->filled('tanggal_awal')) {
            $query->whereDate('created_at', '>=', $request->tanggal_awal);
        }

        if ($request->filled('tanggal_akhir')) {
            $query->whereDate('created_at', '<=', $request->tanggal_akhir);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $peminjamans = $query->orderBy('created_at', 'desc')->get();

        $format = $request->input('format', 'json');

        if ($format === 'pdf') {
            $pdf = Pdf::loadView('reports.peminjaman', [
                'peminjamans' => $peminjamans,
                'tanggal_awal' => $request->tanggal_awal,
                'tanggal_akhir' => $request->tanggal_akhir,
            ]);
            
            return $pdf->download('laporan_peminjaman_' . now()->format('Ymd_His') . '.pdf');
        }

        if ($format === 'excel') {
            return Excel::download(new PeminjamanExport($peminjamans), 'laporan_peminjaman_' . now()->format('Ymd_His') . '.xlsx');
        }

        return response()->json([
            'data' => $peminjamans,
            'total' => $peminjamans->count(),
            'filter' => [
                'tanggal_awal' => $request->tanggal_awal,
                'tanggal_akhir' => $request->tanggal_akhir,
                'status' => $request->status,
            ]
        ]);
    }
}