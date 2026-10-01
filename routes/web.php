<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GameController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\TrackOrderController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\LeaderboardController;
use App\Http\Controllers\Admin;
use App\Http\Controllers\MidtransController;

Route::get('/', [GameController::class, 'index'])->name('home');
Route::get('/games/{game:slug}', [GameController::class, 'show'])->name('game.show');
Route::get('/news', [NewsController::class, 'index'])->name('news.index');
Route::get('/leaderboard', [LeaderboardController::class, 'index'])->name('leaderboard.index');

// Riwayat transaksi bersifat global & publik (tanpa login) — menampilkan
// aktivitas transaksi dari SEMUA pengguna sebagai feed. Data sensitif
// (ID akun game, nomor invoice, dsb) tetap disamarkan untuk transaksi
// milik orang lain; hanya pemilik transaksi yang melihat datanya utuh.
Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');

Route::middleware('auth')->group(function () {
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::delete('/orders/{order}', [OrderController::class, 'destroy'])->name('orders.destroy');
});

// Tidak diletakkan di dalam middleware 'auth' karena checkout juga bisa
// dilakukan oleh guest, jadi order guest yang gagal/dibatalkan pun harus
// tetap bisa di-cancel dari sisi frontend (onError / onClose Snap).
Route::post('/orders/{order}/cancel', [OrderController::class, 'cancel'])->name('orders.cancel');

// Halaman invoice publik, langsung dituju setelah checkout (guest maupun
// login). Diamankan pakai cancel_token di query string sebagai kunci akses,
// bukan sekadar ID order yang gampang ditebak/di-loop.
Route::get('/invoice/{order}', [OrderController::class, 'invoice'])->name('orders.invoice');

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [Admin\DashboardController::class, 'index'])->name('dashboard');

    Route::get('/games', [Admin\GameController::class, 'index'])->name('games.index');
    Route::post('/games', [Admin\GameController::class, 'store'])->name('games.store');
    Route::put('/games/{game}', [Admin\GameController::class, 'update'])->name('games.update');
    Route::delete('/games/{game}', [Admin\GameController::class, 'destroy'])->name('games.destroy');

    Route::get('/products', [Admin\ProductController::class, 'index'])->name('products.index');
    Route::post('/products', [Admin\ProductController::class, 'store'])->name('products.store');
    Route::put('/products/{product}', [Admin\ProductController::class, 'update'])->name('products.update');
    Route::delete('/products/{product}', [Admin\ProductController::class, 'destroy'])->name('products.destroy');

    Route::get('/orders', [Admin\OrderController::class, 'index'])->name('orders.index');
    Route::put('/orders/{order}', [Admin\OrderController::class, 'update'])->name('orders.update');
    Route::delete('/orders/{order}', [Admin\OrderController::class, 'destroy'])->name('orders.destroy');

    Route::get('/news', [Admin\NewsController::class, 'index'])->name('news.index');
    Route::post('/news', [Admin\NewsController::class, 'store'])->name('news.store');
    Route::put('/news/{news}', [Admin\NewsController::class, 'update'])->name('news.update');
    Route::get('/news/{news}', [NewsController::class, 'show'])->name('news.show');
    Route::delete('/news/{news}', [Admin\NewsController::class, 'destroy'])->name('news.destroy');

    Route::get('/reports', [Admin\ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/export/excel', [Admin\ReportController::class, 'exportExcel'])->name('reports.export.excel');
    Route::get('/reports/export/pdf', [Admin\ReportController::class, 'exportPdf'])->name('reports.export.pdf');
});

Route::post('/midtrans/callback', [MidtransController::class, 'handleNotification'])
    ->name('midtrans.callback')
    ->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class]);

Route::get('/checkout/{product}', [CheckoutController::class, 'show'])->name('checkout.show');
Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');

// Cek transaksi publik (tanpa login), cukup pakai nomor invoice.
// Diberi throttle supaya nomor invoice tidak gampang di-brute-force / di-loop.
Route::middleware('throttle:20,1')->group(function () {
    Route::get('/cek-transaksi', [TrackOrderController::class, 'index'])->name('track.index');
    Route::post('/cek-transaksi', [TrackOrderController::class, 'search'])->name('track.search');
});

require __DIR__.'/settings.php';