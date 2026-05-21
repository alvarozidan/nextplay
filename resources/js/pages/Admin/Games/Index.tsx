import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import PublicLayout from '@/layouts/public-layout';
import { store as adminGamesStore, destroy as adminGamesDestroy, update as adminGamesUpdate } from '@/routes/admin/games';

interface Game {
    id: number;
    name: string;
    slug: string;
    developer: string | null;
    description: string | null;
    image: string | null;
    is_active: boolean;
    products_count: number;
}

export default function AdminGameIndex({ games }: { games: Game[] }) {
    const [showForm, setShowForm]         = useState(false);
    const [uploadingId, setUploadingId]   = useState<number | null>(null);
    const [editingId, setEditingId]       = useState<number | null>(null);

    // Form tambah game baru
    const { data, setData, post, processing, errors, reset } = useForm({
        name:        '',
        slug:        '',
        developer:   '',
        description: '',
        image:       null as File | null,
    });

    // Form edit inline (developer + description saja)
    const editForm = useForm({
        name:        '',
        developer:   '',
        description: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(adminGamesStore.url(), {
            onSuccess: () => { reset(); setShowForm(false); },
        });
    }

    function handleDelete(id: number) {
        if (confirm('Yakin ingin menghapus game ini?')) router.delete(adminGamesDestroy.url(id));
    }

    function handleToggleActive(game: Game) {
        router.put(adminGamesUpdate.url(game.id), {
            name:      game.name,
            is_active: !game.is_active,
        });
    }

    function handleImageUpload(game: Game, file: File) {
        setUploadingId(game.id);
        const form = new FormData();
        form.append('_method', 'PUT');
        form.append('name', game.name);
        form.append('image', file);
        router.post(adminGamesUpdate.url(game.id), form, {
            onFinish: () => setUploadingId(null),
        });
    }

    function startEdit(game: Game) {
        setEditingId(game.id);
        editForm.setData({
            name:        game.name,
            developer:   game.developer ?? '',
            description: game.description ?? '',
        });
    }

    function handleEditSubmit(e: React.FormEvent, gameId: number) {
        e.preventDefault();
        editForm.put(adminGamesUpdate.url(gameId), {
            onSuccess: () => setEditingId(null),
        });
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

                {/* Form tambah game */}
                {showForm && (
                    <form onSubmit={handleSubmit} className="border rounded-xl p-5 space-y-4 bg-muted/30">
                        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                            Data Game Baru
                        </p>

                        {/* Nama + Slug */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nama Game</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => {
                                        setData('name', e.target.value);
                                        setData('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'));
                                    }}
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
                        </div>

                        {/* Developer */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Developer <span className="text-muted-foreground font-normal">(opsional)</span>
                            </label>
                            <input
                                type="text"
                                value={data.developer}
                                onChange={e => setData('developer', e.target.value)}
                                placeholder="contoh: Moonton"
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            {errors.developer && <p className="text-destructive text-xs mt-1">{errors.developer}</p>}
                        </div>

                        {/* Deskripsi */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Deskripsi <span className="text-muted-foreground font-normal">(opsional)</span>
                            </label>
                            <textarea
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                placeholder="Deskripsi singkat game ini..."
                                rows={3}
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                            />
                            {errors.description && <p className="text-destructive text-xs mt-1">{errors.description}</p>}
                        </div>

                        {/* Gambar */}
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

                {/* Daftar game */}
                <div className="border rounded-xl divide-y">
                    {games.length === 0 ? (
                        <p className="p-4 text-muted-foreground text-sm">Belum ada game.</p>
                    ) : (
                        games.map(game => (
                            <div key={game.id} className="p-4 space-y-3">
                                <div className="flex items-center gap-4">

                                    {/* Thumbnail + tombol upload */}
                                    <div className="relative flex-shrink-0 group">
                                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted border border-border">
                                            {game.image ? (
                                                <img
                                                    src={`/storage/${game.image}`}
                                                    alt={game.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-2xl">🎮</div>
                                            )}
                                        </div>
                                        <label
                                            htmlFor={`img-${game.id}`}
                                            className="absolute inset-0 rounded-xl bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                            title="Ganti gambar"
                                        >
                                            {uploadingId === game.id ? (
                                                <span className="text-white text-xs">...</span>
                                            ) : (
                                                <span className="text-white text-xs font-bold">📷</span>
                                            )}
                                        </label>
                                        <input
                                            id={`img-${game.id}`}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={e => {
                                                const file = e.target.files?.[0];
                                                if (file) handleImageUpload(game, file);
                                            }}
                                        />
                                    </div>

                                    {/* Info game */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{game.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {game.slug} · {game.products_count} produk
                                            {game.developer && ` · ${game.developer}`}
                                        </p>
                                        {game.description && (
                                            <p className="text-xs text-muted-foreground/80 mt-0.5 line-clamp-1">
                                                {game.description}
                                            </p>
                                        )}
                                        {!game.image && (
                                            <p className="text-xs text-amber-500 mt-0.5">
                                                ⚠ Belum ada gambar — hover foto untuk upload
                                            </p>
                                        )}
                                    </div>

                                    {/* Aksi */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => editingId === game.id ? setEditingId(null) : startEdit(game)}
                                            className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200 transition"
                                        >
                                            {editingId === game.id ? 'Batal' : 'Edit'}
                                        </button>
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

                                {/* Form edit inline — muncul kalau editingId === game.id */}
                                {editingId === game.id && (
                                    <form
                                        onSubmit={e => handleEditSubmit(e, game.id)}
                                        className="border rounded-lg p-4 space-y-3 bg-muted/20 ml-18"
                                    >
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                            Edit Info Game
                                        </p>
                                        <div>
                                            <label className="block text-xs font-medium mb-1">Nama Game</label>
                                            <input
                                                type="text"
                                                value={editForm.data.name}
                                                onChange={e => editForm.setData('name', e.target.value)}
                                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium mb-1">Developer</label>
                                            <input
                                                type="text"
                                                value={editForm.data.developer}
                                                onChange={e => editForm.setData('developer', e.target.value)}
                                                placeholder="contoh: Moonton"
                                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium mb-1">Deskripsi</label>
                                            <textarea
                                                value={editForm.data.description}
                                                onChange={e => editForm.setData('description', e.target.value)}
                                                rows={3}
                                                placeholder="Deskripsi singkat game ini..."
                                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                type="submit"
                                                disabled={editForm.processing}
                                                className="bg-primary text-primary-foreground px-4 py-1.5 rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
                                            >
                                                {editForm.processing ? 'Menyimpan...' : 'Simpan'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setEditingId(null)}
                                                className="px-4 py-1.5 rounded-lg text-sm border hover:bg-muted transition"
                                            >
                                                Batal
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}