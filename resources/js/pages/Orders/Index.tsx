import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { home } from '@/routes';
import { show as orderShow } from '@/routes/orders';

interface Order {
    id: number;
    status: string;
    total_price: number;
    payment_method: string;
    created_at: string;
    items: { product: { name: string; game: { name: string } } }[];
}

interface Props {
    orders: Order[];
}

const statusColor: Record<string, string> = {
    pending:    'bg-yellow-100 text-yellow-800',
    paid:       'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    completed:  'bg-green-100 text-green-800',
    failed:     'bg-red-100 text-red-800',
};

export default function OrdersIndex({ orders }: Props) {
    const formatPrice = (price: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);

    return (
        <>
            <Head title="Riwayat Transaksi" />

            <div className="p-6">
                <h1 className="text-2xl font-semibold mb-6">Riwayat Transaksi</h1>

                {orders.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground">
                        <p className="text-4xl mb-3">📋</p>
                        <p>Belum ada transaksi.</p>
                        <Link href={ home() } className="text-primary text-sm mt-2 inline-block">
                            Mulai top up sekarang
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {orders.map((order) => (
                            <Link
                                key={order.id}
                                href={orderShow(order.id)}
                                className="flex items-center justify-between border rounded-xl p-4 hover:border-primary transition-all"
                            >
                                <div>
                                    <p className="font-medium text-sm">
                                        {order.items[0]?.product?.game?.name} —{' '}
                                        {order.items[0]?.product?.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {new Date(order.created_at).toLocaleDateString('id-ID', {
                                            day: 'numeric', month: 'long', year: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div className="text-right flex flex-col items-end gap-1">
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[order.status]}`}>
                                        {order.status}
                                    </span>
                                    <p className="font-semibold text-sm">{formatPrice(order.total_price)}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}