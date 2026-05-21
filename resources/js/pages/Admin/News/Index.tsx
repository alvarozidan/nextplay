import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import PublicLayout from '@/layouts/public-layout';

interface NewsItem {
    id: number;
    title: string;
    tag: string;
    excerpt: string;
    image: string | null;
    read_time: number;
    is_published: boolean;
    date: string;
}

export default function AdminNewsIndex({ news }: { news: NewsItem[] }) {
    const [showForm, setShowForm]   = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        title:        '',
        tag:          '',
        excerpt:      '',
        content:      '',
        read_time:    3,
        is_published: true,
        image:        null as File | null,
    });

    const editForm = useForm({
        title:        '',
        tag:          '',
        excerpt:      '',
        content:      '',
        read_time:    3,
        is_published: true,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/admin/news', {
            onSuccess: () => { reset(); setShowForm(false); },
        });
    }

    function startEdit(item: NewsItem) {
        setEditingId(item.id);
        editForm.setData({
            title:        item.title,
            tag:          item.tag,
            excerpt:      item.excerpt,
            content:      '',
            read_time:    item.read_time,
            is_published: item.is_published,
        });
    }

    function handleEditSubmit(e: React.FormEvent, id: number) {
        e.preventDefault();
        editForm.put(`/admin/news/${id}`, {
            onSuccess: () => setEditingId(null),
        });
    }

    function handleDelete(id: number) {
        if (confirm('Yakin ingin menghapus berita ini?')) {
            router.delete(`/admin/news/${id}`);
        }
    }

    function handleTogglePublish(item: NewsItem) {
        router.put(`/admin/news/${item.id}`, {
            title:        item.title,
            tag:          item.tag,
            excerpt:      item.excerpt,
            read_time:    item.read_time,
            is_published: !item.is_published,
        });
    }

    return (
        <PublicLayout>
            <Head title="Kelola Berita" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Kelola Berita</h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
                    >
                        {showForm ? 'Batal' : '+ Tambah Berita'}
                    </button>
                </div>

                {/* Form tambah berita */}
                {showForm && (
                    <form onSubmit={handleSubmit} className="border rounded-xl p-5 space-y-4 bg-muted/30">
                        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                            Berita Baru
                        </p>

                        <div>
                            <label className="block text-sm font-medium mb-1">Judul</label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                placeholder="Judul berita..."
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            {errors.title && <p className="text-destructive text-xs mt-1">{errors.title}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">Tag / Game</label>
                                <input
                                    type="text"
                                    value={data.tag}
                                    onChange={e => setData('tag', e.target.value)}
                                    placeholder="contoh: Mobile Legends"
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                {errors.tag && <p className="text-destructive text-xs mt-1">{errors.tag}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Estimasi Baca (menit)</label>
                                <input
                                    type="number"
                                    min={1}
                                    max={60}
                                    value={data.read_time}
                                    onChange={e => setData('read_time', Number(e.target.value))}
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Ringkasan</label>
                            <textarea
                                value={data.excerpt}
                                onChange={e => setData('excerpt', e.target.value)}
                                placeholder="Ringkasan singkat berita (max 500 karakter)..."
                                rows={3}
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                            />
                            {errors.excerpt && <p className="text-destructive text-xs mt-1">{errors.excerpt}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Isi Artikel <span className="text-muted-foreground font-normal">(opsional)</span>
                            </label>
                            <textarea
                                value={data.content}
                                onChange={e => setData('content', e.target.value)}
                                placeholder="Isi lengkap artikel..."
                                rows={5}
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Gambar <span className="text-muted-foreground font-normal">(opsional)</span>
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={e => setData('image', e.target.files?.[0] ?? null)}
                                className="w-full border rounded-lg px-3 py-2 text-sm"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_published"
                                checked={data.is_published}
                                onChange={e => setData('is_published', e.target.checked)}
                                className="rounded"
                            />
                            <label htmlFor="is_published" className="text-sm">
                                Langsung publish
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Berita'}
                        </button>
                    </form>
                )}

                {/* Daftar berita */}
                <div className="border rounded-xl divide-y">
                    {news.length === 0 ? (
                        <p className="p-4 text-muted-foreground text-sm">Belum ada berita.</p>
                    ) : (
                        news.map(item => (
                            <div key={item.id} className="p-4 space-y-3">
                                <div className="flex items-start gap-4">

                                    {/* Thumbnail */}
                                    <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-muted border border-border">
                                        {item.image ? (
                                            <img
                                                src={`/storage/${item.image}`}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-2xl">📰</div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                                                {item.tag}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {item.date} · {item.read_time} menit baca
                                            </span>
                                        </div>
                                        <p className="font-medium text-sm leading-snug line-clamp-2">{item.title}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{item.excerpt}</p>
                                    </div>

                                    {/* Aksi */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => editingId === item.id ? setEditingId(null) : startEdit(item)}
                                            className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200 transition"
                                        >
                                            {editingId === item.id ? 'Batal' : 'Edit'}
                                        </button>
                                        <button
                                            onClick={() => handleTogglePublish(item)}
                                            className={`text-xs px-3 py-1 rounded-full font-medium transition ${
                                                item.is_published
                                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            {item.is_published ? 'Published' : 'Draft'}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-800 hover:bg-red-200 transition"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </div>

                                {/* Form edit inline */}
                                {editingId === item.id && (
                                    <form
                                        onSubmit={e => handleEditSubmit(e, item.id)}
                                        className="border rounded-lg p-4 space-y-3 bg-muted/20"
                                    >
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                            Edit Berita
                                        </p>

                                        <div>
                                            <label className="block text-xs font-medium mb-1">Judul</label>
                                            <input
                                                type="text"
                                                value={editForm.data.title}
                                                onChange={e => editForm.setData('title', e.target.value)}
                                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-medium mb-1">Tag / Game</label>
                                                <input
                                                    type="text"
                                                    value={editForm.data.tag}
                                                    onChange={e => editForm.setData('tag', e.target.value)}
                                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium mb-1">Estimasi Baca (menit)</label>
                                                <input
                                                    type="number"
                                                    min={1}
                                                    max={60}
                                                    value={editForm.data.read_time}
                                                    onChange={e => editForm.setData('read_time', Number(e.target.value))}
                                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium mb-1">Ringkasan</label>
                                            <textarea
                                                value={editForm.data.excerpt}
                                                onChange={e => editForm.setData('excerpt', e.target.value)}
                                                rows={3}
                                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                            />
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id={`pub-${item.id}`}
                                                checked={editForm.data.is_published}
                                                onChange={e => editForm.setData('is_published', e.target.checked)}
                                                className="rounded"
                                            />
                                            <label htmlFor={`pub-${item.id}`} className="text-xs">Published</label>
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