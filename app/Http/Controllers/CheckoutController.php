<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function show(Product $product)
    {
        $product->load('game');

        return Inertia::render('Checkout/Show', [
            'product' => $product,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'game-user_id' => 'required|string',
            'payment_method' => 'required|string',
        ]);

        $product = Product::findOrFail($request->product_id);

        $order = Order::create([
            'user_id'        => auth()->id(),
            'game_user_id'   =>$request->game_user_id,
            'status'         => 'pending',
            'total_price'    => $product->price,
            'payment_method' => $request->payment_method,
        ]);

        $order->items()->create([
            'product_id' => $product->id,
            'quantity'   => 1,
            'price'      => $product->price,
        ]);

        return redirect()->route('orders.show', $order)
                ->with('success', 'Order berhasil dibuat!');
    }
}
