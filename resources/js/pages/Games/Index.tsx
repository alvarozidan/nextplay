import { useState, useEffect, useCallback } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Search, ChevronLeft, ChevronRight, Zap, Shield, ShieldCheck, Globe, Flame, Sparkles, Swords, Gamepad2, type LucideIcon } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';

interface Game {
    id: number;
    name: string;
    slug: string;
    developer: string | null;
    image: string | null;
}

interface Props {
    games: Game[];
    search?: string;
}

// Slide data — ganti src dengan URL banner asli kamu, atau simpan di public/banners/
const SLIDES = [
    {
        id: 1,
        title: 'Mobile Legends',
        subtitle: 'Top Up Diamond ML sekarang, proses 1 menit!',
        badgeIcon: Flame,
        badge: 'Terlaris',
        gradient: 'from-blue-900 via-blue-700 to-cyan-500',
        accent: '#38bdf8',
        icon: Swords,
        slug: 'mobile-legends',
    },
    {
        id: 2,
        title: 'Free Fire',
        subtitle: 'Diamond & Bundle eksklusif tersedia setiap hari',
        badgeIcon: Zap,
        badge: 'Promo',
        gradient: 'from-orange-900 via-orange-700 to-yellow-500',
        accent: '#fbbf24',
        icon: Flame,
        slug: 'free-fire',
    },
    {
        id: 3,
        title: 'Genshin Impact',
        subtitle: 'Genesis Crystal & Primogem — harga terbaik',
        badgeIcon: Sparkles,
        badge: 'Baru',
        gradient: 'from-violet-900 via-purple-700 to-indigo-500',
        accent: '#a78bfa',
        icon: Sparkles,
        slug: 'genshin-impact',
    },
];

const TRUST_BADGES = [
    { icon: <Zap className="w-4 h-4" />, label: 'Proses 1–60 Detik' },
    { icon: <Shield className="w-4 h-4" />, label: 'Transaksi Aman' },
    { icon: <Globe className="w-4 h-4" />, label: 'Indonesia & Global' },
];

const WHY_US: { icon: LucideIcon; title: string; desc: string }[] = [
    { icon: Zap, title: 'Proses Instan', desc: 'Item masuk otomatis ke akun kamu dalam hitungan detik setelah pembayaran berhasil.' },
    { icon: Shield, title: 'Transaksi Aman', desc: 'Sistem pembayaran terenkripsi dan terpercaya, data kamu terlindungi.' },
    { icon: Sparkles, title: 'Harga Bersahabat', desc: 'Harga kompetitif untuk semua nominal, tanpa biaya tersembunyi.' },
    { icon: Globe, title: 'Support Responsif', desc: 'Tim support siap membantu setiap hari lewat WhatsApp maupun live chat.' },
];

