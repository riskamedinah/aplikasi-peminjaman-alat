<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PeminjamanFactory extends Factory
{
    public function definition(): array
    {
        $tanggalPinjam = fake()->dateTimeBetween('-1 month', 'now');
        $tanggalKembaliRencana = (clone $tanggalPinjam)->modify('+'.fake()->numberBetween(1,7).' days');
        $status = fake()->randomElement(['pending', 'disetujui', 'ditolak', 'dipinjam', 'dikembalikan']);
        
        $tanggalKembaliActual = null;
        if ($status == 'dikembalikan') {
            $tanggalKembaliActual = fake()->dateTimeBetween($tanggalPinjam, $tanggalKembaliRencana);
        }

        return [
            'user_id' => User::factory()->state(['role' => 'peminjam']),
            'petugas_approval_id' => fake()->optional(0.7)->passthrough(User::factory()->state(['role' => 'petugas'])),
            'tanggal_pinjam' => $tanggalPinjam,
            'tanggal_kembali_rencana' => $tanggalKembaliRencana,
            'tanggal_kembali_actual' => $tanggalKembaliActual,
            'status' => $status,
            'keperluan' => fake()->sentence(),
            'created_at' => $tanggalPinjam,
            'updated_at' => now(),
        ];
    }
}