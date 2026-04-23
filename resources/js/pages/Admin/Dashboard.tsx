import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { index as adminGames} from '@/routes/admin/games';
import { index as adminOrders} from '@/routes/admin/orders';
import { index as adminProducts} from '@/routes/admin/products';

interface Stats {
    total_games: number;
    total_orders: number;
    total_revenue: number;
    total_users: number;
}

interface Order {
    id: number;
    status: string;
    total_price: number;
    user: { name: string};
    items: { product: { name: string ; game: { name: string }}}[];
    created_at: string;
}

interface Props {
    stats: Stats;
    recent_orders: Order[];
}

const statusColor: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
};

export default function AdminDashboard({ stats, recent_orders}: Props)
{
    const formatPrice = (price: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);

    return (
         <>
            <Head title="Admin Dashboard" />

            <div className="p-6 space-y-6">
                <h1 className="text-2xl font-semibold">Dashboard Admin</h1>

                {/* Stats cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Game', value: stats.total_games },
                        { label: 'Total Order', value: stats.total_orders },
                        { label: 'Total User', value: stats.total_users },
                        { label: 'Total Revenue', value: formatPrice(stats.total_revenue) },
                    ].map((stat) => (
                        <div key={stat.label} className="border rounded-xl p-4">
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                            <p className="text-2xl font-bold mt-1">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Quick links */}
                <div className="flex gap-3">
                    <Link href={adminGames()} className="border rounded-lg px-4 py-2 text-sm hover:border-primary transition-all">
                        Kelola Game
                    </Link>
                    <Link href={adminProducts()} className="border rounded-lg px-4 py-2 text-sm hover:border-primary transition-all">
                        Kelola Produk
                    </Link>
                    <Link href={adminOrders()} className="border rounded-lg px-4 py-2 text-sm hover:border-primary transition-all">
                        Kelola Order
                    </Link>
                </div>

                {/* Recent orders */}
                <div>
                    <h2 className="text-lg font-medium mb-3">Order Terbaru</h2>
                    <div className="border rounded-xl divide-y">
                        {recent_orders.map((order) => (
                            <div key={order.id} className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-sm">{order.user.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {order.items[0]?.product?.game?.name} — {order.items[0]?.product?.name}
                                    </p>
                                </div>
                                <div className="text-right flex flex-col items-end gap-1">
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[order.status]}`}>
                                        {order.status}
                                    </span>
                                    <p className="text-sm font-semibold">{formatPrice(order.total_price)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
