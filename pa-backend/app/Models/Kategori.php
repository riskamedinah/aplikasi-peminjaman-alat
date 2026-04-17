<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Kategori extends Model
{
    use HasFactory;

    protected $table = 'kategori';
    protected $fillable = ['nama_kategori', 'deskripsi'];

    public function alats()
    {
        return $this->hasMany(Alat::class, 'kategori_id');
    }
}