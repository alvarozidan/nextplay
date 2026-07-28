import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import {
    Zap, Headset, Globe, ClipboardList, AlertTriangle, ArrowLeft,
    Gamepad2, Check, Package, Landmark, Smartphone, QrCode,
    Store, CreditCard, ShoppingCart, Loader2,
    type LucideIcon,
} from 'lucide-react';

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

const BADGES: { icon: LucideIcon; label: string }[] = [
    { icon: Zap, label: 'Proses 1-60 Detik' },
    { icon: Headset, label: 'Support 09.00–21.00 WIB' },
    { icon: Globe, label: 'Region Indonesia & Global' },
];

const STEPS = [
    'Masukkan ID akun game kamu',
    'Pilih nominal yang diinginkan',
    'Pilih metode pembayaran',
    'Klik tombol Pesan Sekarang',
    'Item masuk otomatis ke akunmu',
];

// Grup metode pembayaran
const PAYMENT_GROUPS: { key: string; label: string; icon: LucideIcon; desc: string; logos: string[] }[] = [
    {
        key: 'bank_transfer',
        label: 'Transfer Bank',
        icon: Landmark,
        desc: 'BCA, BNI, BRI, Mandiri, dll',
        logos: ['BCA', 'BNI', 'BRI', 'Mandiri'],
    },
    {
        key: 'ewallet',
        label: 'E-Wallet',
        icon: Smartphone,
        desc: 'GoPay, ShopeePay, OVO, Dana',
        logos: ['GoPay', 'ShopeePay', 'OVO', 'Dana'],
    },
    {
        key: 'qris',
        label: 'QRIS',
        icon: QrCode,
        desc: 'Scan QR dari semua aplikasi',
        logos: ['QRIS'],
    },
    {
        key: 'convenience_store',
        label: 'Minimarket',
        icon: Store,
        desc: 'Indomaret & Alfamart',
        logos: ['Indomaret', 'Alfamart'],
    },
    {
        key: 'credit_card',
        label: 'Kartu Kredit',
        icon: CreditCard,
        desc: 'Visa, Mastercard, JCB',
        logos: ['Visa', 'Mastercard'],
    },
];

// Warna badge per logo (dekoratif)
const LOGO_COLORS: Record<string, string> = {
    BCA:        '#005baa',
    BNI:        '#f15a23',
    BRI:        '#004b87',
    Mandiri:    '#003087',
    GoPay:      '#00aa5b',
    ShopeePay:  '#ee4d2d',
    OVO:        '#4c3494',
    Dana:       '#118eea',
    QRIS:       '#e2231a',
    Indomaret:  '#e2231a',
    Alfamart:   '#e2231a',
    Visa:       '#1a1f71',
    Mastercard: '#eb001b',
};

