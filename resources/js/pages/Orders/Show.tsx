import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { show as Ordershow } from "@/routes/orders";

interface Order {
    id: number;
    game_user_id: string;
    status: string;
    total_price: number;
    payment_method: string;
    created_at: string;
    items: {
        id: number;
        quantity: number;
        price: number;
        product: { name: string; diamond_amount: number; game: { name: string } };
    }[];
}

const statusColor: Record<string, string> = {
    pending:    'bg-yellow-100 text-yellow-800',
    paid:       'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    completed:  'bg-green-100 text-green-800',
    failed:     'bg-red-100 text-red-800',
};

export default function OrderShow({ order }: { order: Order }) {
    const formatPrice = (price: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);

    return (
        <>
            <Head title={`Order #${order.id}`} />

            <div className="p-6 max-w-lg mx-auto">
                <div className="mb-6">
                    <Link href={Ordershow(order.id)} className="text-muted-foreground hover:text-primary text-sm">
                        ← Riwayat Transaksi
                    </Link>
                </div>

                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-semibold">Order #{order.id}</h1>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor[order.status]}`}>
                        {order.status}
                    </span>
                </div>

                <div className="border rounded-xl divide-y">
                    <div className="p-4">
                        <p className="text-xs text-muted-foreground mb-1">Produk</p>
                        {order.items.map(item => (
                            <div key={item.id}>
                                <p className="font-medium">{item.product.name}</p>
                                <p className="text-sm text-muted-foreground">
                                    {item.product.game.name} · {item.product.diamond_amount} diamonds
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="p-4">
                        <p className="text-xs text-muted-foreground mb-1">ID Akun Game</p>
                        <p className="font-medium">{order.game_user_id}</p>
                    </div>
                    <div className="p-4">
                        <p className="text-xs text-muted-foreground mb-1">Metode Pembayaran</p>
                        <p className="font-medium capitalize">{order.payment_method}</p>
                    </div>
                    <div className="p-4">
                        <p className="text-xs text-muted-foreground mb-1">Tanggal</p>
                        <p className="font-medium">
                            {new Date(order.created_at).toLocaleDateString('id-ID', {
                                day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                        </p>
                    </div>
                    <div className="p-4 flex justify-between items-center">
                        <p className="font-medium">Total</p>
                        <p className="font-bold text-primary text-lg">{formatPrice(order.total_price)}</p>
                    </div>
                </div>
            </div>
        </>
    );
}