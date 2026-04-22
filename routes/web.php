<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\GameController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\Admin;

// Route::inertia('/', 'welcome', [
//     'canRegister' => Features::enabled(Features::registration()),
// ])->name('home');

// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::inertia('dashboard', 'dashboard')->name('dashboard');
// });

Route::get('/', [GameController::class, 'index'])->name('home');
Route::get('/games/{game:slug}', [GameController::class, 'show'])->name('game.show');

Route::middleware('auth')->group(function () {
    Route::get('/checkout/{product}', [CheckoutController::class, 'show'])->name('checkout.show');
    Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');

    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
});

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function(){
    Route::get('/', [Admin\DashboardController::class, 'index'])->name('dashboard');

    Route::get('/games', [Admin\GameController::class, 'index'])->name('games.index');
    Route::post('/games', [Admin\GameController::class, 'store'])->name('games.store');
    Route::put('/games{game}', [Admin\GameController::class, 'update'])->name('games.update');
    Route::delete('/games/{game}', [Admin\GameController::class, 'destroy'])->name('games.destroy');

    Route::get('/products', [Admin\ProductController::class, 'index'])->name('products.index');
    Route::post('/products', [Admin\ProductController::class, 'store'])->name('products.store');
    Route::put('/products{product}', [Admin\ProductController::class, 'update'])->name('products.update');
    Route::delete('/products/{product}', [Admin\ProductController::class, 'destroy'])->name('products.destroy');
    
    Route::get('/orders', [Admin\OrderController::class, 'index'])->name('orders.index');
    Route::put('/orders{order}', [Admin\OrderController::class, 'update'])->name('orders.update');
});

require __DIR__.'/settings.php';
