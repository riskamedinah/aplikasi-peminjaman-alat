<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Alat;
use App\Models\Kategori;
use App\Models\User;
use App\Models\Peminjaman;
use Illuminate\Http\Request;

class DashboardAdminController extends Controller
{
    public function index(Request $request)
    {
        $totalAlat = Alat::count();
        $totalKategori = Kategori::count();
        $totalUser = User::count();
        $totalPeminjaman = Peminjaman::count();

        return response()->json([
            'total_alat' => $totalAlat,
            'total_kategori' => $totalKategori,
            'total_user' => $totalUser,
            'total_peminjaman' => $totalPeminjaman,
        ]);
    }
}