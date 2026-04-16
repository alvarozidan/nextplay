import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import storage from "@/routes/storage";

interface Game {
    id: number;
    name: string;
    slug: string;
    image: string|null;
}

interface Props {
    games: Game[];
}

export default function GamesIndex({ games }: Props){
    return (
        <AppLayout>
            <Head title="Top Up Game" />

            <div className="p-6">
                <h1 className="text-2xl font-semibold mb-2">Pilih Game</h1>
                <p className="text-muted-foreground mb-6">
                    Pilih game yang ingin kamu isi
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {games.map((game) => (
                        <Link
                            key={game.id}
                            href={route('games.show', game.slug)}
                            className="group border rounded-xl p-4 flex flex-col items-center gap-3 hover:border-primary hover:shadow-md transition-all"
                        >
                            {game.image ? (
                                <img 
                                    src={`/storage/${game.image}`}
                                    alt={game.name}
                                    className="w-20 h-20 object-cover rounded-lg"
                                />
                            ) : (
                                <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center text-3xl">
                                    🎮
                                </div>
                            )}
                            <span className="text-sm font-medium text-center group-hover:text-primary">
                                {game.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}