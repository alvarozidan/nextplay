<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MidtransController extends Controller
{
    public function handleNotification(Request $request)
    {
        $payload = $request->all();

        // 1. Verifikasi signature key
        $serverKey    = config('midtrans.server_key');
        $orderId      = $payload['order_id']      ?? '';
        $statusCode   = $payload['status_code']   ?? '';
        $grossAmount  = $payload['gross_amount']  ?? '';

        $expectedSignature = hash('sha512', $orderId . $statusCode . $grossAmount . $serverKey);

        if ($expectedSignature !== ($payload['signature_key'] ?? '')) {
            Log::warning('Midtrans: signature tidak valid', ['order_id' => $orderId]);
            return response()->json(['message' => 'Invalid signature'], 403);
        }

        // 2. Ambil order beserta product-nya
        $realOrderId = str_replace('ORDER-', '', $orderId);
        $order = Order::with('product')->find($realOrderId);

        if (!$order) {
            Log::warning('Midtrans: order tidak ditemukan', ['order_id' => $orderId]);
            return response()->json(['message' => 'Order not found'], 404);
        }

        // 3. Map transaction_status ke status order
        $transactionStatus = $payload['transaction_status'] ?? '';
        $fraudStatus       = $payload['fraud_status']       ?? '';

        $newStatus = match(true) {
            $transactionStatus === 'capture' && $fraudStatus === 'accept' => 'paid',
            $transactionStatus === 'settlement'                           => 'paid',
            $transactionStatus === 'pending'                              => 'pending',
            in_array($transactionStatus, ['deny', 'cancel', 'expire'])   => 'failed',
            default                                                       => null,
        };

        // 4. Update status order
        if ($newStatus && $order->status !== $newStatus) {
            $order->update(['status' => $newStatus]);
            Log::info('Midtrans: status order diupdate', [
                'order_id' => $realOrderId,
                'status'   => $newStatus,
            ]);

            // 5. Kalau paid, kirim GC ke GOT IT
            if ($newStatus === 'paid') {
                $this->sendToGameServer(
                    uid:    $order->game_user_id,
                    amount: $order->product->diamond_amount,
                );
            }
        }

        return response()->json(['message' => 'OK']);
    }

    private function sendToGameServer(string $uid, int $amount): void
    {
        try {
            $response = Http::post('http://localhost:3000/api/topup', [
                'uid'    => $uid,
                'amount' => $amount,
                'source' => 'nextplay',
            ]);

            if ($response->successful()) {
                Log::info('GOT IT: GC berhasil dikirim', [
                    'uid'    => $uid,
                    'amount' => $amount,
                ]);
            } else {
                Log::warning('GOT IT: response tidak sukses', [
                    'uid'    => $uid,
                    'status' => $response->status(),
                    'body'   => $response->body(),
                ]);
            }
        } catch (\Exception $e) {
            // Jangan sampai error GOT IT menggagalkan response ke Midtrans
            Log::error('GOT IT: gagal kirim request', [
                'uid'   => $uid,
                'error' => $e->getMessage(),
            ]);
        }
    }
}