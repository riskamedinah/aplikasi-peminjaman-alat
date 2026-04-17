<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\LogAktivitas;
use App\Http\Resources\LogAktivitasResource;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\LogAktivitasExport;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $query = LogAktivitas::with(['user', 'peminjaman']);
        
        // FILTER BERDASARKAN ROLE USER YANG LOGIN
        $user = $request->user();
        
        if ($user->role === 'admin') {
            // ADMIN: Bisa lihat SEMUA log (admin, petugas, user)
            // Tidak perlu filter tambahan
            $query->whereRaw('1=1');
        } 
        elseif ($user->role === 'petugas') {
            // PETUGAS: Hanya bisa lihat log petugas dan user
            // TIDAK BISA lihat log admin
            $query->whereHas('user', function ($q) {
                $q->where('role', 'petugas')
                  ->orWhere('role', 'user');
                // TIDAK termasuk role 'admin'
            });
        }
        elseif ($user->role === 'user') {
            // USER: Hanya bisa lihat log peminjaman sendiri
            $query->where('user_id', $user->id);
        }

        // SEARCH
        if ($request->filled('search')) {
            $searchTerm = '%' . $request->search . '%';
            $query->where(function ($q) use ($searchTerm) {
                $q->where('aksi', 'like', $searchTerm)
                  ->orWhere('keterangan', 'like', $searchTerm)
                  ->orWhereHas('user', function ($q2) use ($searchTerm) {
                      $q2->where('name', 'like', $searchTerm)
                         ->orWhere('email', 'like', $searchTerm);
                  });
            });
        }

        // FILTER ROLE (khusus untuk admin)
        if ($request->has('filter.role') && $user->role === 'admin') {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('role', $request->input('filter.role'));
            });
        }

        // FILTER AKSI
        if ($request->has('filter.aksi')) {
            $query->where('aksi', $request->input('filter.aksi'));
        }

        // FILTER TANGGAL
        if ($request->has('filter.tanggal')) {
            $query->whereDate('created_at', $request->input('filter.tanggal'));
        }

        if ($request->has('filter.tanggal_from') && $request->has('filter.tanggal_to')) {
            $query->whereBetween('created_at', [
                $request->input('filter.tanggal_from'),
                $request->input('filter.tanggal_to')
            ]);
        }

        // SORTING
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        
        $allowedSorts = ['created_at'];
        
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder === 'asc' ? 'asc' : 'desc');
        } else {
            $query->latest();
        }

        $limit = $request->input('limit', 10);
        $logs = $query->paginate($limit)->withQueryString();
        
        return LogAktivitasResource::collection($logs);
    }

      /**
     * EXPORT LOG AKTIVITAS
     */
    public function export(Request $request)
    {
        $query = LogAktivitas::with(['user', 'peminjaman']);
        
        // FILTER BERDASARKAN ROLE USER YANG LOGIN (sama seperti di index)
        $user = $request->user();
        
        if ($user->role === 'admin') {
            $query->whereRaw('1=1');
        } 
        elseif ($user->role === 'petugas') {
            $query->whereHas('user', function ($q) {
                $q->where('role', 'petugas')->orWhere('role', 'user');
            });
        }
        elseif ($user->role === 'user') {
            $query->where('user_id', $user->id);
        }

        // SEARCH
        if ($request->filled('search')) {
            $searchTerm = '%' . $request->search . '%';
            $query->where(function ($q) use ($searchTerm) {
                $q->where('aksi', 'like', $searchTerm)
                  ->orWhere('keterangan', 'like', $searchTerm)
                  ->orWhereHas('user', function ($q2) use ($searchTerm) {
                      $q2->where('name', 'like', $searchTerm)
                         ->orWhere('email', 'like', $searchTerm);
                  });
            });
        }

        // FILTER ROLE (khusus admin)
        if ($request->has('filter.role') && $user->role === 'admin') {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('role', $request->input('filter.role'));
            });
        }

        // FILTER AKSI
        if ($request->has('filter.aksi')) {
            $query->where('aksi', $request->input('filter.aksi'));
        }

        // FILTER TANGGAL
        if ($request->has('filter.tanggal_from') && $request->has('filter.tanggal_to')) {
            $query->whereBetween('created_at', [
                $request->input('filter.tanggal_from'),
                $request->input('filter.tanggal_to')
            ]);
        }

        $logs = $query->orderBy('created_at', 'desc')->get();
        
        $format = $request->input('format', 'excel');
        
        if ($format === 'pdf') {
            $pdf = Pdf::loadView('reports.log-aktivitas', [
                'logs' => $logs,
                'user' => $user,
                'tanggal_from' => $request->input('filter.tanggal_from'),
                'tanggal_to' => $request->input('filter.tanggal_to'),
                'exported_at' => now()
            ]);
            
            return $pdf->download('log_aktivitas_' . now()->format('Ymd_His') . '.pdf');
        }
        
        // Default: Excel
        return Excel::download(new LogAktivitasExport($logs), 'log_aktivitas_' . now()->format('Ymd_His') . '.xlsx');
    }
}