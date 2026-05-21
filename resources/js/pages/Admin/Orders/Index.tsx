import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import PublicLayout from '@/layouts/public-layout';
import { update as orderUpdate } from '@/routes/admin/orders';

interface Order {
    id: number;
    status: string;
    total_price: number;
    game_user_id: string;
    payment_method: string;
    created_at: string;
    user: { name: string };
    items: { products: { name: string; game: { name: string } } }[];
}

const STATUS_OPTIONS = ['pending', 'paid', 'processing', 'completed', 'failed'] as const;

const STATUS_MAP: Record<string, { label: string; color: string; dot: string }> = {
    pending:    { label: 'Menunggu',  color: 'bg-amber-100 text-amber-700 ring-amber-200',      dot: 'bg-amber-400' },
    paid:       { label: 'Dibayar',   color: 'bg-blue-100 text-blue-700 ring-blue-200',         dot: 'bg-blue-400' },
    processing: { label: 'Diproses', color: 'bg-purple-100 text-purple-700 ring-purple-200',   dot: 'bg-purple-400' },
    completed:  { label: 'Selesai',  color: 'bg-emerald-100 text-emerald-700 ring-emerald-200', dot: 'bg-emerald-400' },
    failed:     { label: 'Gagal',    color: 'bg-red-100 text-red-700 ring-red-200',             dot: 'bg-red-400' },
};

function OrderRow({ order }: { order: Order }) {
    const { data, setData, put, processing } = useForm({ status: order.status });
    const [confirmDelete, setConfirmDelete] = useState(false);
    const { delete: deleteOrder, processing: deleting } = useForm({});

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(price));

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return `${d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} · ${d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
    };

    const status = STATUS_MAP[data.status] ?? { label: data.status, color: 'bg-slate-100 text-slate-600 ring-slate-200', dot: 'bg-slate-400' };
    const gameName = order.items[0]?.products?.game?.name;
    const productName = order.items[0]?.products?.name;

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setData('status', e.target.value);
        put(orderUpdate.url(order.id));
    };

    const handleDelete = () => {
        deleteOrder(`/admin/orders/${order.id}`, {
            onFinish: () => setConfirmDelete(false),
        });
    };

    return (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4">
                {/* Left info */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-lg flex-shrink-0 mt-0.5">
                        💎
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <span className="text-xs font-mono text-slate-400">#{order.id}</span>
                            <span className="text-slate-200 text-xs">·</span>
                            <span className="font-semibold text-sm text-slate-800">{order.user.name}</span>
                        </div>
                        <p className="text-sm text-slate-600 truncate">
                            {gameName ?? '—'}{productName ? ` — ${productName}` : ''}
                        </p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-xs text-slate-400">🎮 {order.game_user_id}</span>
                            {order.payment_method && (
                                <>
                                    <span className="text-slate-200 text-xs">·</span>
                                    <span className="text-xs text-slate-400 capitalize">💳 {order.payment_method}</span>
                                </>
                            )}
                            <span className="text-slate-200 text-xs">·</span>
                            <span className="text-xs text-slate-400">🕒 {formatDate(order.created_at)}</span>
                        </div>
                    </div>
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-3 flex-shrink-0 sm:flex-col sm:items-end">
                    <p className="font-extrabold text-slate-800 text-base">{formatPrice(order.total_price)}</p>
                    <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ring-1 ${status.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                            {status.label}
                        </span>
                        <select
                            value={data.status}
                            onChange={handleStatusChange}
                            disabled={processing}
                            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50 cursor-pointer"
                        >
                            {STATUS_OPTIONS.map(s => (
                                <option key={s} value={s}>{STATUS_MAP[s]?.label ?? s}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Delete bar */}
            <div className="border-t border-slate-100 px-4 py-2.5 flex items-center justify-end bg-slate-50/50">
                {!confirmDelete ? (
                    <button
                        onClick={() => setConfirmDelete(true)}
                        className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition-colors font-medium"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Hapus Order
                    </button>
                ) : (
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-red-500 font-medium">Hapus order #{order.id}?</span>
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="text-xs bg-red-500 text-white px-2.5 py-1 rounded-lg hover:bg-red-600 transition disabled:opacity-50 font-medium"
                        >
                            {deleting ? 'Menghapus...' : 'Ya, Hapus'}
                        </button>
                        <button
                            onClick={() => setConfirmDelete(false)}
                            className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1 rounded-lg transition font-medium"
                        >
                            Batal
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function AdminOrdersIndex({ orders }: { orders: Order[] }) {
    const totalRevenue = orders
        .filter(o => o.status === 'completed' || o.status === 'paid')
        .reduce((sum, o) => sum + Number(o.total_price), 0);

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

    const countByStatus = (status: string) => orders.filter(o => o.status === status).length;

    return (
        <PublicLayout>
            <Head title="Kelola Order" />

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Kelola Order</h1>
                    <p className="text-sm text-slate-500 mt-0.5">{orders.length} total transaksi</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { label: 'Menunggu',  count: countByStatus('pending'),    color: 'text-amber-600',   bg: 'bg-amber-50 border-amber-100'    },
                        { label: 'Diproses',  count: countByStatus('processing'), color: 'text-purple-600',  bg: 'bg-purple-50 border-purple-100'  },
                        { label: 'Selesai',   count: countByStatus('completed'),  color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
                        { label: 'Gagal',     count: countByStatus('failed'),     color: 'text-red-600',     bg: 'bg-red-50 border-red-100'         },
                    ].map(stat => (
                        <div key={stat.label} className={`rounded-2xl border p-4 ${stat.bg}`}>
                            <p className={`text-2xl font-extrabold ${stat.color}`}>{stat.count}</p>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Revenue */}
                <div className="rounded-2xl p-5 text-white" style={{ background: 'linear-gradient(135deg, #1a9fd4, #0a9e7e)' }}>
                    <p className="text-sm font-medium opacity-80 mb-1">Total Pendapatan (Selesai + Dibayar)</p>
                    <p className="text-3xl font-extrabold">{formatPrice(totalRevenue)}</p>
                </div>

                {/* Orders list */}
                {orders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
                        <div className="text-4xl mb-3">📋</div>
                        <p className="text-slate-500 font-medium">Belum ada order masuk.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {orders.map(order => <OrderRow key={order.id} order={order} />)}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
