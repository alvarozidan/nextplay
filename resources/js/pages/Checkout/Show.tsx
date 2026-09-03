import { useState, useEffect } from 'react';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import { show as GameShow } from '@/routes/game';
import { ArrowLeft, Landmark, Smartphone, QrCode, Store, CreditCard, type LucideIcon } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    diamond_amount: number;
    price: number;
    game: { name: string; slug: string };
}

interface Props {
    product: Product;
    client_key: string;
}

declare global {
    interface Window {
        snap: {
            pay: (token: string, options: object) => void;
        };
    }
}

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

export default function CheckoutShow({ product, client_key }: Props) {
    const { auth } = usePage().props;
    const params = new URLSearchParams(window.location.search);
    const prefillUid = params.get('game_user_id') ?? '';

    const { data, setData, processing, errors } = useForm({
        product_id:    product.id,
        game_user_id:  prefillUid,
        payment_group: '' as string,
        guest_name:    '',
        guest_email:   '',
    });

    const [snapReady, setSnapReady]       = useState(false);
    const [snapLoading, setSnapLoading]   = useState(false);

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
        script.setAttribute('data-client-key', client_key);
        script.onload = () => setSnapReady(true);
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [client_key]);

    // Beri tahu backend bahwa order ini gagal/dibatalkan supaya statusnya
    // tidak nyangkut selamanya di "pending" (menunggu pembayaran) di
    // riwayat transaksi. Order yang sudah 'paid' tidak akan terpengaruh,
    // karena endpoint ini hanya mengubah order yang masih 'pending'.
    const cancelOrder = (orderId: number | string, cancelToken: string) => {
        const csrfToken =
            document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

        fetch(`/orders/${orderId}/cancel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
            },
            body: JSON.stringify({ cancel_token: cancelToken }),
            keepalive: true,
        }).catch(() => {
            // Diamkan saja kalau request cancel gagal terkirim (mis. user
            // langsung menutup tab). Order tetap akan otomatis kedaluwarsa
            // lewat scheduled command ExpirePendingOrders.
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.game_user_id || !data.payment_group) return;

        if (!snapReady || !window.snap) {
            alert('Payment gateway belum siap, coba lagi sebentar.');
            return;
        }

        setSnapLoading(true);
        try {
            const csrfToken =
                document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

            const res = await fetch('/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({
                    product_id:    data.product_id,
                    game_user_id:  data.game_user_id,
                    payment_group: data.payment_group,
                    guest_name:    data.guest_name,
                    guest_email:   data.guest_email,
                }),
            });

            const body = await res.json();

            if (!res.ok) {
                // Backend gagal minta snap token (mis. Midtrans tidak bisa
                // dihubungi / server key salah). Tampilkan pesan asli dari
                // server, jangan lanjut panggil window.snap.pay dengan
                // token kosong.
                alert(body.message ?? 'Gagal memulai pembayaran, coba lagi.');
                setSnapLoading(false);
                return;
            }

            const { snap_token, order_id, cancel_token } = body;

            window.snap.pay(snap_token, {
                onSuccess: () => {
                    window.location.href = `/invoice/${order_id}?token=${cancel_token}`;
                },
                onPending: () => {
                    window.location.href = `/invoice/${order_id}?token=${cancel_token}`;
                },
                onError: () => {
                    cancelOrder(order_id, cancel_token);
                    alert('Pembayaran gagal / terjadi kesalahan. Silakan coba lagi.');
                    setSnapLoading(false);
                },
                onClose: () => {
                    // User menutup popup tanpa menyelesaikan pembayaran.
                    cancelOrder(order_id, cancel_token);
                    setSnapLoading(false);
                },
            });
        } catch (error) {
            console.error('Checkout Error:', error);
            alert('Terjadi kesalahan, coba lagi.');
            setSnapLoading(false);
        }
    };

    const isGuestValid = auth.user
                ? true
                : !!data.guest_name && !!data.guest_email;

    const canSubmit =
        !!data.game_user_id && !!data.payment_group && isGuestValid && snapReady && !processing && !snapLoading;

    return (
        <>
            <Head title="Checkout" />

            <div className="p-6 max-w-lg mx-auto">
                {/* Kembali */}
                <div className="mb-6">
                    <Link
                        href={GameShow(product.game.slug)}
                        className="text-muted-foreground hover:text-primary text-sm inline-flex items-center gap-1.5"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali
                    </Link>
                </div>

                <h1 className="text-2xl font-semibold mb-6">Checkout</h1>

                {/* Ringkasan produk */}
                <div className="border rounded-xl p-4 mb-6 bg-muted/30">
                    <p className="text-sm text-muted-foreground mb-1">{product.game.name}</p>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.diamond_amount} diamonds</p>
                    <p className="text-primary font-bold text-lg mt-2">
                        {formatPrice(product.price)}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Step 1 — ID Akun Game */}
                    {!auth.user && (
                        <div className="space-y-3">
                        <label className="block text-sm font-medium mb-1">
                            Informasi Kontak
                        </label>
                    <input
                        type="text"
                        value={data.guest_name}
                        onChange={e => setData('guest_name', e.target.value)}
                        placeholder="Nama kamu"
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                        type="email"
                        value={data.guest_email}
                        onChange={e => setData('guest_email', e.target.value)}
                        placeholder="Email kamu"
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
    )}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            ID Akun Game
                        </label>
                        <input
                            type="text"
                            value={data.game_user_id}
                            onChange={e => setData('game_user_id', e.target.value)}
                            placeholder="Masukkan ID akun game kamu"
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        {errors.game_user_id && (
                            <p className="text-destructive text-xs mt-1">{errors.game_user_id}</p>
                        )}
                    </div>

                    {/* Step 2 — Metode Pembayaran */}
                    <div>
                        <label className="block text-sm font-medium mb-3">
                            Metode Pembayaran
                        </label>
                        <div className="space-y-2">
                            {PAYMENT_GROUPS.map((group) => {
                                const isSelected = data.payment_group === group.key;
                                return (
                                    <button
                                        key={group.key}
                                        type="button"
                                        onClick={() =>
                                            setData('payment_group', isSelected ? '' : group.key)
                                        }
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all duration-150 ${
                                            isSelected
                                                ? 'border-primary bg-primary/5'
                                                : 'border-border hover:border-muted-foreground/40 hover:bg-muted/40'
                                        }`}
                                    >
                                        {/* Radio indicator */}
                                        <div
                                            className={`flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                                                isSelected ? 'border-primary' : 'border-muted-foreground/40'
                                            }`}
                                        >
                                            {isSelected && (
                                                <div className="w-2 h-2 rounded-full bg-primary" />
                                            )}
                                        </div>

                                        {/* Icon */}
                                        <group.icon className="w-5 h-5 flex-shrink-0 text-muted-foreground" />

                                        {/* Label + desc */}
                                        <div className="flex-1 min-w-0">
                                            <p
                                                className={`text-sm font-semibold ${
                                                    isSelected
                                                        ? 'text-primary'
                                                        : 'text-foreground'
                                                }`}
                                            >
                                                {group.label}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {group.desc}
                                            </p>
                                        </div>

                                        {/* Logo badges */}
                                        <div className="flex-shrink-0 flex flex-wrap items-center gap-1 justify-end max-w-[130px]">
                                            {group.logos.map((logo) => (
                                                <span
                                                    key={logo}
                                                    className="text-white text-[10px] font-bold px-1.5 py-0.5 rounded"
                                                    style={{
                                                        background: LOGO_COLORS[logo] ?? '#64748b',
                                                    }}
                                                >
                                                    {logo}
                                                </span>
                                            ))}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                        {errors.payment_group && (
                            <p className="text-destructive text-xs mt-1">{errors.payment_group}</p>
                        )}
                    </div>

                    {/* Tombol bayar */}
                    <button
                        type="submit"
                        disabled={!canSubmit}
                        className="w-full bg-primary text-primary-foreground rounded-lg py-3 font-semibold hover:opacity-90 transition disabled:opacity-50"
                    >
                        {!snapReady
                            ? 'Memuat...'
                            : snapLoading
                            ? 'Membuka pembayaran...'
                            : `Bayar ${formatPrice(product.price)}`}
                    </button>
                </form>
            </div>
        </>
    );
}