import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { store as adminProductsStore, destroy as adminProductsDestroy } from '@/routes/admin/products';

interface Product {
    id: number;
    name: string;
    diamond_amount: number;
    price: number;
    is_active: boolean;
    game: { id: number; name: string };
}

interface Game {
    id: number;
    name: string;
}

interface Props {
    products: Product[];
    games: Game[];
}

export default function AdminProductsIndex({ products, games }: Props) {
    const [showForm, setShowForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        game_id: '',
        name: '',
        diamond_amount: '',
        price: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(adminProductsStore.url(), {
            onSuccess: () => { reset(); setShowForm(false); }
        });
    }

    function handleDelete(id: number) {
        if (confirm('Yakin ingin menghapus produk ini?')) {
            router.delete(adminProductsDestroy.url(id));
        }
    }

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);

    return (
        <>
            <Head title="Kelola Produk" />

            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold">Kelola Produk</h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
                    >
                        {showForm ? 'Batal' : '+ Tambah Produk'}
                    </button>
                </div>

                {/* Form tambah produk */}
                {showForm && (
                    <form onSubmit={handleSubmit} className="border rounded-xl p-4 mb-6 space-y-3">
                        <div>
                            <label className="block text-sm font-medium mb-1">Game</label>
                            <select
                                value={data.game_id}
                                onChange={e => setData('game_id', e.target.value)}
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="">Pilih Game</option>
                                {games.map(game => (
                                    <option key={game.id} value={game.id}>{game.name}</option>
                                ))}
                            </select>
                            {errors.game_id && <p className="text-destructive text-xs mt-1">{errors.game_id}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Nama Produk</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="contoh: 86 Diamonds"
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">Jumlah Diamond</label>
                                <input
                                    type="number"
                                    value={data.diamond_amount}
                                    onChange={e => setData('diamond_amount', e.target.value)}
                                    placeholder="86"
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                {errors.diamond_amount && <p className="text-destructive text-xs mt-1">{errors.diamond_amount}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Harga (Rp)</label>
                                <input
                                    type="number"
                                    value={data.price}
                                    onChange={e => setData('price', e.target.value)}
                                    placeholder="19000"
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                {errors.price && <p className="text-destructive text-xs mt-1">{errors.price}</p>}
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Produk'}
                        </button>
                    </form>
                )}

                {/* Tabel produk */}
                <div className="border rounded-xl divide-y">
                    {products.length === 0 ? (
                        <p className="p-4 text-muted-foreground text-sm">Belum ada produk.</p>
                    ) : (
                        products.map(product => (
                            <div key={product.id} className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="font-medium">{product.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {product.game.name} · {product.diamond_amount} diamonds
                                    </p>
                                    <p className="text-sm font-semibold text-primary mt-0.5">
                                        {formatPrice(product.price)}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDelete(product.id)}
                                    className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-800 hover:bg-red-200 transition"
                                >
                                    Hapus
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}