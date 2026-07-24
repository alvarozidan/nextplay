import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';

interface NewsItem {
    id: number;
    title: string;
    tag: string;
    excerpt: string;
    image: string | null;
    read_time: number;
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
}

interface Props {
    news: PaginatedNews;
}

// Warna badge per tag — fallback ke abu kalau tag tidak terdaftar
const TAG_COLORS: Record<string, string> = {
    'Mobile Legends':  'bg-blue-100 text-blue-700',
    'Free Fire':       'bg-orange-100 text-orange-700',
    'Genshin Impact':  'bg-purple-100 text-purple-700',
    'PUBG Mobile':     'bg-yellow-100 text-yellow-700',
    'Honkai: Star Rail':'bg-pink-100 text-pink-700',
    'Valorant':        'bg-red-100 text-red-700',
};

function tagColor(tag: string): string {
    return TAG_COLORS[tag] ?? 'bg-slate-100 text-slate-700';
}

function Pagination({ links }: { links: PaginationLink[] }) {
    if (links.length <= 3) return null;

    return (
        <div className="flex flex-wrap items-center justify-center gap-1 mt-10">
            {links.map((link, i) => (
                <button
                    key={i}
                    disabled={!link.url}
                    onClick={() => link.url && router.get(link.url, {}, { preserveScroll: true })}
                    className={`text-sm px-3 py-1.5 rounded-lg border transition ${
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

export default function NewsIndex({ news }: Props) {
    if (news.data.length === 0) {
        return (
            <PublicLayout>
                <Head title="Berita Game — NextPlay" />
                <div className="mb-8">
                    <h1 className="text-2xl font-bold mb-1">Berita Game</h1>
                    <p className="text-muted-foreground text-sm">Update terbaru seputar dunia gaming</p>
                </div>
                <p className="text-muted-foreground text-sm">Belum ada berita tersedia.</p>
            </PublicLayout>
        );
    }

    const isFirstPage = news.current_page === 1;
    const featured     = isFirstPage ? news.data[0] : null;
    const rest         = isFirstPage ? news.data.slice(1) : news.data;

    return (
        <PublicLayout>
            <Head title="Berita Game — NextPlay" />

            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-1">Berita Game</h1>
                <p className="text-muted-foreground text-sm">Update terbaru seputar dunia gaming</p>
            </div>

            {/* Featured Article — hanya di halaman pertama */}
            {featured && (
                <Link
                    href={`/news/${featured.id}`}
                    className="block mb-10 rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition"
                >
                    <div className="aspect-[16/6] w-full bg-gradient-to-br from-slate-800 to-slate-600 flex items-center justify-center overflow-hidden">
                        {featured.image ? (
                            <img
                                src={`/storage/${featured.image}`}
                                alt={featured.title}
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <span className="text-6xl">🎮</span>
                        )}
                    </div>
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tagColor(featured.tag)}`}>
                                {featured.tag}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {featured.date} · {featured.read_time} menit baca
                            </span>
                        </div>
                        <h2 className="text-xl font-bold mb-2">
                            {featured.title}
                        </h2>
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                            {featured.excerpt}
                        </p>
                    </div>
                </Link>
            )}

            {/* Article Grid */}
            {rest.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rest.map((article) => (
                        <Link
                            href={`/news/${article.id}`}
                            key={article.id}
                            className="rounded-xl border border-border overflow-hidden hover:border-primary/50 transition"
                        >
                            <div className="aspect-video w-full bg-gradient-to-br from-slate-700 to-slate-500 flex items-center justify-center overflow-hidden">
                                {article.image ? (
                                    <img
                                        src={`/storage/${article.image}`}
                                        alt={article.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-4xl">🎮</span>
                                )}
                            </div>
                            <div className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tagColor(article.tag)}`}>
                                        {article.tag}
                                    </span>
                                    <span className="text-xs text-muted-foreground">{article.date}</span>
                                </div>
                                <h3 className="text-sm font-bold leading-snug mb-2 line-clamp-2">
                                    {article.title}
                                </h3>
                                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                                    {article.excerpt}
                                </p>
                                <p className="text-xs text-muted-foreground mt-3">
                                    {article.read_time} menit baca
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            <Pagination links={news.links} />
        </PublicLayout>
    );
}
