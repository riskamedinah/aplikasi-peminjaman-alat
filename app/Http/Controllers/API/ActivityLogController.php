<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\LogAktivitas;
use App\Http\Resources\LogAktivitasResource;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $query = LogAktivitas::with(['user', 'peminjaman']);

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

        if ($request->has('filter.role')) {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('role', $request->input('filter.role'));
            });
        }

        if ($request->has('filter.tanggal')) {
            $query->whereDate('created_at', $request->input('filter.tanggal'));
        }

        if ($request->has('filter.tanggal_from') && $request->has('filter.tanggal_to')) {
            $query->whereBetween('created_at', [
                $request->input('filter.tanggal_from'),
                $request->input('filter.tanggal_to')
            ]);
        }

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
}