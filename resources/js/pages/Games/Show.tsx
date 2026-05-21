import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';

interface Product {
    id: number;
    name: string;
    diamond_amount: number;
    price: number;
}

interface Game {
    id: number;
    name: string;
    slug: string;
    description?: string;
    developer?: string;
    image: string | null;
    products: Product[];
}

declare global {
    interface Window {
        snap: { pay: (token: string, options: object) => void };
    }
}

const BADGES = [
    { icon: '⚡', label: 'Proses 1-60 Detik' },
    { icon: '🎧', label: 'Support 09.00–21.00 WIB' },
    { icon: '🌏', label: 'Region Indonesia & Global' },
];

const STEPS = [
    'Masukkan ID akun game kamu',
    'Pilih nominal yang diinginkan',
    'Selesaikan pembayaran di popup',
    'Item masuk otomatis ke akunmu',
];

export default function GameShow({ game, client_key }: { game: Game; client_key: string }) {
    const [userId, setUserId]     = useState('');
    const [server, setServer]     = useState('');
    const [snapReady, setSnapReady] = useState(false);
    const [loadingId, setLoadingId] = useState<number | null>(null);

    const needsServer = game.slug.toLowerCase().includes('mobile-legend') ||
                        game.slug.toLowerCase().includes('mobilelegend');

    const gameUserId = needsServer && server.trim()
        ? `${userId.trim()}(${server.trim()})`
        : userId.trim();

    const canPay = userId.trim() !== '' && (!needsServer || server.trim() !== '');

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

    // Load Snap.js once
    useEffect(() => {
        if (!client_key) return;
        const existing = document.getElementById('midtrans-snap');
        if (existing) { setSnapReady(true); return; }
        const script = document.createElement('script');
        script.id  = 'midtrans-snap';
        script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
        script.setAttribute('data-client-key', client_key);
        script.onload = () => setSnapReady(true);
        document.body.appendChild(script);
    }, [client_key]);

    const handleBuy = async (product: Product) => {
        if (!canPay) {
            alert('Mohon isi ID akun game kamu terlebih dahulu.');
            return;
        }
        if (!snapReady || !window.snap) {
            alert('Payment gateway belum siap, coba lagi sebentar.');
            return;
        }

        setLoadingId(product.id);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
            const res = await fetch('/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken },
                body: JSON.stringify({ product_id: product.id, game_user_id: gameUserId }),
            });
            const { snap_token, order_id } = await res.json();

            window.snap.pay(snap_token, {
                onSuccess: async () => {
                    const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
                    await fetch(`/orders/${order_id}/status`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrf },
                        body: JSON.stringify({ status: 'paid' }),
                    });
                    window.location.href = '/orders';
                },
                onPending: () => { window.location.href = '/orders'; },
                onError:   () => { window.location.href = '/orders'; },
                onClose:   () => { setLoadingId(null); },
            });
        } catch (err) {
            console.error(err);
            alert('Terjadi kesalahan, coba lagi.');
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <PublicLayout>
            <Head title={`Top Up ${game.name} — NextPlay`} />

            {/* HERO */}
            <div className="relative rounded-2xl overflow-hidden mb-8"
                style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0a4a3a 100%)' }}>
                <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10"
                    style={{ background: 'radial-gradient(circle, #38bdf8, transparent)', transform: 'translate(30%,-30%)' }} />
                <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full opacity-10"
                    style={{ background: 'radial-gradient(circle, #34d399, transparent)', transform: 'translate(-30%,30%)' }} />

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 p-6 md:p-10">
                    <div className="flex-shrink-0">
                        {game.image ? (
                            <img src={`/storage/${game.image}`} alt={game.name}
                                className="w-28 h-28 md:w-36 md:h-36 rounded-2xl object-cover shadow-2xl ring-4 ring-white/10" />
                        ) : (
                            <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-white/10 flex items-center justify-center text-5xl shadow-xl">🎮</div>
                        )}
                    </div>
                    <div className="text-center md:text-left">
                        <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Top Up & Voucher Resmi
                        </span>
                        <h1 className="text-2xl md:text-4xl font-extrabold text-white mb-1">Top Up {game.name}</h1>
                        <p className="text-slate-400 text-sm mb-5">
                            Transaksi cepat, aman, dan otomatis untuk semua pengguna {game.name}.
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                            {BADGES.map((b) => (
                                <span key={b.label}
                                    className="flex items-center gap-1.5 bg-white/10 text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/10">
                                    {b.icon} {b.label}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* BACK */}
            <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-6">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Kembali ke Beranda
            </Link>

            {/* MAIN */}
            <div className="flex flex-col lg:flex-row gap-6">

                {/* LEFT — Guide */}
                <div className="lg:w-72 flex-shrink-0">
                    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm sticky top-4">
                        <h3 className="font-bold text-slate-800 mb-4 text-sm">📋 Cara Top Up {game.name}</h3>
                        <ol className="space-y-3">
                            {STEPS.map((step, i) => (
                                <li key={i} className="flex gap-3 items-start">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center"
                                        style={{ background: 'linear-gradient(135deg, #1a9fd4, #0a9e7e)' }}>
                                        {i + 1}
                                    </span>
                                    <span className="text-sm text-slate-600 leading-snug">{step}</span>
                                </li>
                            ))}
                        </ol>
                        {needsServer && (
                            <div className="mt-5 pt-4 border-t border-slate-100">
                                <p className="text-xs text-slate-400 font-medium mb-1">⚠️ Catatan</p>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Jangan gabungkan nomor ID dan Server dalam satu kolom!
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT */}
                <div className="flex-1 space-y-5">

                    {/* STEP 1 — UID Form */}
                    <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full text-white text-sm font-bold flex items-center justify-center flex-shrink-0"
                                style={{ background: 'linear-gradient(135deg, #1a9fd4, #0a9e7e)' }}>1</div>
                            <h2 className="font-bold text-slate-800">Masukkan Data Akun Kamu</h2>
                        </div>

                        <div className={`grid gap-3 ${needsServer ? 'grid-cols-2' : 'grid-cols-1'}`}>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                    {needsServer ? 'ID' : 'User ID'}
                                </label>
                                <input
                                    type="text"
                                    value={userId}
                                    onChange={e => setUserId(e.target.value)}
                                    placeholder={needsServer ? 'Contoh: 91234567' : 'Masukkan User ID'}
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition"
                                />
                            </div>
                            {needsServer && (
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Server</label>
                                    <input
                                        type="text"
                                        value={server}
                                        onChange={e => setServer(e.target.value)}
                                        placeholder="Contoh: 1234"
                                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition"
                                    />
                                </div>
                            )}
                        </div>
                        {needsServer && (
                            <p className="text-xs text-slate-400 mt-2">
                                Contoh: Jika 91234567 (1234), maka ID = 91234567 dan Server = 1234
                            </p>
                        )}
                    </div>

                    {/* STEP 2 — Products */}
                    <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full text-white text-sm font-bold flex items-center justify-center flex-shrink-0"
                                style={{ background: 'linear-gradient(135deg, #1a9fd4, #0a9e7e)' }}>2</div>
                            <h2 className="font-bold text-slate-800">Pilih Nominal Top Up</h2>
                            <span className="ml-auto text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                                {game.products.length} paket
                            </span>
                        </div>

                        {game.products.length === 0 ? (
                            <div className="text-center py-10 text-slate-400">
                                <div className="text-4xl mb-3">📦</div>
                                <p className="font-medium">Belum ada paket tersedia</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                                {game.products.map((product) => {
                                    const isLoading = loadingId === product.id;
                                    return (
                                        <button
                                            key={product.id}
                                            onClick={() => handleBuy(product)}
                                            disabled={isLoading}
                                            className="group relative rounded-xl p-4 border-2 border-slate-200 hover:border-cyan-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-left bg-white disabled:opacity-60 disabled:cursor-wait"
                                        >
                                            <div className="text-2xl mb-2">💎</div>
                                            <p className="font-semibold text-sm text-slate-800 leading-tight mb-0.5 group-hover:text-cyan-600 transition-colors">
                                                {product.name}
                                            </p>
                                            <p className="text-xs text-slate-400 mb-3">
                                                {product.diamond_amount > 0 ? `${product.diamond_amount} diamond` : ''}
                                            </p>
                                            <div className="inline-flex items-center text-xs font-bold text-white px-2.5 py-1 rounded-full"
                                                style={{ background: 'linear-gradient(135deg, #1a9fd4, #0a9e7e)' }}>
                                                {isLoading ? 'Memuat...' : formatPrice(product.price)}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}