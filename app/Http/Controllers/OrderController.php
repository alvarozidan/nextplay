<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Riwayat transaksi GLOBAL & publik — setiap transaksi dari siapapun
     * (login maupun guest) tampil di sini sebagai feed aktivitas.
     *
     * Untuk transaksi milik orang lain, data yang berpotensi sensitif
     * (ID akun game, nomor invoice) disamarkan. Kalau viewer login dan
     * kebetulan pemilik transaksi tersebut, datanya ditampilkan utuh dan
     * dia bisa masuk ke halaman detail / menghapusnya sendiri.
     *
     * Untuk melihat detail transaksi milik sendiri secara lengkap tanpa
     * login, arahkan user ke fitur "Cek Transaksi" (pakai nomor invoice).
     */
    public function index()
    {
        $viewerId = auth()->id();

        $orders = Order::with(['items.product.game'])
            ->latest()
            ->paginate(15)
            ->withQueryString()
            ->through(function (Order $order) use ($viewerId) {
                $isOwn = $viewerId !== null && $order->user_id === $viewerId;

                return [
                    'id'              => $order->id,
                    'invoice_number'  => $isOwn ? $order->invoice_number : null,
                    'status'          => $order->status,
                    'total_price'     => $order->total_price,
                    'payment_method'  => $order->payment_method,
                    'created_at'      => $order->created_at,
                    'game_user_id'    => $isOwn ? $order->game_user_id : $this->maskGameUserId($order->game_user_id),
                    'is_own'          => $isOwn,
                    'items'           => $order->items->map(fn ($item) => [
                        'product' => [
                            'name'           => $item->product?->name,
                            'diamond_amount' => $item->product?->diamond_amount,
                            'game'           => ['name' => $item->product?->game?->name],
                        ],
                    ]),
                ];
            });

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
        ]);
    }

    // Sisakan beberapa karakter depan biar tetap "kerasa" identitasnya,
    // sisanya ditutup titik-titik supaya tidak bisa dipakai orang lain.
    private function maskGameUserId(?string $gameUserId): ?string
    {
        if (!$gameUserId) {
            return $gameUserId;
        }

        $visible = min(4, max(1, (int) floor(strlen($gameUserId) / 2)));

        return substr($gameUserId, 0, $visible) . str_repeat('•', max(3, strlen($gameUserId) - $visible));
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
    public function cancel(Request $request, Order $order)
    {
        $request->validate(['cancel_token' => 'required|string']);

        // Cocokkan token, bukan cuma ID order (ID gampang ditebak/di-loop).
        // Tanpa ini siapa pun bisa cancel order pending milik orang lain.
        abort_unless(
            hash_equals((string) $order->cancel_token, (string) $request->cancel_token),
            403
        );

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