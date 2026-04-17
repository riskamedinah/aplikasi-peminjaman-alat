<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Alat extends Model
{
    use HasFactory;

    protected $table = 'alat';
    
    protected $fillable = [
        'kategori_id',
        'kode_alat',
        'nama_alat',
        'deskripsi',
        'gambar',
        'stok_total',
        'kondisi'
    ];

    public function kategori()
    {
        return $this->belongsTo(Kategori::class, 'kategori_id');
    }

    public function detailPeminjaman()
    {
        return $this->hasMany(DetailPeminjaman::class);
    }

    public function peminjaman() {
    return $this->hasMany(Peminjaman::class);
}
}