function HeroBanner({ games }: { games: Game[] }) {
    const [current, setCurrent] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const goTo = useCallback((idx: number) => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrent(idx);
        setTimeout(() => setIsAnimating(false), 400);
    }, [isAnimating]);

    const prev = () => goTo((current - 1 + SLIDES.length) % SLIDES.length);
    const next = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo]);

    useEffect(() => {
        const timer = setInterval(next, 4500);
        return () => clearInterval(timer);
    }, [next]);

    const slide = SLIDES[current];

    // Cari game yang sesuai slug slide
    const slideGame = games.find(g => g.slug === slide.slug);
    const gameHref = slideGame ? `/games/${slideGame.slug}` : '/';

    return (
        <div className="relative w-full rounded-2xl overflow-hidden mb-8 select-none" style={{ height: '260px' }}>
            {/* Background gradient */}
            <div
                className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} transition-all duration-500`}
            />

            {/* Decorative blobs */}
            <div
                className="absolute -top-10 -right-10 w-64 h-64 rounded-full opacity-20 blur-3xl transition-all duration-500"
                style={{ background: slide.accent }}
            />
            <div
                className="absolute -bottom-10 left-20 w-48 h-48 rounded-full opacity-15 blur-2xl transition-all duration-500"
                style={{ background: slide.accent }}
            />

            {/* Dot pattern overlay */}
            <div
                className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                }}
            />

            {/* Content */}
            <div className="relative z-10 h-full flex items-center px-8 md:px-12">
                <div className="flex-1">
                    <span
                        className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full mb-3"
                        style={{ background: 'rgba(255,255,255,0.2)', color: 'white', backdropFilter: 'blur(8px)' }}
                    >
                        <slide.badgeIcon className="w-3.5 h-3.5" />
                        {slide.badge}
                    </span>

                    <div
                        key={current}
                        className="transition-all duration-400"
                        style={{ animation: 'fadeSlideUp 0.4s ease forwards' }}
                    >
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2 leading-tight">
                            Top Up {slide.title}
                        </h2>
                        <p className="text-white/70 text-sm md:text-base mb-5 max-w-xs">
                            {slide.subtitle}
                        </p>
                    </div>

                    <Link
                        href={gameHref}
                        className="inline-flex items-center gap-2 font-bold text-sm px-5 py-2.5 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                        style={{
                            background: 'white',
                            color: '#0f172a',
                            boxShadow: `0 4px 20px ${slide.accent}60`,
                        }}
                    >
                        Top Up Sekarang
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Big icon */}
                <div
                    key={`icon-${current}`}
                    className="hidden md:flex items-center justify-center opacity-40 flex-shrink-0 mr-8"
                    style={{ animation: 'fadeSlideUp 0.5s ease forwards', filter: 'drop-shadow(0 0 40px rgba(255,255,255,0.3))' }}
                >
                    <slide.icon className="w-32 h-32 lg:w-40 lg:h-40 text-white" />
                </div>
            </div>

            {/* Prev / Next buttons */}
            <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}
            >
                <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}
            >
                <ChevronRight className="w-4 h-4 text-white" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                {SLIDES.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        className="transition-all duration-300 rounded-full"
                        style={{
                            width: i === current ? '24px' : '8px',
                            height: '8px',
                            background: i === current ? 'white' : 'rgba(255,255,255,0.4)',
                        }}
                    />
                ))}
            </div>

            <style>{`
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}

export default function GamesIndex({ games, search }: Props) {
    const [query, setQuery] = useState(search ?? '');

    const filtered = games.filter((g) =>
        g.name.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <PublicLayout>
            <Head title="Top Up Game — NextPlay" />

            {/* Hero Banner */}
            <HeroBanner games={games} />

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
                {TRUST_BADGES.map((b) => (
                    <div
                        key={b.label}
                        className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-50 border border-slate-100 px-4 py-2 rounded-full"
                    >
                        <span className="text-cyan-500">{b.icon}</span>
                        {b.label}
                    </div>
                ))}
            </div>

            {/* Search Bar */}
            <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Cari game / produk..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background pl-12 pr-4 py-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
            </div>

            {/* Section Title */}
            <div className="mb-6 flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-cyan-500" />
                <h2 className="text-lg font-semibold uppercase tracking-wide">Semua Game</h2>
                <span className="ml-auto text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                    {filtered.length} game
                </span>
            </div>

            {/* Game Grid */}
            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
                    <Search className="w-12 h-12" />
                    <p className="text-sm">Game tidak ditemukan</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {filtered.map((game) => (
                        <Link
                            key={game.id}
                            href={`/games/${game.slug}`}
                            className="group flex flex-col overflow-hidden rounded-xl border border-border hover:border-primary hover:shadow-lg transition-all duration-200"
                        >
                            <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
                                {game.image ? (
                                    <img
                                        src={`/storage/${game.image}`}
                                        alt={game.name}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-muted">
                                        <Gamepad2 className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                            <div className="p-3 bg-background">
                                <p className="text-sm font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                                    {game.name}
                                </p>
                                {game.developer && (
                                    <p className="mt-0.5 text-xs text-muted-foreground truncate">
                                        {game.developer}
                                    </p>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Kenapa Pilih Kami */}
            <div className="mt-16">
                <div className="mb-6 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-cyan-500" />
                    <h2 className="text-lg font-semibold uppercase tracking-wide">Kenapa Pilih NextPlay</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {WHY_US.map((item) => (
                        <div
                            key={item.title}
                            className="rounded-2xl border border-border bg-background p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                        >
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                                style={{ background: 'linear-gradient(135deg, #1a9fd4, #0a9e7e)' }}
                            >
                                <item.icon className="w-5 h-5 text-white" />
                            </div>
                            <p className="text-sm font-semibold mb-1">{item.title}</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </PublicLayout>
    );
}