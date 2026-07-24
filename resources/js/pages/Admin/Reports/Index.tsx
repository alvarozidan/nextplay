import { Head, router } from '@inertiajs/react';
import { useState, FormEvent } from 'react';
import { FileSpreadsheet, FileText, TrendingUp, ListOrdered } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';

interface Filters {
    start_date: string | null;
    end_date: string | null;
    status: string | null;
}

interface Summary {
    total_orders: number;
    total_revenue: number;
}

interface Props {
    filters: Filters;
    summary: Summary;
}

const STATUS_OPTIONS = [
    { value: '', label: 'Semua Status' },
    { value: 'pending', label: 'Menunggu' },
    { value: 'paid', label: 'Dibayar' },
    { value: 'processing', label: 'Diproses' },
    { value: 'completed', label: 'Selesai' },
    { value: 'failed', label: 'Gagal' },
];

export default function AdminReportsIndex({ filters, summary }: Props) {
    const [startDate, setStartDate] = useState(filters.start_date ?? '');
    const [endDate, setEndDate] = useState(filters.end_date ?? '');
    const [status, setStatus] = useState(filters.status ?? '');

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

    const buildQuery = () => {
        const params = new URLSearchParams();
        if (startDate) params.set('start_date', startDate);
        if (endDate) params.set('end_date', endDate);
        if (status) params.set('status', status);
        return params.toString();
    };

    const applyFilter = (e: FormEvent) => {
        e.preventDefault();
        router.get('/admin/reports', {
            start_date: startDate || undefined,
            end_date: endDate || undefined,
            status: status || undefined,
        }, { preserveState: true });
    };

    // Export = download file langsung dari server, bukan navigasi Inertia
    const downloadUrl = (type: 'excel' | 'pdf') => `/admin/reports/export/${type}?${buildQuery()}`;

    return (
        <PublicLayout>
            <Head title="Laporan Order" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Laporan Order</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Filter, lalu unduh laporan dalam format Excel atau PDF.</p>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-slate-100 bg-white p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                            <ListOrdered className="w-5 h-5 text-slate-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-extrabold text-slate-800">{summary.total_orders}</p>
                            <p className="text-xs text-slate-500">Total Order (sesuai filter)</p>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-slate-100 bg-white p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-extrabold text-slate-800">{formatPrice(summary.total_revenue)}</p>
                            <p className="text-xs text-slate-500">Pendapatan (status selesai)</p>
                        </div>
                    </div>
                </div>

                {/* Filter form */}
                <form onSubmit={applyFilter} className="bg-white border border-slate-100 rounded-2xl p-5 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Dari Tanggal</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Sampai Tanggal</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                            >
                                {STATUS_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                        <button
                            type="submit"
                            className="text-sm font-medium px-4 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors"
                        >
                            Terapkan Filter
                        </button>

                        <a
                            href={downloadUrl('excel')}
                            className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                        >
                            <FileSpreadsheet className="w-4 h-4" />
                            Unduh Excel
                        </a>

                        <a
                            href={downloadUrl('pdf')}
                            className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                        >
                            <FileText className="w-4 h-4" />
                            Unduh PDF
                        </a>
                    </div>
                </form>
            </div>
        </PublicLayout>
    );
}
