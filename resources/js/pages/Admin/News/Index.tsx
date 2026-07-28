import { Head, Link, router, useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import PublicLayout from '@/layouts/public-layout';
import { X, Newspaper } from 'lucide-react';

interface NewsItem {
    id: number;
    title: string;
    tag: string;
    excerpt: string;
    content: string | null;
    image: string | null;
    read_time: number;
    is_published: boolean;
    date: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedNews {
    data: NewsItem[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    total: number;
}

interface Props {
    news: PaginatedNews;
    games: string[];
}

// Komponen kecil untuk preview gambar sebelum diupload,
// bisa diklik untuk melihat ukuran penuh (lightbox) lalu ditutup lagi.
function ImagePreview({ file, existingUrl }: { file: File | null; existingUrl?: string | null }) {
    const [preview, setPreview]   = useState<string | null>(null);
    const [showFull, setShowFull] = useState(false);

    useEffect(() => {
        if (!file) {
            setPreview(null);
            return;
        }
        const url = URL.createObjectURL(file);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    // Kalau gambar berubah, pastikan lightbox lama tertutup
    useEffect(() => {
        setShowFull(false);
    }, [preview, existingUrl]);

    // Tutup lightbox dengan tombol Escape
    useEffect(() => {
        if (!showFull) return;
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setShowFull(false);
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [showFull]);

    const src = preview ?? (existingUrl ? `/storage/${existingUrl}` : null);

    if (!src) return null;

    return (
        <>
            <div className="mt-2 flex items-center gap-3">
                <button
                    type="button"
                    onClick={() => setShowFull(true)}
                    className="group relative w-24 h-24 rounded-lg overflow-hidden border border-border cursor-zoom-in"
                    title="Klik untuk lihat ukuran penuh"
                >
                    <img
                        src={src}
                        alt="Preview gambar berita"
                        className="w-full h-full object-cover"
                    />
                    <span className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-medium transition">
                            Lihat
                        </span>
                    </span>
                </button>
                <span className="text-xs text-muted-foreground">
                    {preview ? 'Preview gambar baru' : 'Gambar saat ini'}
                </span>
            </div>

            {/* Lightbox fullscreen */}
            {showFull && (
                <div
                    className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6"
                    onClick={() => setShowFull(false)}
                >
                    <button
                        type="button"
                        onClick={() => setShowFull(false)}
                        className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
                        aria-label="Tutup"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <img
                        src={src}
                        alt="Preview gambar berita (ukuran penuh)"
                        onClick={e => e.stopPropagation()}
                        className="max-w-full max-h-full object-contain rounded-lg"
                    />
                </div>
            )}
        </>
    );
}

function Pagination({ links }: { links: PaginationLink[] }) {
    if (links.length <= 3) return null;

    return (
        <div className="flex flex-wrap items-center gap-1 pt-2">
            {links.map((link, i) => (
                <button
                    key={i}
                    disabled={!link.url}
                    onClick={() => link.url && router.get(link.url, {}, { preserveScroll: true })}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                        link.active
                            ? 'bg-primary text-primary-foreground border-primary'
                            : link.url
                            ? 'hover:bg-muted border-border'
                            : 'opacity-40 cursor-not-allowed border-border'
                    }`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </div>
    );
}

export default function AdminNewsIndex({ news, games }: Props) {
    const [showForm, setShowForm]   = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const editFileInputRef = useRef<HTMLInputElement>(null);

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
        image:        null as File | null,
    });

    const [editingItem, setEditingItem] = useState<NewsItem | null>(null);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/admin/news', {
            forceFormData: true,
            onSuccess: () => { reset(); setShowForm(false); },
        });
    }

    function startEdit(item: NewsItem) {
        setEditingId(item.id);
        setEditingItem(item);
        editForm.setData({
            title:        item.title,
            tag:          item.tag,
            excerpt:      item.excerpt,
            content:      item.content ?? '',
            read_time:    item.read_time,
            is_published: item.is_published,
            image:        null,
        });
    }

    function cancelEdit() {
        setEditingId(null);
        setEditingItem(null);
        editForm.reset();
        editForm.clearErrors();
    }

    function handleEditSubmit(e: React.FormEvent, id: number) {
        e.preventDefault();
        editForm.transform((d) => ({ ...d, _method: 'put' }));
        editForm.post(`/admin/news/${id}`, {
            forceFormData: true,
            onSuccess: () => cancelEdit(),
        });
    }

    function handleDelete(id: number) {
        if (confirm('Yakin ingin menghapus berita ini?')) {
            router.delete(`/admin/news/${id}`, { preserveScroll: true });
        }
    }

    function handleTogglePublish(item: NewsItem) {
        router.put(`/admin/news/${item.id}`, {
            title:        item.title,
            tag:          item.tag,
            excerpt:      item.excerpt,
            read_time:    item.read_time,
            is_published: !item.is_published,
        }, { preserveScroll: true });
    }

    return (
        <PublicLayout>
            <Head title="Kelola Berita" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Kelola Berita</h1>
                        <p className="text-sm text-muted-foreground">{news.total} berita total</p>
                    </div>
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
                                    list="tag-options"
                                    value={data.tag}
                                    onChange={e => setData('tag', e.target.value)}
                                    placeholder="contoh: Mobile Legends"
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <datalist id="tag-options">
                                    {games.map(g => <option key={g} value={g} />)}
                                    <option value="Umum" />
                                </datalist>
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
                            <label className="block text-sm font-medium mb-1">
                                Ringkasan <span className="text-muted-foreground font-normal">({data.excerpt.length}/500)</span>
                            </label>
                            <textarea
                                value={data.excerpt}
                                onChange={e => setData('excerpt', e.target.value)}
                                placeholder="Ringkasan singkat berita (max 500 karakter)..."
                                rows={3}
                                maxLength={500}
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
                            {errors.image && <p className="text-destructive text-xs mt-1">{errors.image}</p>}
                            <ImagePreview file={data.image} />
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
                    {news.data.length === 0 ? (
                        <p className="p-4 text-muted-foreground text-sm">Belum ada berita.</p>
                    ) : (
                        news.data.map(item => (
                            <div key={item.id} className="p-4 space-y-3">
                                <div className="flex items-start gap-4">

                                    {/* Thumbnail */}
                                    <Link
                                        href={`/news/${item.id}`}
                                        className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-muted border border-border"
                                    >
                                        {item.image ? (
                                            <img
                                                src={`/storage/${item.image}`}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                <Newspaper className="w-6 h-6" />
                                            </div>
                                        )}
                                    </Link>

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
                                            onClick={() => editingId === item.id ? cancelEdit() : startEdit(item)}
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
                                            {editForm.errors.title && <p className="text-destructive text-xs mt-1">{editForm.errors.title}</p>}
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-medium mb-1">Tag / Game</label>
                                                <input
                                                    type="text"
                                                    list="tag-options"
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
                                            <label className="block text-xs font-medium mb-1">
                                                Ringkasan <span className="text-muted-foreground font-normal">({editForm.data.excerpt.length}/500)</span>
                                            </label>
                                            <textarea
                                                value={editForm.data.excerpt}
                                                onChange={e => editForm.setData('excerpt', e.target.value)}
                                                rows={3}
                                                maxLength={500}
                                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                            />
                                            {editForm.errors.excerpt && <p className="text-destructive text-xs mt-1">{editForm.errors.excerpt}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium mb-1">
                                                Isi Artikel <span className="text-muted-foreground font-normal">(opsional)</span>
                                            </label>
                                            <textarea
                                                value={editForm.data.content}
                                                onChange={e => editForm.setData('content', e.target.value)}
                                                rows={5}
                                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium mb-1">
                                                Ganti Gambar <span className="text-muted-foreground font-normal">(opsional)</span>
                                            </label>
                                            <input
                                                ref={editFileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={e => editForm.setData('image', e.target.files?.[0] ?? null)}
                                                className="w-full border rounded-lg px-3 py-2 text-sm"
                                            />
                                            {editForm.errors.image && <p className="text-destructive text-xs mt-1">{editForm.errors.image}</p>}
                                            <ImagePreview file={editForm.data.image} existingUrl={editingItem?.image} />
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
                                                onClick={cancelEdit}
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

                <Pagination links={news.links} />
            </div>
        </PublicLayout>
    );
}