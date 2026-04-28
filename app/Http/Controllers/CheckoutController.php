<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Midtrans\Config;
use Midtrans\Snap;

class CheckoutController extends Controller
{

    public function __construct()
    {
        Config::$serverKey      = config('midtrans.server_key');
        Config::$isProduction   = config('midtrans.is_production');
        Config::$isSanitized    = config('midtrans.is_sanitized');
        Config::$is3ds          = config('midtrans.is_3ds');
    }

    public function show(Product $product)
    {
        $product->load('game');

        return Inertia::render('Checkout/Show', [
            'product'       => $product,
            'client_key'    => config('midtrans.client_key')
        ]);
    }

    public function store(Request $request)
    {
        
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'game_user_id' => 'required|string',
            ]);

        $product = Product::findOrFail($request->product_id);
        $user    = auth()->user();

        $order = Order::create([
            'user_id'        => $user->id,
            'game_user_id'   => $request->game_user_id,
            'status'         => 'pending',
            'total_price'    => $product->price,
            'payment_method' => 'midtrans',
        ]);

        $order->items()->create([
            'product_id' => $product->id,
            'quantity'   => 1,
            'price'      => $product->price,
        ]);

        //Generate Snap Token
        $params = [
            'transaction_detail' => [
                'order_id'           => 'ORDER-' . $order->id,
                'gross_amount'       => (int) $product->price,
            ],
            'customer_details' => [
                'first_name' => $user->name,
                'email'      => $user->email,
            ],
            'item_detail' => [
                [
                    'id'        => $product->id,
                    'price'     => (int) $product->price,
                    'quantity'  => 1,
                    'name'      => $product->name,
                ],
            ],
        ];

        $snapToken = Snap::getSnapToken($params);

        return response()->json([
            'snap_token' => $snapToken,
            'order_id'   => $order->id,
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:pending,paid,processing,completed,failed',
        ]);

        $order->update(['status' => $request->status]);

        return response()->json(['success' => true]);
    }
}
