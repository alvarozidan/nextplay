<?php

namespace App\Console\Commands;

use App\Models\Order;
use Illuminate\Console\Command;

class ExpirePendingOrders extends Command
{
    /**
     * Order yang masih 'pending' lebih lama dari ini akan otomatis
     * ditandai 'failed'. Jaring pengaman untuk kasus di mana frontend
     * tidak sempat memanggil /orders/{order}/cancel (mis. user langsung
     * menutup tab/browser saat popup Snap masih terbuka).
     */
    protected int $expireAfterMinutes = 60;

    protected $signature = 'orders:expire-pending';

    protected $description = 'Tandai order pending yang sudah kedaluwarsa sebagai failed';

    public function handle(): int
    {
        $count = Order::where('status', 'pending')
            ->where('created_at', '<=', now()->subMinutes($this->expireAfterMinutes))
            ->update(['status' => 'failed']);

        $this->info("{$count} order pending kedaluwarsa ditandai sebagai failed.");

        return self::SUCCESS;
    }
}