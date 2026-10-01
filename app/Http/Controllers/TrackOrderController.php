<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TrackOrderController extends Controller
{
    // Halaman form "Cek Transaksi" (tanpa perlu login). Kalau datang dari
    // link di halaman invoice (?invoice_number=NP-xxxxxx), hasilnya langsung
    // dicarikan supaya user tidak perlu ketik ulang nomor invoicenya.
    public function index(Request $request)
    {
        $invoiceNumber = $request->query('invoice_number');

        if (!$invoiceNumber) {
            return Inertia::render('Track/Index');
        }

        return Inertia::render('Track/Index', [
            'result'         => $this->findResult((string) $invoiceNumber),
            'invoice_number' => $invoiceNumber,
        ]);
    }

    // Dicari cuma pakai nomor invoice, tidak perlu login/email.
    public function search(Request $request)
    {
        $request->validate([
            'invoice_number' => 'required|string',
        ]);

        $result = $this->findResult($request->invoice_number);

        if ($result === null) {
            $isValidFormat = Order::parseInvoiceNumber(trim($request->invoice_number)) !== null;

            return back()->withErrors([
                'invoice_number' => $isValidFormat
                    ? 'Transaksi dengan nomor invoice tersebut tidak ditemukan.'
                    : 'Format nomor invoice tidak valid. Contoh: NP-000123',
            ])->withInput();
        }

        return Inertia::render('Track/Index', ['result' => $result]);
    }

    // Data yang ditampilkan sengaja dibatasi (tidak termasuk nama/email
    // pembeli) karena nomor invoice ini bisa dicek siapa saja tanpa login.
    private function findResult(string $invoiceNumber): ?array
    {
        $orderId = Order::parseInvoiceNumber(trim($invoiceNumber));

        if ($orderId === null) {
            return null;
        }

        $order = Order::with(['items.product.game'])->find($orderId);

        if (!$order) {
            return null;
        }

        $product = $order->firstProduct();

        return [
            'invoice_number'  => $order->invoice_number,
            'status'          => $order->status,
            'game_user_id'    => $order->game_user_id,
            'payment_method'  => $order->payment_method,
            'total_price'     => $order->total_price,
            'created_at'      => $order->created_at,
            'product_name'    => $product?->name,
            'diamond_amount'  => $product?->diamond_amount,
            'game_name'       => $product?->game?->name,
        ];
    }
}