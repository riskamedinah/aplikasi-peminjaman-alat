<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Peminjaman;
use Illuminate\Http\Request;

class DashboardPetugasController extends Controller
{
    public function index(Request $request)
    {
        $pending = Peminjaman::where('status', 'pending')->count();
        
        $dipinjam = Peminjaman::where('status', 'disetujui')->count();
        
        $terlambat = Peminjaman::where('status', 'disetujui')
            ->where('tanggal_kembali_rencana', '<', now()->format('Y-m-d'))
            ->count();

        return response()->json([
            'pending' => $pending,
            'dipinjam' => $dipinjam,
            'terlambat' => $terlambat,
        ]);
    }
}