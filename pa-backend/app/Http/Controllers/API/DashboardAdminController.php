<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Alat;
use App\Models\Kategori;
use App\Models\User;
use App\Models\Peminjaman;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardAdminController extends Controller
{
    public function index(Request $request)
    {
        try {
            // 1. Hitung Stats Dasar
            $totalAlat = Alat::count();
            $totalKategori = Kategori::count();
            $totalUser = User::count();
            $totalPeminjaman = Peminjaman::count();

            // 2. Hitung Growth (Bulan Ini vs Bulan Lalu)
            $bulanIni = Peminjaman::whereMonth('tanggal_pinjam', Carbon::now()->month)
                                  ->whereYear('tanggal_pinjam', Carbon::now()->year)
                                  ->count();
            $bulanLalu = Peminjaman::whereMonth('tanggal_pinjam', Carbon::now()->subMonth()->month)
                                   ->whereYear('tanggal_pinjam', Carbon::now()->subMonth()->year)
                                   ->count();
            $growthPeminjaman = $bulanIni - $bulanLalu;

            // 3. Trend Peminjaman 7 Hari Terakhir (Semua 7 hari, fill 0 jika tidak ada)
            $trendData = Peminjaman::select(
                    'tanggal_pinjam as date',
                    DB::raw('count(*) as total')
                )
                ->where('tanggal_pinjam', '>=', Carbon::now()->subDays(6)->toDateString())
                ->groupBy('tanggal_pinjam')
                ->orderBy('date', 'ASC')
                ->get()
                ->keyBy('date');

            // Generate 7 hari penuh, assign 0 jika tidak ada data
            $trendPeminjaman = [];
            for ($i = 6; $i >= 0; $i--) {
                $date = Carbon::now()->subDays($i)->format('Y-m-d');
                $trendPeminjaman[] = [
                    'date' => $date,
                    'total' => $trendData[$date]->total ?? 0
                ];
            }
            $trendPeminjaman = collect($trendPeminjaman);

            // 4. Top Alat (Berapa kali alat dipinjam)
            $topAlat = Alat::withCount('detailPeminjaman as peminjaman_count')
                ->orderBy('peminjaman_count', 'desc')
                ->take(5)
                ->get();

            // 5. AMBIL PEMINJAMAN TERBARU (PENTING: Agar tabel di Dashboard terisi)
            $peminjamanTerbaru = Peminjaman::with(['user']) // Load relasi user untuk ambil nama
                ->latest()
                ->take(5)
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => [
                    'stats' => [
                        'total_alat' => $totalAlat,
                        'total_kategori' => $totalKategori,
                        'total_user' => $totalUser,
                        'total_peminjaman' => $totalPeminjaman,
                        'peminjaman_growth' => $growthPeminjaman,
                    ],
                    'trend' => $trendPeminjaman,
                    'top_alat' => $topAlat,
                    'peminjaman_terbaru' => $peminjamanTerbaru // Kirim data ini ke frontend
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500);
        }
    }
}