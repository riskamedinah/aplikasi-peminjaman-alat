<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Kategori;
use App\Models\Alat;
use App\Models\Peminjaman;
use App\Models\DetailPeminjaman;
use App\Models\LogAktivitas;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::factory()->create([
            'name' => 'Admin Utama',
            'email' => 'admin@example.com',
            'password' => bcrypt('admin123'),
            'role' => 'admin',
        ]);

        $petugas = User::factory()->create([
            'name' => 'Petugas Satu',
            'email' => 'petugas@example.com',
            'password' => bcrypt('petugas123'),
            'role' => 'petugas',
        ]);

        $peminjam1 = User::factory()->create([
            'name' => 'Peminjam Satu',
            'email' => 'peminjam1@example.com',
            'password' => bcrypt('peminjam123'),
            'role' => 'peminjam',
        ]);

        $peminjam2 = User::factory()->create([
            'name' => 'Peminjam Dua',
            'email' => 'peminjam2@example.com',
            'password' => bcrypt('peminjam123'),
            'role' => 'peminjam',
        ]);

        $kategori1 = Kategori::factory()->create(['nama_kategori' => 'Elektronik']);
        $kategori2 = Kategori::factory()->create(['nama_kategori' => 'Perkakas']);
        $kategori3 = Kategori::factory()->create(['nama_kategori' => 'Alat Tulis']);

        $alat1 = Alat::factory()->create([
            'kategori_id' => $kategori1->id,
            'kode_alat' => 'ELC-001',
            'nama_alat' => 'Proyektor',
            'stok_total' => 10,
            'kondisi' => 'baik',
        ]);

        $alat2 = Alat::factory()->create([
            'kategori_id' => $kategori1->id,
            'kode_alat' => 'ELC-002',
            'nama_alat' => 'Laptop',
            'stok_total' => 5,
            'kondisi' => 'baik',
        ]);

        $alat3 = Alat::factory()->create([
            'kategori_id' => $kategori2->id,
            'kode_alat' => 'PRK-001',
            'nama_alat' => 'Bor Listrik',
            'stok_total' => 3,
            'kondisi' => 'baik',
        ]);

        $alat4 = Alat::factory()->create([
            'kategori_id' => $kategori3->id,
            'kode_alat' => 'ATK-001',
            'nama_alat' => 'Spidol Whiteboard',
            'stok_total' => 20,
            'kondisi' => 'baik',
        ]);

        $peminjaman1 = Peminjaman::factory()->create([
            'user_id' => $peminjam1->id,
            'petugas_approval_id' => $petugas->id,
            'tanggal_pinjam' => now()->subDays(5),
            'tanggal_kembali_rencana' => now()->addDays(2),
            'status' => 'disetujui',
            'keperluan' => 'Praktikum',
        ]);

        $peminjaman2 = Peminjaman::factory()->create([
            'user_id' => $peminjam2->id,
            'petugas_approval_id' => null,
            'tanggal_pinjam' => now()->subDay(),
            'tanggal_kembali_rencana' => now()->addDays(3),
            'status' => 'pending',
            'keperluan' => 'Presentasi',
        ]);

        DetailPeminjaman::factory()->create([
            'peminjaman_id' => $peminjaman1->id,
            'alat_id' => $alat1->id,
            'jumlah' => 1,
        ]);

        DetailPeminjaman::factory()->create([
            'peminjaman_id' => $peminjaman1->id,
            'alat_id' => $alat4->id,
            'jumlah' => 5,
        ]);

        DetailPeminjaman::factory()->create([
            'peminjaman_id' => $peminjaman2->id,
            'alat_id' => $alat2->id,
            'jumlah' => 2,
        ]);

        LogAktivitas::factory()->create([
            'user_id' => $peminjam1->id,
            'peminjaman_id' => $peminjaman1->id,
            'aksi' => 'insert',
            'keterangan' => 'Mengajukan peminjaman',
        ]);

        LogAktivitas::factory()->create([
            'user_id' => $petugas->id,
            'peminjaman_id' => $peminjaman1->id,
            'aksi' => 'approve',
            'keterangan' => 'Menyetujui peminjaman',
        ]);

        LogAktivitas::factory()->create([
            'user_id' => $peminjam2->id,
            'peminjaman_id' => $peminjaman2->id,
            'aksi' => 'insert',
            'keterangan' => 'Mengajukan peminjaman',
        ]);
    }
}