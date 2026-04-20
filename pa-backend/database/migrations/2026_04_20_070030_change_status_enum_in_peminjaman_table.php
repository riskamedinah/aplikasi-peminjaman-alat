<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Ubah enum status di tabel peminjaman
        DB::statement("ALTER TABLE peminjaman MODIFY COLUMN status ENUM('menunggu', 'disetujui', 'ditolak', 'dipinjam', 'dikembalikan') DEFAULT 'menunggu'");    
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE peminjaman MODIFY COLUMN status ENUM('pending', 'disetujui', 'dipinjam', 'dikembalikan', 'ditolak') DEFAULT 'pending'");
    }
};
