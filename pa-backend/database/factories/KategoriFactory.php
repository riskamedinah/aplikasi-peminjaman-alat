<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class KategoriFactory extends Factory
{
    public function definition(): array
    {
        return [
            'nama_kategori' => fake()->unique()->word(),
            'deskripsi' => fake()->sentence(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}