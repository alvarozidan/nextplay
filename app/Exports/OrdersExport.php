<?php

namespace App\Exports;

use App\Models\Order;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class OrdersExport implements FromCollection, WithHeadings, WithMapping, WithStyles
{
    public function __construct(
        protected ?string $startDate = null,
        protected ?string $endDate = null,
        protected ?string $status = null,
    ) {}

    public function collection(): Collection
    {
        $query = Order::with(['user', 'items.product.game'])->latest();

        if ($this->startDate) {
            $query->whereDate('created_at', '>=', $this->startDate);
        }

        if ($this->endDate) {
            $query->whereDate('created_at', '<=', $this->endDate);
        }

        if ($this->status) {
            $query->where('status', $this->status);
        }

        return $query->get();
    }

    public function headings(): array
    {
        return [
            'ID Order',
            'Tanggal',
            'Nama Pelanggan',
            'Email',
            'Game',
            'Produk',
            'ID Akun Game',
            'Metode Pembayaran',
            'Status',
            'Total (Rp)',
        ];
    }

    public function map($order): array
    {
        $firstItem = $order->items->first();

        return [
            $order->id,
            $order->created_at->format('d/m/Y H:i'),
            $order->user->name ?? $order->guest_name ?? '-',
            $order->user->email ?? $order->guest_email ?? '-',
            $firstItem?->product?->game?->name ?? '-',
            $firstItem?->product?->name ?? '-',
            $order->game_user_id,
            $order->payment_method ?? '-',
            ucfirst($order->status),
            number_format((float) $order->total_price, 0, ',', '.'),
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
