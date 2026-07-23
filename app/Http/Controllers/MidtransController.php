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

        if ($expectedSignature !== ($payload['signature_key'] ?? '')) {
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