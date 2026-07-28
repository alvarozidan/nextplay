import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import {
    ArrowLeft, Clock, CreditCard, Loader2, CheckCircle2, XCircle, Circle, Gamepad2,
    type LucideIcon,
} from 'lucide-react';

interface Order {
    id: number;
    game_user_id: string;
    status: string;
    total_price: number;
    payment_method: string;
    created_at: string;
    items: {
        id: number;
        quantity: number;
        price: number;
        product: { name: string; diamond_amount: number; game: { name: string } };
    }[];
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; icon: LucideIcon; spin?: boolean; desc: string }> = {
    pending:    { label: 'Menunggu Pembayaran', color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200',   icon: Clock, desc: 'Transaksi menunggu konfirmasi pembayaran.' },
    paid:       { label: 'Pembayaran Diterima', color: 'text-blue-700',    bg: 'bg-blue-50 border-blue-200',     icon: CreditCard, desc: 'Pembayaran berhasil diterima, sedang diproses.' },
    processing: { label: 'Sedang Diproses',     color: 'text-purple-700',  bg: 'bg-purple-50 border-purple-200', icon: Loader2, spin: true, desc: 'Item sedang dikirimkan ke akun game kamu.' },
    completed:  { label: 'Transaksi Selesai',   color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', icon: CheckCircle2, desc: 'Item berhasil masuk ke akun game kamu.' },
    failed:     { label: 'Transaksi Gagal',     color: 'text-red-700',     bg: 'bg-red-50 border-red-200',       icon: XCircle, desc: 'Transaksi gagal. Hubungi support jika kamu sudah membayar.' },
};

export default function OrderShow({ order }: { order: Order }) {
    const formatPrice = (price: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });

    const status = STATUS_MAP[order.status] ?? {
        label: order.status, color: 'text-slate-700', bg: 'bg-slate-50 border-slate-200', icon: Circle, desc: '',
    };

    return (
        <PublicLayout>
            <Head title={`Order #${order.id}`} />

            <div className="max-w-xl mx-auto px-2">
                {/* Back */}
                <Link href="/orders" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-6">
                    <ArrowLeft className="w-4 h-4" />
                    Riwayat Transaksi
                </Link>

                {/* Status Banner */}
                <div className={`rounded-2xl border p-5 mb-5 ${status.bg}`}>
                    <div className="flex items-center gap-3">
                        <status.icon className={`w-8 h-8 ${status.color} ${status.spin ? 'animate-spin' : ''}`} />
                        <div>
                            <p className={`font-bold text-base ${status.color}`}>{status.label}</p>
                            <p className="text-sm text-slate-500 mt-0.5">{status.desc}</p>
                        </div>
                    </div>
                </div>

                {/* Order ID + Date */}
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-0.5">ID Transaksi</p>
                        <p className="font-bold text-slate-800 text-lg">#{order.id}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-0.5">Tanggal</p>
                        <p className="text-sm font-medium text-slate-600">{formatDate(order.created_at)}</p>
                    </div>
                </div>

                {/* Items */}
                <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden mb-4">
                    <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Detail Produk</p>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl flex-shrink-0">
                                    💎
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm text-slate-800">{item.product.name}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        {item.product.game.name}
                                        {item.product.diamond_amount > 0 && ` · ${item.product.diamond_amount} diamond`}
                                    </p>
                                </div>
                                <p className="font-bold text-sm text-slate-700 flex-shrink-0">{formatPrice(item.price)}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info Grid */}
                <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden mb-4">
                    <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Informasi Pembayaran</p>
                    </div>
                    <div className="divide-y divide-slate-100">
                        <div className="flex items-center justify-between px-5 py-3.5">
                            <p className="text-sm text-slate-500">ID Akun Game</p>
                            <p className="text-sm font-semibold text-slate-800 font-mono">{order.game_user_id}</p>
                        </div>
                        <div className="flex items-center justify-between px-5 py-3.5">
                            <p className="text-sm text-slate-500">Metode Pembayaran</p>
                            <p className="text-sm font-semibold text-slate-800 capitalize">{order.payment_method || '—'}</p>
                        </div>
                        <div className="flex items-center justify-between px-5 py-4">
                            <p className="text-sm font-bold text-slate-800">Total Pembayaran</p>
                            <p className="text-lg font-extrabold" style={{ background: 'linear-gradient(135deg, #1a9fd4, #0a9e7e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                {formatPrice(order.total_price)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <Link
                    href="/"
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition"
                    style={{ background: 'linear-gradient(135deg, #1a9fd4, #0a9e7e)' }}
                >
                    <Gamepad2 className="w-4 h-4" />
                    Top Up Lagi
                </Link>
            </div>
        </PublicLayout>
    );
}
