<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Alat;
use App\Models\Peminjaman;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardPetugasController extends Controller
{
    public function index(Request $request)
    {
        try {
            // ==============================================
            // 1. STATISTIK CARD
            // ==============================================
            
            $pending = Peminjaman::where('status', 'menunggu')->count();

            // Sedang berlangsung (status dipinjam & belum dikembalikan)
            $sedangBerlangsung = Peminjaman::where('status', 'dipinjam')
                ->whereNull('tanggal_kembali_actual')
                ->count();

            // Terlambat (dipinjam, belum dikembalikan, melewati tanggal kembali)
            $terlambat = Peminjaman::where('status', 'dipinjam')
                ->whereNull('tanggal_kembali_actual')
                ->where('tanggal_kembali_rencana', '<=', Carbon::now()->format('Y-m-d'))
                ->count();

            $dikembalikanHariIni = Peminjaman::where('status', 'dikembalikan')
                ->whereDate('tanggal_kembali_actual', Carbon::today())
                ->count();

            $dikembalikanKemarin = Peminjaman::where('status', 'dikembalikan')
                ->whereDate('tanggal_kembali_actual', Carbon::yesterday())
                ->count();

            $growth = $pendingKemarin = Peminjaman::where('status', 'menunggu')
    ->whereDate('created_at', Carbon::yesterday())->count();
$pendingGrowth = $pending - $pendingKemarin;

// Growth untuk sedang berlangsung
$berlangsungKemarin = Peminjaman::where('status', 'dipinjam')
    ->whereNull('tanggal_kembali_actual')
    ->whereDate('updated_at', Carbon::yesterday())->count();
$berlangsungGrowth = $sedangBerlangsung - $berlangsungKemarin;

// Growth untuk terlambat
$terlambatKemarin = Peminjaman::where('status', 'dipinjam')
    ->whereNull('tanggal_kembali_actual')
    ->where('tanggal_kembali_rencana', '<=', Carbon::yesterday()->format('Y-m-d'))->count();
$terlambatGrowth = $terlambat - $terlambatKemarin;

            // ==============================================
            // 2. TREN 7 HARI TERAKHIR
            // ==============================================
            $trendData = Peminjaman::select(
                    'tanggal_pinjam as date',
                    DB::raw('count(*) as total')
                )
                ->where('tanggal_pinjam', '>=', Carbon::now()->subDays(6)->toDateString())
                ->groupBy('tanggal_pinjam')
                ->orderBy('date', 'ASC')
                ->get()
                ->keyBy('date');

            $trendPeminjaman = [];
            for ($i = 6; $i >= 0; $i--) {
                $date = Carbon::now()->subDays($i)->format('Y-m-d');
                $trendPeminjaman[] = [
                    'date'  => $date,
                    'total' => $trendData[$date]->total ?? 0,
                ];
            }

            // ==============================================
            // 3. PEMINJAMAN TERBARU (pending & disetujui)
            // ==============================================
            // Menampilkan semua status agar dashboard tidak terlihat kosong saat tidak ada yang aktif
            $peminjamanTerbaru = Peminjaman::with(['user', 'detailPeminjaman.alat'])
                ->latest('created_at')
                ->take(5)
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'user' => [
                            'name' => $item->user->name ?? 'Unknown',
                            'email' => $item->user->email ?? '-'
                        ],
                        'tanggal_pinjam' => $item->tanggal_pinjam,
                        'tanggal_kembali_rencana' => $item->tanggal_kembali_rencana,
                        'status' => $item->status,
                        'created_at' => $item->created_at,
                        'total_alat' => $item->detailPeminjaman->sum('jumlah'),
                        'is_late' => ($item->status === 'dipinjam' && 
                                      Carbon::parse($item->tanggal_kembali_rencana)->isPast())
                    ];
                });

            // ==============================================
            // 4. TOP ALAT YANG SEDANG DIPINJAM
            // (Menggunakan detail_peminjaman karena struktur relasi)
            // ==============================================
            $topAlatDipinjam = DB::table('detail_peminjaman')
    ->join('peminjaman', 'detail_peminjaman.peminjaman_id', '=', 'peminjaman.id')
    ->join('alat', 'detail_peminjaman.alat_id', '=', 'alat.id')
    ->whereIn('peminjaman.status', ['dipinjam', 'dikembalikan'])
                ->select(
                    'alat.id',
                    'alat.nama_alat',
                    DB::raw('SUM(detail_peminjaman.jumlah) as total_dipinjam')
                )
                ->groupBy('alat.id', 'alat.nama_alat')
                ->orderBy('total_dipinjam', 'desc')
                ->take(5)
                ->get();

            // ==============================================
            // 5. SEGERA DIKEMBALIKAN (3 hari ke depan)
            // ==============================================
            // Tambahkan eager loading 'detailPeminjaman' agar sum() tidak error/N+1
            $segeraDikembalikan = Peminjaman::with(['user', 'detailPeminjaman'])
                ->where('status', 'dipinjam')
                ->whereNull('tanggal_kembali_actual')
                ->where('tanggal_kembali_rencana', '<=', Carbon::now()->addDays(3)->format('Y-m-d'))
                ->orderBy('tanggal_kembali_rencana', 'asc')
                ->take(5)
                ->get()
                ->map(function ($item) {
                    $deadline = Carbon::parse($item->tanggal_kembali_rencana);
                    return [
                        'id' => $item->id,
                        'user_name' => $item->user->name ?? 'Unknown',
                        'tanggal_kembali_rencana' => $item->tanggal_kembali_rencana,
                        'hari_tersisa' => (int) Carbon::today()->diffInDays($deadline, false),
                        'total_alat' => $item->detailPeminjaman->sum('jumlah')
                    ];
                });

            return response()->json([
                'status' => 'success',
                'data'   => [
                    'stats' => [
    'pending'               => $pending,
    'pending_growth'        => $pendingGrowth,
    'sedang_berlangsung'    => $sedangBerlangsung,
    'berlangsung_growth'    => $berlangsungGrowth,
    'terlambat'             => $terlambat,
    'terlambat_growth'      => $terlambatGrowth,
    'dikembalikan_hari_ini' => $dikembalikanHariIni,
    'growth'                => $growth,
],
                    'trend'               => $trendPeminjaman,
                    'peminjaman_terbaru'  => $peminjamanTerbaru,
                    'top_alat_dipinjam'   => $topAlatDipinjam,
                    'segera_dikembalikan' => $segeraDikembalikan,
                ],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
                'file'    => $e->getFile(),
                'line'    => $e->getLine(),
            ], 500);
        }
    }
}