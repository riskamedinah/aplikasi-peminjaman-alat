<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Peminjaman;
use Illuminate\Database\Eloquent\Factories\Factory;

class LogAktivitasFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'peminjaman_id' => fake()->optional(0.8)->passthrough(Peminjaman::factory()),
            'aksi' => fake()->randomElement(['insert', 'update', 'approve', 'reject', 'kembalikan']),
            'keterangan' => fake()->sentence(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}