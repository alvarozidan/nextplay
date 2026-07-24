<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class LeaderboardController extends Controller
{
    // Periode yang boleh dipilih dari query string ?period=
    const PERIODS = ['weekly', 'monthly', 'all'];

    public function index(Request $request)
    {
        $period = in_array($request->query('period'), self::PERIODS, true)
            ? $request->query('period')
            : 'monthly';

        $query = Order::query()
            ->where('status', 'completed')
            ->whereNotNull('user_id');

        match ($period) {
            'weekly'  => $query->where('created_at', '>=', Carbon::now()->startOfWeek()),
            'monthly' => $query->where('created_at', '>=', Carbon::now()->startOfMonth()),
            default   => null, // all-time, tanpa filter tanggal
        };

        $topSpenders = $query
            ->selectRaw('user_id, SUM(total_price) as total_spent, COUNT(*) as total_transaksi')
            ->groupBy('user_id')
            ->orderByDesc('total_spent')
            ->with('user:id,name')
            ->take(20)
            ->get()
            ->values()
            ->map(function ($row, $index) {
                return [
                    'rank'            => $index + 1,
                    'name'            => $this->maskName($row->user?->name ?? 'Pengguna'),
                    'total_spent'     => (float) $row->total_spent,
                    'total_transaksi' => (int) $row->total_transaksi,
                ];
            });

        return Inertia::render('Leaderboard/Index', [
            'leaderboard' => $topSpenders,
            'period'      => $period,
        ]);
    }

    /**
     * Samarkan nama untuk privasi, cth: "Budi Santoso" -> "Budi S."
     */
    private function maskName(string $name): string
    {
        $parts = preg_split('/\s+/', trim($name));

        if (count($parts) <= 1) {
            $first = $parts[0] ?? 'Pengguna';

            return mb_strlen($first) > 2
                ? mb_substr($first, 0, 2) . str_repeat('*', max(mb_strlen($first) - 2, 1))
                : $first;
        }

        $first = array_shift($parts);
        $initials = collect($parts)->map(fn ($p) => mb_strtoupper(mb_substr($p, 0, 1)) . '.')->implode(' ');

        return trim($first . ' ' . $initials);
    }
}
