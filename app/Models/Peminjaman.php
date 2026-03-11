<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Peminjaman extends Model
{
    use HasFactory;

    protected $table = 'peminjaman';
    protected $fillable = ['user_id', 'petugas_approval_id', 'tanggal_pinjam', 'tanggal_kembali_rencana', 'tanggal_kembali_actual', 'status', 'keperluan'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function petugasApproval()
    {
        return $this->belongsTo(User::class, 'petugas_approval_id');
    }

    public function detailPeminjaman()
    {
        return $this->hasMany(DetailPeminjaman::class);
    }

    public function logAktivitas()
    {
        return $this->hasMany(LogAktivitas::class);
    }
}
