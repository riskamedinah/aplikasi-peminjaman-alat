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
use App\Http\Controllers\API\PetugasAlatController;
use App\Http\Controllers\API\NotificationController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    // NOTIFIKASI (peminjam)
Route::middleware('role:peminjam')->group(function () {
    Route::get('/notifikasi', [NotificationController::class, 'index']);
    Route::post('/notifikasi/read-all', [NotificationController::class, 'markAllRead']);
    Route::post('/notifikasi/{notification}/read', [NotificationController::class, 'markOneRead']);
});

    // ==============================================
    // KATEGORI (Admin & Petugas bisa full CRUD)
    // ==============================================
    Route::apiResource('kategori', KategoriController::class)->middleware('role:admin,petugas');
    
    // ==============================================
    // ALAT (Hanya ADMIN yang bisa full CRUD)
    // ==============================================
    Route::apiResource('alat', AlatController::class)->middleware('role:admin');
    
    // ==============================================
    // PETUGAS AKSES ALAT (READ ONLY + Update Stok/Kondisi)
    // ==============================================
    Route::prefix('petugas')->middleware('role:admin,petugas')->group(function () {
        // Petugas bisa melihat daftar alat (GET)
        Route::get('/alat', [PetugasAlatController::class, 'index']);
        Route::get('/alat/{alat}', [PetugasAlatController::class, 'show']);
        
        // Petugas update stok & kondisi (TIDAK BISA create/delete/edit nama alat)
        Route::put('/alat/{alat}/stok', [PetugasAlatController::class, 'updateStok']);
        Route::post('/alat/{alat}/tambah-stok', [PetugasAlatController::class, 'tambahStok']);
        Route::post('/alat/{alat}/kurangi-stok', [PetugasAlatController::class, 'kurangiStok']);
        Route::put('/alat/{alat}/kondisi', [PetugasAlatController::class, 'updateKondisi']);
        
        // Laporan khusus petugas
        Route::get('/alat/kondisi/rusak', [PetugasAlatController::class, 'getRusak']);
        Route::get('/alat/stok/rendah', [PetugasAlatController::class, 'getStokRendah']);
    });

    // ==============================================
    // USER MANAGEMENT (hanya admin)
    // ==============================================
    // Izinkan petugas mengakses daftar user untuk keperluan memilih peminjam
    Route::get('/users', [UserController::class, 'index'])->middleware('role:admin,petugas');
    // Method lainnya (create, update, delete) tetap hanya untuk admin
    Route::apiResource('users', UserController::class)->except(['index'])->middleware('role:admin');

    // ==============================================
    // KATALOG (untuk semua user yang login)
    // ==============================================
    Route::get('/katalog', [KatalogController::class, 'index']);
    Route::get('/katalog/{alat}', [KatalogController::class, 'show']);

    // ==============================================
    // PEMINJAMAN (untuk user biasa)
    // ==============================================
    Route::post('/peminjaman', [PeminjamanController::class, 'store']);
    Route::get('/peminjaman-saya', [PeminjamanController::class, 'peminjamanSaya']);
    Route::get('/peminjaman-saya/{peminjaman}', [PeminjamanController::class, 'showPeminjamanSaya']);
    Route::put('/peminjaman/{peminjaman}/ajukan-kembali', [PeminjamanController::class, 'ajukanKembali']);

    // ==============================================
    // ADMIN PEMINJAMAN (CRUD + Export) - hanya admin
    // ==============================================
    Route::prefix('admin')->middleware('role:admin')->group(function () {
        Route::get('/peminjaman', [AdminPeminjamanController::class, 'index']);
        Route::get('/peminjaman/export', [AdminPeminjamanController::class, 'export']);
        Route::get('/peminjaman/{peminjaman}', [AdminPeminjamanController::class, 'show']);
        Route::post('/peminjaman', [AdminPeminjamanController::class, 'store']);
        Route::put('/peminjaman/{peminjaman}', [AdminPeminjamanController::class, 'update']);
        Route::delete('/peminjaman/{peminjaman}', [AdminPeminjamanController::class, 'destroy']);
    });

    // ==============================================
// PETUGAS PEMINJAMAN (FULL CRUD + Export) - admin & petugas
// ==============================================
Route::prefix('petugas')->middleware('role:admin,petugas')->group(function () {
    Route::get('/peminjaman', [PetugasPeminjamanController::class, 'index']);
    Route::get('/peminjaman/export', [PetugasPeminjamanController::class, 'export']);
    Route::get('/peminjaman/{peminjaman}', [PetugasPeminjamanController::class, 'show']);
    Route::post('/peminjaman', [PetugasPeminjamanController::class, 'store']);
    Route::put('/peminjaman/{peminjaman}', [PetugasPeminjamanController::class, 'update']);
    Route::delete('/peminjaman/{peminjaman}', [PetugasPeminjamanController::class, 'destroy']);
});

    // ==============================================
    // LOG ACTIVITY + Export
    // ==============================================
    Route::get('/logs', [ActivityLogController::class, 'index'])->middleware('role:admin,petugas');
    Route::get('/logs/export', [ActivityLogController::class, 'export'])->middleware('role:admin,petugas');

    // ==============================================
    // DASHBOARD
    // ==============================================
    Route::get('/dashboard/admin', [DashboardAdminController::class, 'index'])->middleware('role:admin');
    Route::get('/dashboard/petugas', [DashboardPetugasController::class, 'index'])->middleware('role:admin,petugas');

    // ==============================================
    // REPORT
    // ==============================================
    Route::get('/petugas/report/peminjaman', [ReportController::class, 'peminjaman'])->middleware('role:admin,petugas');
});