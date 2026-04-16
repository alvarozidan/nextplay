import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { home } from "@/routes";
import { show as checkoutShow } from '@/routes/checkout';


interface Product {
    id: number;
    name: string;
    diamond_amount: number;
    price: number;
}

interface Game {
    id: number;
    name: string;
    slug: string;
    image: string | null;
    products: Product[];
}

interface Props {
    game: Game;
}

export default function GameShow({ game }: Props){
    const formatPrice = (price:number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);

    return (
    <AppLayout>
        <Head title={`Top Up ${game.name}`} />

        <div className="p-6">

            <Link href={home()} className="text-muted-foreground hover:text-primary text-sm">
                ← Kembali
            </Link>


            <div className="flex items-center gap-4 my-6">
                {game.image ? (
                    <img src={`/storage/${game.image}`} alt={game.name} className="w-16 h-16 rounded-xl object-cover"/>
                ) : (
                    <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center text-2xl">🎮</div>
                )}
                <div>
                    <h1 className="text-2xl font-semibold">{game.name}</h1>
                    <p className="text-muted-foreground text-sm">Pilih nominal top up</p>
                </div>
            </div>

            {game.products.length === 0 ? (
                <p className="text-muted-foreground">Belum ada paket tersedia</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {game.products.map((product) => (
                        <Link
                            key={product.id}
                            href={checkoutShow(product.id)}
                            className="border rounded-xl p-4 hover:border-primary hover:shadow-md transition-all group"
                        >
                            <div className="text-2xl mb-1">💎</div>
                            <p className="font-semibold text-sm group-hover:text-primary">{product.name}</p>
                            <p className="text-xs text-muted-foreground mb-2">{product.diamond_amount} diamond</p>
                            <p className="text-primary font-bold">{formatPrice(product.price)}</p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    </AppLayout>
);
}