import { Head, useForm } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { update as orderUpdate} from "@/routes/admin/orders";

interface Order {
    id: number;
    status: string;
    total_price: number;
    game_user_id: string;
    payment_method: string;
    created_at: string;
    user: { name: string};
    items: { products: { name: string; game: { name: string}}}[];
}

const StatusColor: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
};

function OrderRow({ order }: {order: Order }){
    const { data, setData, put, processing }= useForm({
        status: order.status,
    });

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);

        return (
            <div className="p-4 flex items-center justify-between gap-4">
            <div className="flex-1">
                <p className="font-medium text-sm">{order.user.name}</p>
                <p className="text-xs text-muted-foreground">
                    {order.items[0]?.products?.game?.name} — {order.items[0]?.products?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                    ID Game: {order.game_user_id} · {order.payment_method}
                </p>
            </div>
            <div className="text-right">
                <p className="font-semibold text-sm mb-1">{formatPrice(order.total_price)}</p>
                <select
                    value={data.status}
                    onChange={e => {
                        setData('status', e.target.value);
                        put(orderUpdate.url(order.id));
                    }}
                    disabled={processing}
                    className="text-xs border rounded-lg px-2 py-1"
                >
                    {['pending','paid','processing','completed','failed'].map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </div>
        </div>
        );       
}

export default function AdminOrdersIndex({ orders }: { orders: Order[] }) {
    return (
        <AppLayout>
            <Head title="Kelola Order" />
            <div className="p-6">
                <h1 className="text-2xl font-semibold mb-6">Kelola Order</h1>
                <div className="border rounded-xl divide-y">
                    {orders.map(order => <OrderRow key={order.id} order={order} />)}
                </div>
            </div>
        </AppLayout>
    );
}