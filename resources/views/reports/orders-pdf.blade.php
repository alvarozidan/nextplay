<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Order - NextPlay</title>
    <style>
        body { font-family: sans-serif; font-size: 11px; color: #1e293b; }
        h1 { font-size: 18px; margin-bottom: 2px; }
        .subtitle { color: #64748b; margin-bottom: 16px; font-size: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #e2e8f0; padding: 6px 8px; text-align: left; }
        th { background-color: #0a9e7e; color: #fff; font-size: 10px; text-transform: uppercase; }
        tr:nth-child(even) { background-color: #f8fafc; }
        .summary { margin-top: 6px; display: flex; gap: 24px; }
        .summary-box { display: inline-block; margin-right: 24px; }
        .summary-label { color: #64748b; font-size: 10px; }
        .summary-value { font-size: 14px; font-weight: bold; }
        .status { text-transform: capitalize; }
        .text-right { text-align: right; }
    </style>
</head>
<body>
    <h1>Laporan Order - NextPlay</h1>
    <p class="subtitle">
        Dibuat pada {{ $generatedAt->format('d/m/Y H:i') }}
        @if($filters['start_date'] || $filters['end_date'])
            &middot; Periode:
            {{ $filters['start_date'] ? \Illuminate\Support\Carbon::parse($filters['start_date'])->format('d/m/Y') : 'Awal' }}
            s/d
            {{ $filters['end_date'] ? \Illuminate\Support\Carbon::parse($filters['end_date'])->format('d/m/Y') : 'Sekarang' }}
        @endif
        @if($filters['status'])
            &middot; Status: {{ ucfirst($filters['status']) }}
        @endif
    </p>

    <div class="summary">
        <div class="summary-box">
            <div class="summary-label">Total Order</div>
            <div class="summary-value">{{ $orders->count() }}</div>
        </div>
        <div class="summary-box">
            <div class="summary-label">Total Pendapatan (Selesai)</div>
            <div class="summary-value">Rp {{ number_format($totalRevenue, 0, ',', '.') }}</div>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Tanggal</th>
                <th>Pelanggan</th>
                <th>Game</th>
                <th>Produk</th>
                <th>ID Akun Game</th>
                <th>Metode</th>
                <th>Status</th>
                <th class="text-right">Total</th>
            </tr>
        </thead>
        <tbody>
            @forelse($orders as $order)
                @php $firstItem = $order->items->first(); @endphp
                <tr>
                    <td>#{{ $order->id }}</td>
                    <td>{{ $order->created_at->format('d/m/Y H:i') }}</td>
                    <td>{{ $order->user->name ?? $order->guest_name ?? '-' }}</td>
                    <td>{{ $firstItem?->product?->game?->name ?? '-' }}</td>
                    <td>{{ $firstItem?->product?->name ?? '-' }}</td>
                    <td>{{ $order->game_user_id }}</td>
                    <td>{{ $order->payment_method ?? '-' }}</td>
                    <td class="status">{{ $order->status }}</td>
                    <td class="text-right">Rp {{ number_format($order->total_price, 0, ',', '.') }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="9" style="text-align:center;">Tidak ada data order pada periode ini.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>
