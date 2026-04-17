<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Peminjaman Alat</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 11px; padding: 20px; }
        .header { text-align: center; margin-bottom: 20px; padding-bottom: 10px; }
        .header h1 { margin: 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
        th { background: #3F51B5; color: white; font-size: 10px; }
        td { font-size: 9px; }
        .footer { margin-top: 20px; text-align: center; font-size: 8px; color: #999; }
        .status-pending { color: #F59E0B; }
        .status-dipinjam { color: #3F51B5; }
        .status-dikembalikan { color: #10B981; }
        .status-ditolak { color: #EF4444; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Laporan Peminjaman Alat</h1>
        <p>Periode Pinjam: {{ $tanggal_from ?? 'Semua' }} - {{ $tanggal_to ?? 'Semua' }}</p>
        <p>Diekspor oleh: {{ $user->name }} ({{ $user->role }}) | {{ now()->format('d/m/Y H:i:s') }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>ID</th>
                <th>Peminjam</th>
                <th>Tgl Pinjam</th>
                <th>Tgl Kembali</th>
                <th>Status</th>
                <th>Alat (Jumlah)</th>
                <th>Keperluan</th>
            </tr>
        </thead>
        <tbody>
            @foreach($peminjamans as $i => $p)
            <tr>
                <td>{{ $i+1 }}</td>
                <td>{{ $p->id }}</td>
                <td>{{ $p->user?->name ?? '-' }}</td>
                <td>{{ date('d/m/Y', strtotime($p->tanggal_pinjam)) }}</td>
                <td>{{ date('d/m/Y', strtotime($p->tanggal_kembali_rencana)) }}</td>
                <td class="status-{{ $p->status }}">{{ $p->status }}</td>
                <td>
                    @foreach($p->detailPeminjaman as $d)
                        {{ $d->alat->nama_alat }} ({{ $d->jumlah }})<br>
                    @endforeach
                </td>
                <td>
                    @php
                        $keperluan = $p->keperluan ?? '-';
                        echo strlen($keperluan) > 50 ? substr($keperluan, 0, 50) . '...' : $keperluan;
                    @endphp
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <p>Total: {{ $peminjamans->count() }} peminjaman | Digenerate oleh Sistem Peminjaman Alat</p>
    </div>
</body>
</html>