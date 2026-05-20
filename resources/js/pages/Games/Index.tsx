import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Search } from 'lucide-react';
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
}

export default function GamesIndex({ games }: Props) {
    const [query, setQuery] = useState('');

    const filtered = games.filter((g) =>
        g.name.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <PublicLayout>
            <Head title="Top Up Game — NextPlay" />

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
                <span className="text-lg">🎮</span>
                <h2 className="text-lg font-semibold uppercase tracking-wide">Semua Game</h2>
            </div>

            {/* Game Grid */}
            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
                    <span className="text-5xl">🔍</span>
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
                                    <div className="flex h-full w-full items-center justify-center text-4xl bg-muted">
                                        🎮
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
        </PublicLayout>
    );
}