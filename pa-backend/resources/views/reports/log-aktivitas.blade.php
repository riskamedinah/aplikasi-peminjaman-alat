<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Log Aktivitas</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 11px; padding: 20px; }
        .header { text-align: center; margin-bottom: 20px; padding-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
        th { background: #3F51B5; color: white; font-size: 10px; }
        td { font-size: 9px; }
        .footer { margin-top: 20px; text-align: center; font-size: 8px; color: #999; }
        .badge-create { background: #10B981; color: white; padding: 2px 5px; border-radius: 3px; }
        .badge-approve { background: #3F51B5; color: white; padding: 2px 5px; border-radius: 3px; }
        .badge-reject { background: #E11D48; color: white; padding: 2px 5px; border-radius: 3px; }
        .badge-return { background: #16A34A; color: white; padding: 2px 5px; border-radius: 3px; }
        .badge-update { background: #F59E0B; color: white; padding: 2px 5px; border-radius: 3px; }
        .badge-delete { background: #EF4444; color: white; padding: 2px 5px; border-radius: 3px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Laporan Log Aktivitas</h1>
        <p>Periode: {{ $tanggal_from ?? 'Semua' }} - {{ $tanggal_to ?? 'Semua' }}</p>
        <p>Diekspor oleh: {{ $user->name }} ({{ $user->role }}) | {{ now()->format('d/m/Y H:i:s') }}</p>
    </div>

    <table>
        <thead>
            <tr><th>No</th><th>Waktu</th><th>Pengguna</th><th>Role</th><th>Aksi</th><th>Keterangan</th><th>ID Peminjaman</th></tr>
        </thead>
        <tbody>
            @foreach($logs as $i => $log)
            <tr>
                <td>{{ $i+1 }}</td>
                <td>{{ date('d/m/Y H:i', strtotime($log->created_at)) }}</td>
                <td>{{ $log->user?->name ?? '-' }}</td>
                <td>{{ $log->user?->role ?? '-' }}</td>
                <td><span class="badge-{{ $log->aksi }}">{{ $log->aksi }}</span></td>
                <td>{{ $log->keterangan }}</td>
                <td>{{ $log->peminjaman_id ?? '-' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <p>Total: {{ $logs->count() }} aktivitas | Digenerate oleh Sistem Peminjaman Alat</p>
    </div>
</body>
</html>