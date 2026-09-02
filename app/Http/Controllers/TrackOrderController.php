<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TrackOrderController extends Controller
{
    // Halaman form "Cek Transaksi" (tanpa perlu login).
    public function index()
    {
        return Inertia::render('Track/Index');
    }

    // Dicari cuma pakai nomor invoice, tidak perlu login/email.
    public function search(Request $request)
    {
        $request->validate([
            'invoice_number' => 'required|string',
        ]);

        $orderId = Order::parseInvoiceNumber(trim($request->invoice_number));

        // Format invoice tidak valid (bukan NP-xxxxxx) → jangan sampai ke query.
        if ($orderId === null) {
            return back()->withErrors([
                'invoice_number' => 'Format nomor invoice tidak valid. Contoh: NP-000123',
            ])->withInput();
        }

        $order = Order::with(['items.product.game'])->find($orderId);

        if (!$order) {
            return back()->withErrors([
                'invoice_number' => 'Transaksi dengan nomor invoice tersebut tidak ditemukan.',
            ])->withInput();
        }

        $product = $order->firstProduct();

        // Data yang ditampilkan sengaja dibatasi (tidak termasuk nama/email
        // pembeli) karena nomor invoice ini bisa dicek siapa saja tanpa login.
        return Inertia::render('Track/Index', [
            'result' => [
                'invoice_number'  => $order->invoice_number,
                'status'          => $order->status,
                'game_user_id'    => $order->game_user_id,
                'payment_method'  => $order->payment_method,
                'total_price'     => $order->total_price,
                'created_at'      => $order->created_at,
                'product_name'    => $product?->name,
                'diamond_amount'  => $product?->diamond_amount,
                'game_name'       => $product?->game?->name,
            ],
        ]);
    }
}