import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import PublicLayout from '@/layouts/public-layout';
import { store as adminProductsStore, destroy as adminProductsDestroy, update as adminProductsUpdate } from '@/routes/admin/products';

interface Product {
    id: number;
    name: string;
    diamond_amount: number;
    price: number;
    is_active: boolean;
    game: { id: number; name: string };
}

interface Game { id: number; name: string; }

function formatPrice(price: number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
}

// ── Inline edit row ──────────────────────────────────────────────
function ProductRow({ product, onDelete }: { product: Product; onDelete: (id: number) => void }) {
    const [editing, setEditing] = useState(false);
    const [name, setName]           = useState(product.name);
    const [diamond, setDiamond]     = useState(String(product.diamond_amount));
    const [price, setPrice]         = useState(String(product.price));
    const [saving, setSaving]       = useState(false);

    function save() {
        setSaving(true);
        router.put(adminProductsUpdate.url(product.id), {
            name, diamond_amount: Number(diamond), price: Number(price), is_active: product.is_active,
        }, { onFinish: () => { setSaving(false); setEditing(false); } });
    }

    function toggleActive() {
        router.put(adminProductsUpdate.url(product.id), {
            name: product.name, diamond_amount: product.diamond_amount,
            price: product.price, is_active: !product.is_active,
        });
    }

    function cancel() {
        setName(product.name); setDiamond(String(product.diamond_amount));
        setPrice(String(product.price)); setEditing(false);
    }

    return (
        <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
            {/* Nama */}
            <td className="px-4 py-3">
                {editing ? (
                    <input
                        value={name} onChange={e => setName(e.target.value)}
                        className="w-full border border-cyan-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                ) : (
                    <span className="text-sm font-medium text-slate-800">{product.name}</span>
                )}
            </td>

            {/* Diamond */}
            <td className="px-4 py-3 text-center">
                {editing ? (
                    <input
                        type="number" value={diamond} onChange={e => setDiamond(e.target.value)}
                        className="w-24 border border-cyan-300 rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                ) : (
                    <span className="text-sm text-slate-600">💎 {product.diamond_amount.toLocaleString()}</span>
                )}
            </td>

            {/* Harga */}
            <td className="px-4 py-3 text-right">
                {editing ? (
                    <input
                        type="number" value={price} onChange={e => setPrice(e.target.value)}
                        className="w-32 border border-cyan-300 rounded-lg px-2 py-1 text-sm text-right focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                ) : (
                    <span className="text-sm font-semibold text-slate-800">{formatPrice(product.price)}</span>
                )}
            </td>

            {/* Status */}
            <td className="px-4 py-3 text-center">
                <button onClick={toggleActive}
                    className={`text-xs px-2.5 py-1 rounded-full font-medium transition ${product.is_active ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                    {product.is_active ? '● Aktif' : '○ Nonaktif'}
                </button>
            </td>

            {/* Aksi */}
            <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                    {editing ? (
                        <>
                            <button onClick={save} disabled={saving}
                                className="text-xs px-3 py-1 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 transition disabled:opacity-50 font-medium">
                                {saving ? '...' : 'Simpan'}
                            </button>
                            <button onClick={cancel}
                                className="text-xs px-3 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition">
                                Batal
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setEditing(true)}
                                className="text-xs px-3 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition opacity-0 group-hover:opacity-100">
                                ✏️ Edit
                            </button>
                            <button onClick={() => onDelete(product.id)}
                                className="text-xs px-3 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition opacity-0 group-hover:opacity-100">
                                🗑 Hapus
                            </button>
                        </>
                    )}
                </div>
            </td>
        </tr>
    );
}

// ── Main page ────────────────────────────────────────────────────
export default function AdminProductsIndex({ products, games }: { products: Product[]; games: Game[] }) {
    const [showForm, setShowForm]   = useState(false);
    const [filterGame, setFilterGame] = useState<string>('all');
    const [search, setSearch]       = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        game_id: '', name: '', diamond_amount: '', price: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(adminProductsStore.url(), { onSuccess: () => { reset(); setShowForm(false); } });
    }

    function handleDelete(id: number) {
        if (confirm('Yakin ingin menghapus produk ini?')) router.delete(adminProductsDestroy.url(id));
    }

    // Filter & search
    const filtered = products.filter(p => {
        const matchGame   = filterGame === 'all' || String(p.game.id) === filterGame;
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
        return matchGame && matchSearch;
    });

    // Stats per game
    const statsByGame = games.map(g => ({
        ...g,
        total:  products.filter(p => p.game.id === g.id).length,
        active: products.filter(p => p.game.id === g.id && p.is_active).length,
    }));

    return (
        <PublicLayout>
            <Head title="Kelola Produk" />
            <div className="space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Kelola Produk</h1>
                        <p className="text-sm text-slate-500 mt-0.5">{products.length} produk di {games.length} game</p>
                    </div>
                    <button onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition"
                        style={{ background: showForm ? '#94a3b8' : 'linear-gradient(135deg, #1a9fd4, #0a9e7e)' }}>
                        {showForm ? '✕ Batal' : '+ Tambah Produk'}
                    </button>
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {statsByGame.map(g => (
                        <button key={g.id} onClick={() => setFilterGame(filterGame === String(g.id) ? 'all' : String(g.id))}
                            className={`rounded-xl p-3 border-2 text-left transition-all ${filterGame === String(g.id) ? 'border-cyan-400 bg-cyan-50' : 'border-slate-200 bg-white hover:border-cyan-300'}`}>
                            <p className="text-xs font-semibold text-slate-600 truncate">{g.name}</p>
                            <p className="text-2xl font-bold text-slate-800 mt-1">{g.total}</p>
                            <p className="text-xs text-emerald-600">{g.active} aktif</p>
                        </button>
                    ))}
                </div>

                {/* Form tambah */}
                {showForm && (
                    <form onSubmit={handleSubmit} className="bg-white border-2 border-cyan-200 rounded-2xl p-5 space-y-4">
                        <h2 className="font-bold text-slate-800">Tambah Produk Baru</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Game</label>
                                <select value={data.game_id} onChange={e => setData('game_id', e.target.value)}
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400">
                                    <option value="">Pilih Game</option>
                                    {games.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                                </select>
                                {errors.game_id && <p className="text-red-500 text-xs mt-1">{errors.game_id}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nama Produk</label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)}
                                    placeholder="contoh: 86 Diamonds"
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400" />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Jumlah Diamond</label>
                                <input type="number" value={data.diamond_amount} onChange={e => setData('diamond_amount', e.target.value)}
                                    placeholder="86"
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400" />
                                {errors.diamond_amount && <p className="text-red-500 text-xs mt-1">{errors.diamond_amount}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Harga (Rp)</label>
                                <input type="number" value={data.price} onChange={e => setData('price', e.target.value)}
                                    placeholder="19000"
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400" />
                                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                            </div>
                        </div>
                        <button type="submit" disabled={processing}
                            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition disabled:opacity-50"
                            style={{ background: 'linear-gradient(135deg, #1a9fd4, #0a9e7e)' }}>
                            {processing ? 'Menyimpan...' : 'Simpan Produk'}
                        </button>
                    </form>
                )}

                {/* Search + filter bar */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="🔍 Cari nama produk..."
                        className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                    <select value={filterGame} onChange={e => setFilterGame(e.target.value)}
                        className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white">
                        <option value="all">Semua Game</option>
                        {games.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                </div>

                {/* Tabel produk */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    {filtered.length === 0 ? (
                        <div className="text-center py-16 text-slate-400">
                            <div className="text-4xl mb-3">📦</div>
                            <p className="font-medium">Tidak ada produk ditemukan</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50">
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Produk</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">Diamond</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Harga</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Group by game */}
                                    {games
                                        .filter(g => filtered.some(p => p.game.id === g.id))
                                        .map(g => {
                                            const gProducts = filtered.filter(p => p.game.id === g.id);
                                            return (
                                                <>
                                                    <tr key={`header-${g.id}`} className="bg-slate-50 border-b border-slate-200">
                                                        <td colSpan={5} className="px-4 py-2">
                                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                                🎮 {g.name}
                                                                <span className="ml-2 font-normal text-slate-400">({gProducts.length} produk)</span>
                                                            </span>
                                                        </td>
                                                    </tr>
                                                    {gProducts.map(product => (
                                                        <ProductRow key={product.id} product={product} onDelete={handleDelete} />
                                                    ))}
                                                </>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}