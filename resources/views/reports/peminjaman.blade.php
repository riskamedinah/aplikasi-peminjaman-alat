<!DOCTYPE html>
<html>
<head>
    <title>Laporan Peminjaman Alat</title>
    <style>
        body { font-family: sans-serif; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .header { text-align: center; margin-bottom: 20px; }
        .filter-info { margin-bottom: 20px; font-size: 14px; }
    </style>
</head>
<body>
    <div class="header">
        <h2>Laporan Peminjaman Alat</h2>
        <p>Dicetak pada: {{ now()->format('d/m/Y H:i:s') }}</p>
    </div>

    <div class="filter-info">
        <strong>Filter:</strong><br>
        @if($tanggal_awal && $tanggal_akhir)
            Periode: {{ $tanggal_awal }} s/d {{ $tanggal_akhir }}<br>
        @endif
        @if($tanggal_awal && !$tanggal_akhir)
            Dari: {{ $tanggal_awal }}<br>
        @endif
        @if(!$tanggal_awal && $tanggal_akhir)
            Sampai: {{ $tanggal_akhir }}<br>
        @endif
        Total Data: {{ $peminjamans->count() }}
    </div>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Peminjam</th>
                <th>Alat & Jumlah</th>
                <th>Tanggal Pinjam</th>
                <th>Tanggal Kembali Rencana</th>
                <th>Tanggal Kembali Aktual</th>
                <th>Status</th>
                <th>Keperluan</th>
            </tr>
        </thead>
        <tbody>
            @foreach($peminjamans as $index => $p)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $p->user->name ?? '-' }}</td>
                <td>
                    @foreach($p->detailPeminjaman as $detail)
                        {{ $detail->alat->nama_alat }} ({{ $detail->jumlah }})<br>
                    @endforeach
                </td>
                <td>{{ $p->tanggal_pinjam }}</td>
                <td>{{ $p->tanggal_kembali_rencana }}</td>
                <td>{{ $p->tanggal_kembali_actual ?? '-' }}</td>
                <td>{{ $p->status }}</td>
                <td>{{ $p->keperluan ?? '-' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>