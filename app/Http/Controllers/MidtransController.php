<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MidtransController extends Controller
{
    public function handleNotification(Request $request)
    {
        $payload = $request->all();

        $serverKey    = config('midtrans.server_key');
        $orderId      = $payload['order_id']      ?? '';
        $statusCode   = $payload['status_code']   ?? '';
        $grossAmount  = $payload['gross_amount']  ?? '';

        $expectedSignature = hash('sha512', $orderId . $statusCode . $grossAmount . $serverKey);

        if (!hash_equals($expectedSignature, (string) ($payload['signature_key'] ?? ''))) {
            Log::warning('Midtrans: signature tidak valid', ['order_id' => $orderId]);
            return response()->json(['message' => 'Invalid signature'], 403);
        }

        $realOrderId = str_replace('ORDER-', '', $orderId);
        $order = Order::find($realOrderId);

        if (!$order) {
            Log::warning('Midtrans: order tidak ditemukan', ['order_id' => $orderId]);
            return response()->json(['message' => 'Order not found'], 404);
        }

        $transactionStatus = $payload['transaction_status'] ?? '';
        $fraudStatus       = $payload['fraud_status']       ?? '';

        $newStatus = match(true) {
            $transactionStatus === 'capture' && $fraudStatus === 'accept' => 'paid',
            $transactionStatus === 'settlement'                           => 'paid',
            $transactionStatus === 'pending'                              => 'pending',
            in_array($transactionStatus, ['deny', 'cancel', 'expire'])   => 'failed',
            default                                                       => null,
        };

        // Order yang sudah berada di status final ('paid', 'processing',
        // 'completed', 'failed') tidak boleh ditimpa balik ke 'pending'.
        // Tanpa guard ini, webhook 'pending' yang datang terlambat (mis.
        // notifikasi awal saat VA dibuat) bisa menimpa order yang sudah
        // di-cancel manual oleh user (lihat OrderController::cancel) atau
        // yang sudah lunas, sehingga statusnya "nyangkut" balik ke
        // "Menunggu" padahal seharusnya "Gagal"/"Sukses".
        $finalStatuses = ['paid', 'processing', 'completed', 'failed'];

        if ($newStatus === 'pending' && in_array($order->status, $finalStatuses, true)) {
            Log::info('Midtrans: notifikasi pending diabaikan, order sudah final', [
                'order_id'      => $realOrderId,
                'current_status'=> $order->status,
            ]);
            return response()->json(['message' => 'OK']);
        }

        if ($newStatus && $order->status !== $newStatus) {
            $order->update(['status' => $newStatus]);
            Log::info('Midtrans: status order diupdate', [
                'order_id' => $realOrderId,
                'status'   => $newStatus,
            ]);
        }

        return response()->json(['message' => 'OK']);
    }
}