<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\Order;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(){
        return Inertia::render('Admin/Dashboard',[
            'stats' => [
                'total_games' => Game::count(),
                'total_orders' => Order::count(),
                'total_revenue' => Order::where('status', 'completed')->sum('total_price'),
                'total_users' => User::where('role', 'user')->count(),
            ],
            'recent_orders' => Order::with(['user', 'item.product.game'])
            ->latest()
            ->take(5)
            ->get(), 
        ]);
    }
}
