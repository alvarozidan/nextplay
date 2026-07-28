<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Jalan tiap 15 menit, menandai order 'pending' yang sudah lebih dari
// 60 menit (lihat App\Console\Commands\ExpirePendingOrders) sebagai
// 'failed', supaya tidak menumpuk selamanya di riwayat transaksi.
// Catatan: pastikan cron server sudah menjalankan `php artisan schedule:run`
// tiap menit (lihat dokumentasi Laravel Task Scheduling).
Schedule::command('orders:expire-pending')->everyFifteenMinutes();