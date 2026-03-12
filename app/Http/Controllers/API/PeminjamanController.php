<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Peminjaman;
use App\Models\Alat;
use App\Http\Resources\PeminjamanResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PeminjamanController extends Controller
{
    /**
     * GET /api/peminjaman
     */
    public function index(Request $request)
    {
        $query = Peminjaman::with(['user', 'alat']);

        if ($request->user()->role === 'peminjam') {
            $query->where('user_id', $request->user()->id);
        }

        if ($request->filled('search')) {
            $searchTerm = '%' . $request->search . '%';
            $query->where(function ($q) use ($searchTerm) {
                $q->whereHas('user', function ($userQuery) use ($searchTerm) {
                    $userQuery->where('name', 'like', $searchTerm);
                })->orWhereHas('alat', function ($alatQuery) use ($searchTerm) {
                    $alatQuery->where('nama_alat', 'like', $searchTerm);
                });
            });
        }

        if ($request->has('filter.status')) {
            $query->where('status', $request->input('filter.status'));
        }

        if ($request->has('filter.tanggal_pinjam')) {
            $query->whereDate('tanggal_pinjam', $request->input('filter.tanggal_pinjam'));
        }

        if ($request->has('sort')) {
            $sortField = $request->input('sort');
            $sortOrder = $request->input('order', 'asc');
            
            $allowedSorts = ['tanggal_pinjam', 'tanggal_kembali_rencana'];
            
            if (in_array($sortField, $allowedSorts)) {
                $query->orderBy($sortField, $sortOrder);
            }
        } else {
            $query->latest();
        }

        $peminjamans = $query->paginate(10)->withQueryString();

        return PeminjamanResource::collection($peminjamans);
    }

    /**
     * POST /api/peminjaman
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'alat_id' => 'required|exists:alats,id',
            'jumlah' => 'required|integer|min:1',
            'tanggal_pinjam' => 'required|date|after_or_equal:today',
            'tanggal_kembali_rencana' => 'required|date|after:tanggal_pinjam',
            'keterangan' => 'nullable|string',
        ]);

        $alat = Alat::findOrFail($validated['alat_id']);

        if ($alat->status !== 'tersedia') {
            throw ValidationException::withMessages([
                'alat_id' => 'Alat tidak tersedia untuk dipinjam saat ini.',
            ]);
        }

        if ($alat->stok < $validated['jumlah']) {
            throw ValidationException::withMessages([
                'jumlah' => "Stok alat tidak mencukupi. Stok tersedia: {$alat->stok}.",
            ]);
        }

        $peminjaman = Peminjaman::create([
            'user_id' => $request->user()->id,
            'alat_id' => $validated['alat_id'],
            'jumlah' => $validated['jumlah'],
            'tanggal_pinjam' => $validated['tanggal_pinjam'],
            'tanggal_kembali_rencana' => $validated['tanggal_kembali_rencana'],
            'keterangan' => $validated['keterangan'],
            'status' => 'pending',
        ]);

        return (new PeminjamanResource($peminjaman))
            ->additional(['message' => 'Permintaan peminjaman berhasil dibuat.'])
            ->response()
            ->setStatusCode(201);
    }

    /**
     * GET /api/peminjaman/{id}
     */
    public function show(Request $request, Peminjaman $peminjaman)
    {
        $user = $request->user();
        if ($user->role === 'peminjam' && $user->id !== $peminjaman->user_id) {
            return response()->json(['message' => 'Anda tidak diizinkan melihat data ini.'], 403);
        }

        return new PeminjamanResource($peminjaman->load(['user', 'alat', 'petugas']));
    }

    /**
     * POST /peminjaman/{id}/approve
     */
    public function approve(Request $request, Peminjaman $peminjaman)
    {
        if ($peminjaman->status !== 'pending') {
            return response()->json(['message' => 'Hanya peminjaman dengan status pending yang bisa disetujui.'], 422);
        }

        $alat = $peminjaman->alat;

        if ($alat->stok < $peminjaman->jumlah) {
            $peminjaman->update([
                'status' => 'ditolak',
                'petugas_id' => $request->user()->id,
                'catatan_petugas' => 'Stok tidak mencukupi saat akan disetujui.',
            ]);
            return response()->json(['message' => 'Peminjaman ditolak karena stok tidak mencukupi.'], 409);
        }

        DB::transaction(function () use ($peminjaman, $alat, $request) {
            $alat->decrement('stok', $peminjaman->jumlah);
            $peminjaman->update([
                'status' => 'disetujui',
                'petugas_id' => $request->user()->id,
            ]);
        });

        return (new PeminjamanResource($peminjaman))
            ->additional(['message' => 'Peminjaman berhasil disetujui.']);
    }

    /**
     * POST /peminjaman/{id}/reject
     */
    public function reject(Request $request, Peminjaman $peminjaman)
    {
        $request->validate(['catatan_petugas' => 'nullable|string|max:255']);

        if ($peminjaman->status !== 'pending') {
            return response()->json(['message' => 'Hanya peminjaman dengan status pending yang bisa ditolak.'], 422);
        }

        $peminjaman->update([
            'status' => 'ditolak',
            'petugas_id' => $request->user()->id,
            'catatan_petugas' => $request->input('catatan_petugas'),
        ]);

        return (new PeminjamanResource($peminjaman))
            ->additional(['message' => 'Peminjaman berhasil ditolak.']);
    }

    /**
     * POST /peminjaman/{id}/kembalikan
     */
    public function kembalikan(Request $request, Peminjaman $peminjaman)
    {
        if ($peminjaman->status !== 'disetujui') {
            return response()->json(['message' => 'Hanya peminjaman yang disetujui yang bisa dikembalikan.'], 422);
        }

        DB::transaction(function () use ($peminjaman) {
            $peminjaman->alat->increment('stok', $peminjaman->jumlah);
            $peminjaman->update([
                'status' => 'dikembalikan',
                'tanggal_kembali_aktual' => now(),
            ]);
        });

        return (new PeminjamanResource($peminjaman))
            ->additional(['message' => 'Alat berhasil dikembalikan.']);
    }
}
