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
        //untuk memastikan hanya bisa melihat ordernya masing masing
        abort_if($order->user_id !== auth()->id(), 403);

        $order->load(['items.product.game']);

        return Inertia::render('Orders/Show', [
            'order' => $order,
        ]);
    }
}
