import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { ArrowLeft, Gamepad2 } from 'lucide-react';

interface NewsDetail {
    id: number;
    title: string;
    tag: string;
    excerpt: string;
    content: string | null;
    image: string | null;
    read_time: number;
    date: string;
}

interface NewsItem {
    id: number;
    title: string;
    tag: string;
    excerpt: string;
    image: string | null;
    read_time: number;
    date: string;
}

interface Props {
    news: NewsDetail;
    related: NewsItem[];
}

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

export default function NewsShow({ news, related }: Props) {
    return (
        <PublicLayout>
            <Head title={`${news.title} — NextPlay`} />

            <Link href="/news" className="text-sm text-muted-foreground hover:text-foreground transition mb-4 inline-flex items-center gap-1.5">
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Berita
            </Link>

            <article>
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tagColor(news.tag)}`}>
                            {news.tag}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {news.date} · {news.read_time} menit baca
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold leading-snug mb-3">
                        {news.title}
                    </h1>
                    <p className="text-muted-foreground leading-relaxed">
                        {news.excerpt}
                    </p>
                </div>

                <div className="aspect-video w-full rounded-2xl overflow-hidden border border-border bg-gradient-to-br from-slate-800 to-slate-600 flex items-center justify-center mb-8">
                    {news.image ? (
                        <img
                            src={`/storage/${news.image}`}
                            alt={news.title}
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <Gamepad2 className="w-16 h-16 text-white/40" />
                    )}
                </div>

                {news.content ? (
                    <div className="prose prose-sm sm:prose-base max-w-none whitespace-pre-line leading-relaxed">
                        {news.content}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground italic">Isi lengkap artikel belum tersedia.</p>
                )}
            </article>

            {related.length > 0 && (
                <div className="mt-14">
                    <h2 className="text-lg font-bold mb-4">Berita Terkait</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {related.map(item => (
                            <Link
                                href={`/news/${item.id}`}
                                key={item.id}
                                className="rounded-xl border border-border overflow-hidden hover:border-primary/50 transition"
                            >
                                <div className="aspect-video w-full bg-gradient-to-br from-slate-700 to-slate-500 flex items-center justify-center overflow-hidden">
                                    {item.image ? (
                                        <img
                                            src={`/storage/${item.image}`}
                                            alt={item.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <Gamepad2 className="w-10 h-10 text-white/40" />
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="text-sm font-bold leading-snug mb-1 line-clamp-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs text-muted-foreground">{item.date}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}
