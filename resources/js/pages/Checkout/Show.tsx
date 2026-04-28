import { Head, useForm, Link } from '@inertiajs/react';
import { show as GameShow } from '@/routes/game';

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

export default function CheckoutShow({ product, client_key }: Props) {
    const { data, setData,  processing, errors } = useForm({
        product_id: product.id,
        game_user_id: '',
    });

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if(!data.game_user_id) return;

        try{
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
        //Minta Snap token ke Laravel
        const res = await fetch('/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            },
            body: JSON.stringify({
                product_id:     data.product_id,
                game_user_id:   data.game_user_id,
            }),
        });

        const { snap_token, order_id } = await res.json();

        //Buka popup Midtrans
        window.snap.pay(snap_token, {
            onSucces: async (result: any) => {
                await fetch(`/orders/${order_id}/status`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                    body: JSON.stringify({ status: 'paid' }),
                });
                window.location.href = '/orders';
            },
            onPending: () => {
                window.location.href = '/orders';
            },
            onError: () => {
                window.location.href = '/orders';
            },
            onClose: () => {
                alert('Pembayaran dibatalkan');
            },
        });
        }catch(error){
            console.error('Checkout Error: ', error);
            alert('Terjadi keasalahan, coba lagi');
        }
        
    }

    return (
        <>
            {/* Load Midtrans Snap JS */}
            <script 
                src="https://app.sandbox.midtrans.com/snap/snap.js"
                data-client-key= {client_key}
            />

            <Head title="Checkout" />

            <div className="p-6 max-w-lg mx-auto">
                <div className="mb-6">
                    <Link
                        href={GameShow(product.game.slug)}
                        className="text-muted-foreground hover:text-primary text-sm"
                    >
                        ← Kembali
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

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* ID Akun Game */}
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

                    <button
                        type="submit"
                        disabled={processing || !data.game_user_id}
                        className="w-full bg-primary text-primary-foreground rounded-lg py-3 font-semibold hover:opacity-90 transition disabled:opacity-50"
                    >
                        {processing ? 'Memproses...' : `Bayar ${formatPrice(product.price)}`}
                    </button>
                </form>
            </div>
        </>
    );
}