export default function GameShow({ game, client_key }: { game: Game; client_key: string }) {
    const [userId, setUserId]           = useState('');
    const [server, setServer]           = useState('');
    const [snapReady, setSnapReady]     = useState(false);
    const [loading, setLoading]         = useState(false);
    const [selectedProduct, setSelectedProduct]       = useState<Product | null>(null);
    const [selectedPayment, setSelectedPayment]       = useState<string | null>(null);

    const needsServer = game.slug.toLowerCase().includes('mobile-legend') ||
                        game.slug.toLowerCase().includes('mobilelegend');

    const gameUserId = needsServer && server.trim()
        ? `${userId.trim()}(${server.trim()})`
        : userId.trim();

    const canPay = userId.trim() !== '' && (!needsServer || server.trim() !== '');

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

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

    const handleOrder = async () => {
        if (!selectedProduct || !selectedPayment) return;
        if (!canPay) { alert('Mohon isi ID akun game kamu terlebih dahulu.'); return; }
        if (!snapReady || !window.snap) { alert('Payment gateway belum siap, coba lagi sebentar.'); return; }

        setLoading(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
            const res = await fetch('/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken },
                body: JSON.stringify({
                    product_id:    selectedProduct.id,
                    game_user_id:  gameUserId,
                    payment_group: selectedPayment,
                }),
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
                onClose:   () => { setLoading(false); },
            });
        } catch (err) {
            console.error(err);
            alert('Terjadi kesalahan, coba lagi.');
            setLoading(false);
        }
    };

    const selectedPaymentGroup = PAYMENT_GROUPS.find(p => p.key === selectedPayment);

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
                            <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-white/10 flex items-center justify-center shadow-xl">
                                <Gamepad2 className="w-12 h-12 md:w-16 md:h-16 text-white/70" />
                            </div>
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
                                    <b.icon className="w-3.5 h-3.5" />
                                    {b.label}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* BACK */}
            <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-6">
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Beranda
            </Link>

            {/* MAIN */}
            <div className="flex flex-col lg:flex-row gap-6">

                {/* LEFT — Guide */}
                <div className="lg:w-72 flex-shrink-0">
                    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm sticky top-24">
                        <h3 className="font-bold text-slate-800 mb-4 text-sm flex items-center gap-2">
                            <ClipboardList className="w-4 h-4 text-cyan-500" />
                            Cara Top Up {game.name}
                        </h3>
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
                                <p className="text-xs text-slate-400 font-medium mb-1 flex items-center gap-1.5">
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                    Catatan
                                </p>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Jangan gabungkan nomor ID dan Server dalam satu kolom!
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT */}
                <div className="flex-1 space-y-5">

                    {/* STEP 1 — UID */}
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

                    {/* STEP 2 — Nominal */}
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
                                <Package className="w-10 h-10 mx-auto mb-3" />
                                <p className="font-medium">Belum ada paket tersedia</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                                {game.products.map((product) => {
                                    const isSelected = selectedProduct?.id === product.id;
                                    return (
                                        <button
                                            key={product.id}
                                            onClick={() => setSelectedProduct(isSelected ? null : product)}
                                            className={`group relative rounded-xl p-4 border-2 transition-all duration-200 text-left bg-white
                                                ${isSelected
                                                    ? 'border-cyan-400 shadow-md ring-2 ring-cyan-200 -translate-y-0.5'
                                                    : 'border-slate-200 hover:border-cyan-300 hover:shadow-md hover:-translate-y-0.5'
                                                }`}
                                        >
                                            {isSelected && (
                                                <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center">
                                                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                                </span>
                                            )}
                                            <div className="text-2xl mb-2">💎</div>
                                            <p className={`font-semibold text-sm leading-tight mb-0.5 transition-colors ${isSelected ? 'text-cyan-600' : 'text-slate-800 group-hover:text-cyan-600'}`}>
                                                {product.name}
                                            </p>
                                            <p className="text-xs text-slate-400 mb-3">
                                                {product.diamond_amount > 0 ? `${product.diamond_amount} diamond` : ''}
                                            </p>
                                            <div className="inline-flex items-center text-xs font-bold text-white px-2.5 py-1 rounded-full"
                                                style={{ background: 'linear-gradient(135deg, #1a9fd4, #0a9e7e)' }}>
                                                {formatPrice(product.price)}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* STEP 3 — Metode Pembayaran (muncul setelah nominal dipilih) */}
                    {selectedProduct && (
                        <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-full text-white text-sm font-bold flex items-center justify-center flex-shrink-0"
                                    style={{ background: 'linear-gradient(135deg, #1a9fd4, #0a9e7e)' }}>3</div>
                                <h2 className="font-bold text-slate-800">Pilih Metode Pembayaran</h2>
                            </div>

                            <div className="space-y-2.5">
                                {PAYMENT_GROUPS.map((group) => {
                                    const isSelected = selectedPayment === group.key;
                                    return (
                                        <button
                                            key={group.key}
                                            onClick={() => setSelectedPayment(isSelected ? null : group.key)}
                                            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border-2 text-left transition-all duration-200
                                                ${isSelected
                                                    ? 'border-cyan-400 bg-cyan-50 shadow-sm'
                                                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                                }`}
                                        >
                                            {/* Radio indicator */}
                                            <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-cyan-500' : 'border-slate-300'}`}>
                                                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-cyan-500" />}
                                            </div>

                                            {/* Icon + Label */}
                                            <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                                                style={{ background: isSelected ? 'rgba(6,182,212,0.1)' : '#f8fafc' }}>
                                                <group.icon className={`w-5 h-5 ${isSelected ? 'text-cyan-600' : 'text-slate-500'}`} />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <p className={`font-semibold text-sm ${isSelected ? 'text-cyan-700' : 'text-slate-800'}`}>
                                                    {group.label}
                                                </p>
                                                <p className="text-xs text-slate-400 mt-0.5">{group.desc}</p>
                                            </div>

                                            {/* Logo badges */}
                                            <div className="flex-shrink-0 flex items-center gap-1.5 flex-wrap justify-end max-w-[140px]">
                                                {group.logos.map(logo => (
                                                    <span
                                                        key={logo}
                                                        className="text-white text-[10px] font-bold px-2 py-0.5 rounded"
                                                        style={{ background: LOGO_COLORS[logo] ?? '#64748b' }}
                                                    >
                                                        {logo}
                                                    </span>
                                                ))}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* STEP 4 — Konfirmasi & Pesan (muncul setelah metode dipilih) */}
                    {selectedProduct && selectedPayment && (
                        <div className="bg-white border-2 border-cyan-200 rounded-2xl p-5 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-full text-white text-sm font-bold flex items-center justify-center flex-shrink-0"
                                    style={{ background: 'linear-gradient(135deg, #1a9fd4, #0a9e7e)' }}>4</div>
                                <h2 className="font-bold text-slate-800">Konfirmasi Pesanan</h2>
                            </div>

                            {/* Ringkasan */}
                            <div className="bg-slate-50 rounded-xl p-4 mb-4 space-y-2.5">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">Paket</span>
                                    <span className="font-semibold text-slate-800">
                                        {selectedProduct.name}
                                        {selectedProduct.diamond_amount > 0 && (
                                            <span className="text-slate-400 font-normal ml-1">({selectedProduct.diamond_amount} 💎)</span>
                                        )}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">Metode</span>
                                    <span className="font-semibold text-slate-800 inline-flex items-center gap-1.5">
                                        {selectedPaymentGroup && <selectedPaymentGroup.icon className="w-4 h-4" />}
                                        {selectedPaymentGroup?.label}
                                    </span>
                                </div>
                                <div className="border-t border-slate-200 pt-2.5 flex items-center justify-between">
                                    <span className="font-bold text-slate-800">Total</span>
                                    <span className="font-extrabold text-lg" style={{ background: 'linear-gradient(135deg, #1a9fd4, #0a9e7e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                        {formatPrice(selectedProduct.price)}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={handleOrder}
                                disabled={loading || !canPay || !snapReady}
                                className="w-full py-3.5 rounded-xl text-white font-bold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
                                style={{ background: 'linear-gradient(135deg, #1a9fd4, #0a9e7e)' }}
                            >
                                {!snapReady ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Memuat payment gateway...</>
                                ) : !canPay ? (
                                    <><AlertTriangle className="w-4 h-4" /> Isi ID akun game terlebih dahulu</>
                                ) : loading ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Memproses...</>
                                ) : (
                                    <><ShoppingCart className="w-4 h-4" /> Pesan Sekarang — {formatPrice(selectedProduct.price)}</>
                                )}
                            </button>

                            {!canPay && (
                                <p className="text-xs text-amber-600 text-center mt-2">
                                    Kembali ke langkah 1 dan isi ID akun game kamu.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}