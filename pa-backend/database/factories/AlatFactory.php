<?php

namespace Database\Factories;

use App\Models\Kategori;
use Illuminate\Database\Eloquent\Factories\Factory;

class AlatFactory extends Factory
{
    public function definition(): array
    {
        return [
            'kategori_id' => Kategori::factory(),
            'kode_alat' => fake()->unique()->bothify('ALT-####'),
            'nama_alat' => fake()->words(3, true),
            'deskripsi' => fake()->paragraph(),
            'gambar' => fake()->imageUrl(),
            'stok_total' => fake()->numberBetween(1, 100),
            'kondisi' => fake()->randomElement(['baik', 'rusak', 'perbaikan']),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}