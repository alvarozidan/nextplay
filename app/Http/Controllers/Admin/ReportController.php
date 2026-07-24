<?php

namespace App\Http\Controllers\Admin;

use App\Exports\OrdersExport;
use App\Http\Controllers\Controller;
use App\Models\Order;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $filters = $this->filters($request);

        $query = $this->filteredQuery($filters);

        return Inertia::render('Admin/Reports/Index', [
            'filters' => $filters,
            'summary' => [
                'total_orders'  => (clone $query)->count(),
                'total_revenue' => (clone $query)->where('status', 'completed')->sum('total_price'),
            ],
        ]);
    }

    public function exportExcel(Request $request)
    {
        $filters = $this->filters($request);

        $fileName = 'laporan-order-' . now()->format('Y-m-d_His') . '.xlsx';

        return Excel::download(
            new OrdersExport($filters['start_date'], $filters['end_date'], $filters['status']),
            $fileName
        );
    }

    public function exportPdf(Request $request)
    {
        $filters = $this->filters($request);

        $orders = $this->filteredQuery($filters)
            ->with(['user', 'items.product.game'])
            ->get();

        $totalRevenue = $orders->where('status', 'completed')->sum('total_price');

        $pdf = Pdf::loadView('reports.orders-pdf', [
            'orders'       => $orders,
            'filters'      => $filters,
            'totalRevenue' => $totalRevenue,
            'generatedAt'  => now(),
        ])->setPaper('a4', 'landscape');

        $fileName = 'laporan-order-' . now()->format('Y-m-d_His') . '.pdf';

        return $pdf->download($fileName);
    }

    private function filters(Request $request): array
    {
        $request->validate([
            'start_date' => 'nullable|date',
            'end_date'   => 'nullable|date',
            'status'     => 'nullable|in:pending,paid,processing,completed,failed',
        ]);

        return [
            'start_date' => $request->query('start_date'),
            'end_date'   => $request->query('end_date'),
            'status'     => $request->query('status'),
        ];
    }

    private function filteredQuery(array $filters)
    {
        $query = Order::query();

        if ($filters['start_date']) {
            $query->whereDate('created_at', '>=', $filters['start_date']);
        }

        if ($filters['end_date']) {
            $query->whereDate('created_at', '<=', $filters['end_date']);
        }

        if ($filters['status']) {
            $query->where('status', $filters['status']);
        }

        return $query;
    }
}
