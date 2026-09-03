import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import PublicLayout from '@/layouts/public-layout';
import { show as orderShow } from '@/routes/orders';
import {
    Clock, CreditCard, Loader2, CheckCircle2, XCircle, Circle,
    ClipboardList, ChevronRight, Trash2, Receipt,
    type LucideIcon,
} from 'lucide-react';

interface Order {
    id: number;
    invoice_number: string | null;
    status: string;
    total_price: number;
    payment_method: string | null;
    created_at: string;
    game_user_id: string | null;
    is_own: boolean;
    items: { product: { name: string; game: { name: string } } }[];
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedOrders {
    data: Order[];
    links: PaginationLink[];
    total: number;
}

const STATUS_MAP: Record<string, { label: string; color: string; icon: LucideIcon; spin?: boolean }> = {
    pending:    { label: 'Menunggu',  color: 'bg-amber-100 text-amber-700 ring-amber-200',      icon: Clock },
    paid:       { label: 'Sukses',   color: 'bg-green-100 text-green-700 ring-green-200',         icon: CreditCard },
    processing: { label: 'Diproses', color: 'bg-purple-100 text-purple-700 ring-purple-200',   icon: Loader2, spin: true },
    completed:  { label: 'Selesai',  color: 'bg-emerald-100 text-emerald-700 ring-emerald-200', icon: CheckCircle2 },
    failed:     { label: 'Gagal',    color: 'bg-red-100 text-red-700 ring-red-200',             icon: XCircle },
};

function Pagination({ links }: { links: PaginationLink[] }) {
    if (links.length <= 3) return null;

    return (
        <div className="flex flex-wrap items-center justify-center gap-1 mt-6">
            {links.map((link, i) => (
                <button
                    key={i}
                    disabled={!link.url}
                    onClick={() => link.url && router.get(link.url, {}, { preserveScroll: true })}
                    className={`text-sm px-3 py-1.5 rounded-lg border transition ${
                        link.active
                            ? 'text-white border-transparent'
                            : link.url
                            ? 'hover:bg-slate-50 border-slate-200 text-slate-600'
                            : 'opacity-40 cursor-not-allowed border-slate-200 text-slate-400'
                    }`}
                    style={link.active ? { background: 'linear-gradient(135deg, #1a9fd4, #0a9e7e)' } : undefined}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </div>
    );
}

export default function OrdersIndex({ orders }: { orders: PaginatedOrders }) {
    const [confirmId, setConfirmId] = useState<number | null>(null);
    const { delete: deleteOrder, processing: deleteProcessing } = useForm({});

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(price));

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return {
            date: d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            time: d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        };
    };

    const handleDelete = (id: number) => {
        deleteOrder(`/orders/${id}`, {
            onFinish: () => setConfirmId(null),
        });
    };

    const rows = orders.data;

    return (
        <PublicLayout>
            <Head title="Riwayat Transaksi" />

            <div className="max-w-3xl mx-auto px-2">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Riwayat Transaksi</h1>
                        <p className="text-sm text-slate-500 mt-0.5">
                            {orders.total} transaksi dari seluruh pengguna NextPlay
                        </p>
                    </div>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-white px-4 py-2 rounded-xl transition-opacity hover:opacity-90"
                        style={{ background: 'linear-gradient(135deg, #1a9fd4, #0a9e7e)' }}
                    >
                        + Top Up Baru
                    </Link>
                </div>

                {/* Info: transaksi milik sendiri butuh nomor invoice / login untuk lihat detail */}
                <div className="flex items-start gap-2.5 bg-cyan-50 border border-cyan-100 rounded-xl px-4 py-3 mb-6">
                    <Receipt className="w-4 h-4 text-cyan-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-cyan-800 leading-relaxed">
                        Ini adalah aktivitas transaksi dari semua pengguna, jadi sebagian data (ID akun game) disamarkan.
                        Untuk melihat detail lengkap pembelianmu sendiri, buka{' '}
                        <Link href="/cek-transaksi" className="font-semibold underline underline-offset-2">
                            Cek Transaksi
                        </Link>{' '}
                        pakai nomor invoicemu.
                    </p>
                </div>

                {rows.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <ClipboardList className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                        <p className="font-semibold text-slate-700 mb-1">Belum ada transaksi</p>
                        <p className="text-sm text-slate-400 mb-5">Yuk mulai top up game favoritmu!</p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-white px-5 py-2.5 rounded-xl hover:opacity-90 transition"
                            style={{ background: 'linear-gradient(135deg, #1a9fd4, #0a9e7e)' }}
                        >
                            Mulai Top Up
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="space-y-3">
                            {rows.map((order) => {
                                const status = STATUS_MAP[order.status] ?? { label: order.status, color: 'bg-slate-100 text-slate-600 ring-slate-200', icon: Circle };
                                const { date, time } = formatDate(order.created_at);
                                const gameName = order.items[0]?.product?.game?.name;
                                const productName = order.items[0]?.product?.name;
                                const isConfirming = confirmId === order.id;
                                const isDeleting = deleteProcessing && confirmId === order.id;

                                const Wrapper = order.is_own ? Link : ('div' as const);
                                const wrapperProps = order.is_own
                                    ? { href: orderShow(order.id) }
                                    : {};

                                return (
                                    <div
                                        key={order.id}
                                        className={`bg-white border rounded-2xl shadow-sm transition-all duration-200 overflow-hidden ${
                                            order.is_own
                                                ? 'border-cyan-200 hover:shadow-md'
                                                : 'border-slate-100'
                                        }`}
                                    >
                                        <Wrapper
                                            {...wrapperProps}
                                            className={`flex items-center gap-4 p-4 group ${order.is_own ? '' : 'cursor-default'}`}
                                        >
                                            {/* Icon */}
                                            <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-xl bg-slate-50 border border-slate-100 group-hover:border-cyan-100 transition">
                                                💎
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                                    <p className="font-semibold text-sm text-slate-800 truncate">{gameName ?? '—'}</p>
                                                    <span className="text-slate-300 text-xs hidden sm:inline">·</span>
                                                    <p className="text-xs text-slate-500 truncate hidden sm:inline">{productName}</p>
                                                    {order.is_own && (
                                                        <span className="text-[10px] font-semibold text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded-full ring-1 ring-cyan-100">
                                                            Punyamu
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-400 sm:hidden truncate">{productName}</p>
                                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                    <span className="text-xs text-slate-400">{date}</span>
                                                    <span className="text-slate-200 text-xs">·</span>
                                                    <span className="text-xs text-slate-400">{time}</span>
                                                    {order.game_user_id && (
                                                        <>
                                                            <span className="text-slate-200 text-xs">·</span>
                                                            <span className="text-xs text-slate-400 font-mono">{order.game_user_id}</span>
                                                        </>
                                                    )}
                                                    {order.is_own && order.invoice_number && (
                                                        <>
                                                            <span className="text-slate-200 text-xs">·</span>
                                                            <span className="text-xs text-slate-400 font-mono">{order.invoice_number}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Right */}
                                            <div className="flex-shrink-0 flex flex-col items-end gap-1.5">
                                                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ring-1 ${status.color}`}>
                                                    <status.icon className={`w-3 h-3 ${status.spin ? 'animate-spin' : ''}`} />
                                                    {status.label}
                                                </span>
                                                <p className="font-bold text-sm text-slate-800">{formatPrice(order.total_price)}</p>
                                            </div>

                                            {order.is_own && (
                                                <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0 group-hover:text-cyan-400 transition-colors" />
                                            )}
                                        </Wrapper>

                                        {/* Delete bar — hanya untuk transaksi milik sendiri */}
                                        {order.is_own && (
                                            <div className="border-t border-slate-100 px-4 py-2.5 flex items-center justify-between bg-slate-50/50">
                                                <span className="text-xs text-slate-400 inline-flex items-center gap-1">
                                                    {order.payment_method && (
                                                        <>
                                                            <CreditCard className="w-3 h-3" />
                                                            {order.payment_method}
                                                        </>
                                                    )}
                                                </span>

                                                {!isConfirming ? (
                                                    <button
                                                        onClick={() => setConfirmId(order.id)}
                                                        className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition-colors font-medium"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                        Hapus
                                                    </button>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-red-500 font-medium">Hapus transaksi ini?</span>
                                                        <button
                                                            onClick={() => handleDelete(order.id)}
                                                            disabled={isDeleting}
                                                            className="text-xs bg-red-500 text-white px-2.5 py-1 rounded-lg hover:bg-red-600 transition disabled:opacity-50 font-medium"
                                                        >
                                                            {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
                                                        </button>
                                                        <button
                                                            onClick={() => setConfirmId(null)}
                                                            className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1 rounded-lg transition font-medium"
                                                        >
                                                            Batal
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <Pagination links={orders.links} />
                    </>
                )}
            </div>
        </PublicLayout>
    );
}