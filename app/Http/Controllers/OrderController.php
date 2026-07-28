<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::where('user_id', auth()->id())
            ->with(['items.product.game'])
            ->latest()
            ->get();

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
        ]);
    }

    public function show(Order $order)
    {
        abort_if($order->user_id !== auth()->id(), 403);

        $order->load(['items.product.game']);

        return Inertia::render('Orders/Show', [
            'order' => $order,
        ]);
    }

    /**
     * Dipanggil dari frontend (onError / onClose Snap) saat pembayaran
     * gagal atau dibatalkan oleh user, supaya order tidak "menumpuk"
     * selamanya dengan status pending di riwayat transaksi.
     *
     * Sengaja tidak diletakkan di belakang middleware 'auth' karena
     * checkout juga bisa dilakukan oleh guest (lihat CheckoutController).
     * Hanya order yang statusnya masih 'pending' yang bisa diubah, jadi
     * order yang sudah 'paid'/'processing'/'completed' tidak akan pernah
     * ter-overwrite lewat endpoint ini.
     */
    public function cancel(Order $order)
    {
        if ($order->status === 'pending') {
            $order->update(['status' => 'failed']);
        }

        return response()->json(['ok' => true, 'status' => $order->status]);
    }

    public function destroy(Order $order)
    {
        abort_if($order->user_id !== auth()->id(), 403);

        $order->items()->delete();
        $order->delete();

        return redirect()->route('orders.index')->with('success', 'Transaksi berhasil dihapus');
    }
}