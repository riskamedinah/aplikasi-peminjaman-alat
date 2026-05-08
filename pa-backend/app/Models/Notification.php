<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'user_id', 'peminjaman_id', 'judul', 'pesan', 'tipe', 'is_read'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function peminjaman() {
        return $this->belongsTo(Peminjaman::class);
    }
}