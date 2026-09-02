import { Head, useForm } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import {
    Search, Clock, CreditCard, Loader2, CheckCircle2, XCircle, Circle,
    Gamepad2, Receipt, type LucideIcon,
} from 'lucide-react';

interface TrackResult {
    invoice_number: string;
    status: string;
    game_user_id: string;
    payment_method: string | null;
    total_price: number;
    created_at: string;
    product_name: string | null;
    diamond_amount: number | null;
    game_name: string | null;
}

interface Props {
    result?: TrackResult;
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; icon: LucideIcon; spin?: boolean; desc: string }> = {
    pending:    { label: 'Menunggu Pembayaran', color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200',   icon: Clock, desc: 'Transaksi menunggu konfirmasi pembayaran.' },
    paid:       { label: 'Pembayaran Diterima', color: 'text-blue-700',    bg: 'bg-blue-50 border-blue-200',     icon: CreditCard, desc: 'Pembayaran berhasil diterima, sedang diproses.' },
    processing: { label: 'Sedang Diproses',     color: 'text-purple-700',  bg: 'bg-purple-50 border-purple-200', icon: Loader2, spin: true, desc: 'Item sedang dikirimkan ke akun game kamu.' },
    completed:  { label: 'Transaksi Selesai',   color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', icon: CheckCircle2, desc: 'Item berhasil masuk ke akun game kamu.' },
    failed:     { label: 'Transaksi Gagal',     color: 'text-red-700',     bg: 'bg-red-50 border-red-200',       icon: XCircle, desc: 'Transaksi gagal / dibatalkan.' },
};

export default function TrackIndex({ result }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        invoice_number: '',
    });

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/cek-transaksi', { preserveScroll: true });
    };

    const status = result ? (STATUS_MAP[result.status] ?? {
        label: result.status, color: 'text-slate-700', bg: 'bg-slate-50 border-slate-200', icon: Circle, desc: '',
    }) : null;

    return (
        <PublicLayout>
            <Head title="Cek Transaksi — NextPlay" />

            <div className="max-w-lg mx-auto px-2">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
                        style={{ background: 'linear-gradient(135deg, #1a9fd4, #0a9e7e)' }}>
                        <Receipt className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-slate-800 mb-1">Cek Transaksi</h1>
                    <p className="text-sm text-slate-500">
                        Masukkan nomor invoice untuk melihat status pesananmu — tidak perlu login.
                    </p>
                </div>

                {/* Form pencarian */}
                <form onSubmit={handleSubmit} className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm mb-6">
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                        Nomor Invoice
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={data.invoice_number}
                            onChange={e => setData('invoice_number', e.target.value)}
                            placeholder="Contoh: NP-000123"
                            className="flex-1 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition"
                        />
                        <button
                            type="submit"
                            disabled={processing || !data.invoice_number.trim()}
                            className="flex-shrink-0 px-4 py-2.5 rounded-xl text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition flex items-center gap-2"
                            style={{ background: 'linear-gradient(135deg, #1a9fd4, #0a9e7e)' }}
                        >
                            {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                            Cari
                        </button>
                    </div>
                    {errors.invoice_number && (
                        <p className="text-red-600 text-xs mt-2">{errors.invoice_number}</p>
                    )}
                    <p className="text-xs text-slate-400 mt-2">
                        Nomor invoice bisa dilihat di halaman sukses setelah checkout.
                    </p>
                </form>

                {/* Hasil */}
                {result && status && (
                    <div>
                        <div className={`rounded-2xl border p-5 mb-5 ${status.bg}`}>
                            <div className="flex items-center gap-3">
                                <status.icon className={`w-8 h-8 ${status.color} ${status.spin ? 'animate-spin' : ''}`} />
                                <div>
                                    <p className={`font-bold text-base ${status.color}`}>{status.label}</p>
                                    <p className="text-sm text-slate-500 mt-0.5">{status.desc}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-0.5">Nomor Invoice</p>
                                <p className="font-bold text-slate-800 text-lg font-mono">{result.invoice_number}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-0.5">Tanggal</p>
                                <p className="text-sm font-medium text-slate-600">{formatDate(result.created_at)}</p>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden mb-4">
                            <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Detail Produk</p>
                            </div>
                            <div className="flex items-center gap-4 px-5 py-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl flex-shrink-0">
                                    💎
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm text-slate-800">{result.product_name ?? '—'}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        {result.game_name}
                                        {!!result.diamond_amount && ` · ${result.diamond_amount} diamond`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden mb-4">
                            <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Informasi Pembayaran</p>
                            </div>
                            <div className="divide-y divide-slate-100">
                                <div className="flex items-center justify-between px-5 py-3.5">
                                    <p className="text-sm text-slate-500">ID Akun Game</p>
                                    <p className="text-sm font-semibold text-slate-800 font-mono">{result.game_user_id}</p>
                                </div>
                                <div className="flex items-center justify-between px-5 py-3.5">
                                    <p className="text-sm text-slate-500">Metode Pembayaran</p>
                                    <p className="text-sm font-semibold text-slate-800 capitalize">{result.payment_method || '—'}</p>
                                </div>
                                <div className="flex items-center justify-between px-5 py-4">
                                    <p className="text-sm font-bold text-slate-800">Total Pembayaran</p>
                                    <p className="text-lg font-extrabold" style={{ background: 'linear-gradient(135deg, #1a9fd4, #0a9e7e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                        {formatPrice(result.total_price)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {!result && (
                    <div className="text-center text-slate-400 text-sm flex flex-col items-center gap-2 py-6">
                        <Gamepad2 className="w-8 h-8 text-slate-300" />
                        Masukkan nomor invoice di atas untuk mulai mengecek.
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}