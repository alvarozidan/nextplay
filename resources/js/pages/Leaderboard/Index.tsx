import { Head, Link, router } from '@inertiajs/react';
import { JSX } from 'react';
import { Trophy, Medal, Crown, Sparkles } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';

interface LeaderboardEntry {
    rank: number;
    name: string;
    total_spent: number;
    total_transaksi: number;
}

interface Props {
    leaderboard: LeaderboardEntry[];
    period: 'weekly' | 'monthly' | 'all';
}

const PERIOD_TABS: { value: Props['period']; label: string }[] = [
    { value: 'weekly', label: 'Minggu Ini' },
    { value: 'monthly', label: 'Bulan Ini' },
    { value: 'all', label: 'Sepanjang Waktu' },
];

const PODIUM_STYLE: Record<number, { ring: string; bg: string; icon: JSX.Element }> = {
    1: { ring: 'ring-yellow-400', bg: 'from-yellow-400 to-amber-500', icon: <Crown className="w-5 h-5 text-yellow-500" /> },
    2: { ring: 'ring-slate-300', bg: 'from-slate-300 to-slate-400', icon: <Medal className="w-5 h-5 text-slate-400" /> },
    3: { ring: 'ring-amber-600', bg: 'from-amber-500 to-amber-700', icon: <Medal className="w-5 h-5 text-amber-600" /> },
};

function formatPrice(price: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(price);
}

export default function LeaderboardIndex({ leaderboard, period }: Props) {
    const top3 = leaderboard.filter((e) => e.rank <= 3);
    const rest = leaderboard.filter((e) => e.rank > 3);

    const changePeriod = (value: Props['period']) => {
        router.get('/leaderboard', { period: value }, { preserveState: true, preserveScroll: true });
    };

    return (
        <PublicLayout>
            <Head title="Leaderboard Top Up" />

            <div className="space-y-8">
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                        <Trophy className="w-3.5 h-3.5" />
                        Leaderboard Top Up
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-800">Top Spender NextPlay</h1>
                    <p className="text-sm text-slate-500 max-w-md mx-auto">
                        Peringkat pengguna dengan total top up terbanyak. Nama disamarkan demi privasi.
                    </p>
                </div>

                {/* Period tabs */}
                <div className="flex justify-center gap-2">
                    {PERIOD_TABS.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => changePeriod(tab.value)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                period === tab.value
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {leaderboard.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
                        <Sparkles className="w-10 h-10 mx-auto text-slate-300 mb-3" />
                        <p className="text-slate-500 font-medium">Belum ada data top up untuk periode ini.</p>
                    </div>
                ) : (
                    <>
                        {/* Podium top 3 */}
                        {top3.length > 0 && (
                            <div className="grid grid-cols-3 gap-3 items-end max-w-2xl mx-auto">
                                {[top3.find((e) => e.rank === 2), top3.find((e) => e.rank === 1), top3.find((e) => e.rank === 3)].map(
                                    (entry, idx) =>
                                        entry ? (
                                            <div
                                                key={entry.rank}
                                                className={`flex flex-col items-center gap-2 rounded-2xl bg-white border p-4 ${
                                                    entry.rank === 1 ? 'py-6 order-2' : idx === 0 ? 'order-1' : 'order-3'
                                                }`}
                                                style={{ order: entry.rank === 1 ? 2 : entry.rank === 2 ? 1 : 3 }}
                                            >
                                                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${PODIUM_STYLE[entry.rank].bg} flex items-center justify-center text-white font-bold text-lg ring-4 ${PODIUM_STYLE[entry.rank].ring}`}>
                                                    #{entry.rank}
                                                </div>
                                                {PODIUM_STYLE[entry.rank].icon}
                                                <p className="font-semibold text-sm text-slate-800 text-center">{entry.name}</p>
                                                <p className="text-xs font-bold text-primary">{formatPrice(entry.total_spent)}</p>
                                                <p className="text-[11px] text-slate-400">{entry.total_transaksi} transaksi</p>
                                            </div>
                                        ) : (
                                            <div key={idx} />
                                        ),
                                )}
                            </div>
                        )}

                        {/* Rest of the list */}
                        {rest.length > 0 && (
                            <div className="max-w-2xl mx-auto space-y-2">
                                {rest.map((entry) => (
                                    <div
                                        key={entry.rank}
                                        className="flex items-center gap-4 bg-white border border-slate-100 rounded-xl px-4 py-3"
                                    >
                                        <span className="w-8 text-center font-bold text-slate-400 text-sm">#{entry.rank}</span>
                                        <span className="flex-1 font-medium text-sm text-slate-700">{entry.name}</span>
                                        <span className="text-xs text-slate-400">{entry.total_transaksi} transaksi</span>
                                        <span className="font-bold text-sm text-primary">{formatPrice(entry.total_spent)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                <div className="text-center">
                    <Link href="/" className="text-sm text-primary hover:underline font-medium">
                        Yuk top up sekarang &rarr;
                    </Link>
                </div>
            </div>
        </PublicLayout>
    );
}
