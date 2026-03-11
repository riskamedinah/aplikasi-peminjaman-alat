<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('alat', function (Blueprint $table) {
        $table->id();
        $table->foreignId('kategori_id')->constrained('kategori')->onDelete('restrict');
        $table->string('kode_alat', 50)->unique();
        $table->string('nama_alat', 100);
        $table->text('deskripsi')->nullable();
        $table->string('gambar')->nullable();
        $table->integer('stok_total')->default(0);
        $table->enum('kondisi', ['baik', 'rusak', 'perbaikan'])->default('baik');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alat');
    }
};
