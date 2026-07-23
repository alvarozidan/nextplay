<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Midtrans\Config;
use Midtrans\Snap;

class CheckoutController extends Controller
{
    // Mapping grup metode → kode Midtrans
    const PAYMENT_METHODS = [
        'bank_transfer'     => ['bca_va', 'bni_va', 'bri_va', 'cimb_va', 'permata_va', 'other_va'],
        'ewallet'           => ['gopay', 'shopeepay', 'dana', 'ovo', 'linkaja'],
        'convenience_store' => ['indomaret', 'alfamart'],
        'qris'              => ['qris'],
        'credit_card'       => ['credit_card'],
    ];

    public function __construct()
    {
        Config::$serverKey    = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized  = config('midtrans.is_sanitized');
        Config::$is3ds        = config('midtrans.is_3ds');
    }

    public function show(Product $product)
    {
        $product->load('game');

        return Inertia::render('Checkout/Show', [
            'product'    => $product,
            'client_key' => config('midtrans.client_key'),
        ]);
    }

    public function store(Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'product_id'     => 'required|exists:products,id',
            'game_user_id'   => 'required|string',
            'payment_group'  => 'nullable|string|in:bank_transfer,ewallet,convenience_store,qris,credit_card',
            'guest_name'     => [Rule::requiredIf(!$user), 'string', 'max:100'],
            'guest_email'    => [Rule::requiredIf(!$user), 'email'],
        ]);

        $product = Product::findOrFail($request->product_id);

        $customerName  = $user?->name  ?? $request->guest_name;
        $customerEmail = $user?->email ?? $request->guest_email;

        $order = Order::create([
            'user_id'        => $user?->id,
            'game_user_id'   => $request->game_user_id,
            'status'         => 'pending',
            'total_price'    => $product->price,
            'payment_method' => $request->payment_group ?? 'midtrans',
            'guest_name'     => $user ? null : $request->guest_name,
            'guest_email'    => $user ? null : $request->guest_email,
        ]);

        $order->items()->create([
            'product_id' => $product->id,
            'quantity'   => 1,
            'price'      => $product->price,
        ]);

        $params = [
            'transaction_details' => [
                'order_id'     => 'ORDER-' . $order->id,
                'gross_amount' => (int) $product->price,
            ],
            'customer_details' => [
                'first_name' => $customerName,
                'email'      => $customerEmail,
            ],
            'item_detail' => [
                [
                    'id'       => $product->id,
                    'price'    => (int) $product->price,
                    'quantity' => 1,
                    'name'     => $product->name,
                ],
            ],
        ];

        if ($request->payment_group && isset(self::PAYMENT_METHODS[$request->payment_group])) {
            $params['enabled_payments'] = self::PAYMENT_METHODS[$request->payment_group];
        }

        $snapToken = Snap::getSnapToken($params);

        $order->update(['snap_token' => $snapToken]);

        return response()->json([
            'snap_token' => $snapToken,
            'order_id'   => $order->id,
        ]);
    }
}