<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['user', 'items.product.game'])
            ->latest()
            ->get();

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
        ]);
    }

    public function update(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:pending, paid, processing, completed, failed',
        ]);

        $order->update(['status' => $request->status]);

        return back()->with('success', 'Status Order berhasil diubah');
    }

}
