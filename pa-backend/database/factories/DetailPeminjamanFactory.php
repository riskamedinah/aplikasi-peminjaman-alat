<?php

namespace Database\Factories;

use App\Models\Peminjaman;
use App\Models\Alat;
use Illuminate\Database\Eloquent\Factories\Factory;

class DetailPeminjamanFactory extends Factory
{
    public function definition(): array
    {
        return [
            'peminjaman_id' => Peminjaman::factory(),
            'alat_id' => Alat::factory(),
            'jumlah' => fake()->numberBetween(1, 5),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}