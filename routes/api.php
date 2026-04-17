<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\KategoriController;
use App\Http\Controllers\API\AlatController;
use App\Http\Controllers\API\PeminjamanController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\ActivityLogController;
use App\Http\Controllers\API\KatalogController;
use App\Http\Controllers\API\AdminPeminjamanController;
use App\Http\Controllers\API\PetugasPeminjamanController;
use App\Http\Controllers\API\DashboardAdminController;
use App\Http\Controllers\API\DashboardPetugasController;
use App\Http\Controllers\API\ReportController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::apiResource('kategori', KategoriController::class)->middleware('role:admin,petugas');
    Route::apiResource('alat', AlatController::class)->middleware('role:admin,petugas');
    Route::apiResource('users', UserController::class)->middleware('role:admin');

    Route::get('/katalog', [KatalogController::class, 'index']);
    Route::get('/katalog/{alat}', [KatalogController::class, 'show']);

    Route::post('/peminjaman', [PeminjamanController::class, 'store']);
    Route::get('/peminjaman-saya', [PeminjamanController::class, 'peminjamanSaya']);
    Route::get('/peminjaman-saya/{peminjaman}', [PeminjamanController::class, 'showPeminjamanSaya']);
    Route::put('/peminjaman/{peminjaman}/ajukan-kembali', [PeminjamanController::class, 'ajukanKembali']);

    // ADMIN PEMINJAMAN (CRUD + Export)
    Route::get('/admin/peminjaman', [AdminPeminjamanController::class, 'index'])->middleware('role:admin');
    Route::get('/admin/peminjaman/export', [AdminPeminjamanController::class, 'export'])->middleware('role:admin');
    Route::get('/admin/peminjaman/{peminjaman}', [AdminPeminjamanController::class, 'show'])->middleware('role:admin');
    Route::post('/admin/peminjaman', [AdminPeminjamanController::class, 'store'])->middleware('role:admin');
    Route::put('/admin/peminjaman/{peminjaman}', [AdminPeminjamanController::class, 'update'])->middleware('role:admin');
    Route::delete('/admin/peminjaman/{peminjaman}', [AdminPeminjamanController::class, 'destroy'])->middleware('role:admin');

    // PETUGAS PEMINJAMAN (CRUD + Export)
    Route::get('/petugas/peminjaman', [PetugasPeminjamanController::class, 'index'])->middleware('role:admin,petugas');
    Route::get('/petugas/peminjaman/export', [PetugasPeminjamanController::class, 'export'])->middleware('role:admin,petugas');
    Route::get('/petugas/peminjaman/{peminjaman}', [PetugasPeminjamanController::class, 'show'])->middleware('role:admin,petugas');
    Route::post('/petugas/peminjaman', [PetugasPeminjamanController::class, 'store'])->middleware('role:admin,petugas');
    Route::put('/petugas/peminjaman/{peminjaman}/approve', [PetugasPeminjamanController::class, 'approve'])->middleware('role:admin,petugas');
    Route::put('/petugas/peminjaman/{peminjaman}/reject', [PetugasPeminjamanController::class, 'reject'])->middleware('role:admin,petugas');
    Route::put('/petugas/peminjaman/{peminjaman}/kembalikan', [PetugasPeminjamanController::class, 'kembalikan'])->middleware('role:admin,petugas');

    // LOG ACTIVITY + Export
    Route::get('/logs', [ActivityLogController::class, 'index'])->middleware('role:admin,petugas');
    Route::get('/logs/export', [ActivityLogController::class, 'export'])->middleware('role:admin,petugas'); // TAMBAHKAN

    // DASHBOARD
    Route::get('/dashboard/admin', [DashboardAdminController::class, 'index'])->middleware('role:admin');
    Route::get('/dashboard/petugas', [DashboardPetugasController::class, 'index'])->middleware('role:admin,petugas');

    // REPORT (sudah ada)
    Route::get('/petugas/report/peminjaman', [ReportController::class, 'peminjaman'])->middleware('role:admin,petugas');
});