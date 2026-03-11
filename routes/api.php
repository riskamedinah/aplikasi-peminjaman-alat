<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\KategoriController;
use App\Http\Controllers\API\AlatController;
use App\Http\Controllers\API\PeminjamanController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\LogAktivitasController;

// Public route
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Kategori: hanya admin & petugas yang bisa full CRUD
    Route::apiResource('kategori', KategoriController::class)
        ->middleware('role:admin,petugas');

    // Alat: hanya admin & petugas yang bisa full CRUD
    Route::apiResource('alat', AlatController::class)
        ->middleware('role:admin,petugas');

    // Peminjaman: semua bisa lihat & buat, tapi hanya admin/petugas yang bisa ubah status
    Route::apiResource('peminjaman', PeminjamanController::class)
        ->except(['update', 'destroy']);

    Route::post('/peminjaman/{id}/approve', [PeminjamanController::class, 'approve'])
        ->middleware('role:admin,petugas');
    Route::post('/peminjaman/{id}/reject', [PeminjamanController::class, 'reject'])
        ->middleware('role:admin,petugas');
    Route::post('/peminjaman/{id}/kembalikan', [PeminjamanController::class, 'kembalikan'])
        ->middleware('role:admin,petugas,peminjam');

    // User: hanya admin yang bisa mengelola user
    Route::apiResource('user', UserController::class)
        ->middleware('role:admin');

    // Log aktivitas: hanya admin & petugas yang bisa melihat
    Route::apiResource('log-aktivitas', LogAktivitasController::class)
        ->middleware('role:admin,petugas');
});