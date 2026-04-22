import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
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
}

export default function CheckoutShow({ product }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        product_id: product.id,
        game_user_id: '',
        payment_method: 'transfer',
    });

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/checkout');
    }

    return (
        <>
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

                    {/* Metode Pembayaran */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Metode Pembayaran
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {['transfer', 'qris', 'ewallet'].map((method) => (
                                <button
                                    key={method}
                                    type="button"
                                    onClick={() => setData('payment_method', method)}
                                    className={`border rounded-lg py-2 text-sm capitalize transition-all ${
                                        data.payment_method === method
                                            ? 'border-primary bg-primary/10 text-primary font-medium'
                                            : 'hover:border-primary/50'
                                    }`}
                                >
                                    {method === 'transfer' ? 'Transfer Bank' :
                                     method === 'qris' ? 'QRIS' : 'E-Wallet'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-primary text-primary-foreground rounded-lg py-3 font-semibold hover:opacity-90 transition disabled:opacity-50"
                    >
                        {processing ? 'Memproses...' : `Bayar ${formatPrice(product.price)}`}
                    </button>
                </form>
            </div>
        </>
    );
}