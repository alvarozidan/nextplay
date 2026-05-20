import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import PublicLayout from '@/layouts/public-layout';
import { store as adminGamesStore, destroy as adminGamesDestroy, update as adminGamesUpdate } from '@/routes/admin/games';

interface Game {
    id: number;
    name: string;
    slug: string;
    is_active: boolean;
    products_count: number;
}

export default function AdminGameIndex({ games }: { games: Game[] }) {
    const [showForm, setShowForm] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        slug: '',
        image: null as File | null,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(adminGamesStore.url(), { onSuccess: () => { reset(); setShowForm(false); } });
    }

    function handleDelete(id: number) {
        if (confirm('Yakin ingin menghapus game ini?')) router.delete(adminGamesDestroy.url(id));
    }

    function handleToggleActive(game: Game) {
        router.put(adminGamesUpdate.url(game.id), { name: game.name, is_active: !game.is_active });
    }

    return (
        <PublicLayout>
            <Head title="Kelola Game" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Kelola Game</h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
                    >
                        {showForm ? 'Batal' : '+ Tambah Game'}
                    </button>
                </div>

                {showForm && (
                    <form onSubmit={handleSubmit} className="border rounded-xl p-4 space-y-3">
                        <div>
                            <label className="block text-sm font-medium mb-1">Nama Game</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => { setData('name', e.target.value); setData('slug', e.target.value.toLowerCase().replace(/\s+/g, '-')); }}
                                placeholder="contoh: Mobile Legends"
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Slug</label>
                            <input
                                type="text"
                                value={data.slug}
                                onChange={e => setData('slug', e.target.value)}
                                placeholder="contoh: mobile-legends"
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            {errors.slug && <p className="text-destructive text-xs mt-1">{errors.slug}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Gambar Game</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={e => setData('image', e.target.files?.[0] ?? null)}
                                className="w-full border rounded-lg px-3 py-2 text-sm"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Game'}
                        </button>
                    </form>
                )}

                <div className="border rounded-xl divide-y">
                    {games.length === 0 ? (
                        <p className="p-4 text-muted-foreground text-sm">Belum ada game.</p>
                    ) : (
                        games.map(game => (
                            <div key={game.id} className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="font-medium">{game.name}</p>
                                    <p className="text-xs text-muted-foreground">{game.slug} · {game.products_count} produk</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleToggleActive(game)}
                                        className={`text-xs px-3 py-1 rounded-full font-medium transition ${game.is_active ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                    >
                                        {game.is_active ? 'Aktif' : 'Nonaktif'}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(game.id)}
                                        className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-800 hover:bg-red-200 transition"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}