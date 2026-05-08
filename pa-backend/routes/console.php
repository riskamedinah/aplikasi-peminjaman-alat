<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Models\Notification;
use App\Models\Peminjaman;
use Carbon\Carbon;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::call(function () {
    $targets = Peminjaman::where('status', 'dipinjam')
        ->whereNull('tanggal_kembali_actual')
        ->whereIn('tanggal_kembali_rencana', [
            Carbon::tomorrow()->toDateString(),
            Carbon::now()->addDays(3)->toDateString(),
        ])
        ->get();

    foreach ($targets as $p) {
        $hariTersisa = Carbon::today()->diffInDays($p->tanggal_kembali_rencana, false);

        $sudahAda = Notification::where('peminjaman_id', $p->id)
            ->where('tipe', 'deadline')
            ->whereDate('created_at', today())
            ->exists();

        if ($sudahAda) continue;

        Notification::create([
            'user_id'       => $p->user_id,
            'peminjaman_id' => $p->id,
            'judul'         => 'Pengingat Pengembalian',
            'pesan'         => 'Peminjaman #' . $p->id . ' harus dikembalikan dalam ' . $hariTersisa . ' hari lagi (' . $p->tanggal_kembali_rencana . ').',
            'tipe'          => 'deadline',
        ]);
    }
})->dailyAt('07:00')->name('notifikasi-deadline');