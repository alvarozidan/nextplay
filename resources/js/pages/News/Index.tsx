import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';

const news = [
    {
        id: 1,
        tag: 'Mobile Legends',
        tagColor: 'bg-blue-100 text-blue-700',
        title: 'Update Patch Terbaru Mobile Legends: Hero Baru dan Penyesuaian Balance',
        excerpt: 'Moonton merilis patch terbaru yang membawa hero baru bernama Arlott, seorang ksatria naga dengan kemampuan burst damage tinggi. Selain itu, beberapa hero seperti Fanny dan Chou mendapat penyesuaian skill untuk menjaga keseimbangan gameplay.',
        date: '20 Mei 2026',
        readTime: '3 menit',
        image: null,
    },
    {
        id: 2,
        tag: 'Free Fire',
        tagColor: 'bg-orange-100 text-orange-700',
        title: 'Free Fire OB44 Hadir dengan Mode Battle Royale Baru dan Karakter Eksklusif',
        excerpt: 'Garena mengumumkan update OB44 yang membawa perombakan besar pada map Bermuda. Mode baru "Lone Wolf" memungkinkan pemain bermain solo dengan mekanisme unik. Karakter baru juga hadir dengan skill aktif yang bisa mengubah jalannya pertandingan.',
        date: '18 Mei 2026',
        readTime: '4 menit',
        image: null,
    },
    {
        id: 3,
        tag: 'Genshin Impact',
        tagColor: 'bg-purple-100 text-purple-700',
        title: 'Genshin Impact Version 5.6: Wilayah Baru Natlan Diperluas dengan Quest Epik',
        excerpt: 'HoYoverse kembali menghadirkan konten besar di versi 5.6. Wilayah Natlan mendapat perluasan area dengan dungeon baru dan event musiman yang memberikan primogem gratis hingga 1600. Dua karakter baru dari elemen Pyro juga siap hadir di banner berikutnya.',
        date: '15 Mei 2026',
        readTime: '5 menit',
        image: null,
    },
    {
        id: 4,
        tag: 'PUBG Mobile',
        tagColor: 'bg-yellow-100 text-yellow-700',
        title: 'PUBG Mobile Season Baru Bawa Map Eksklusif dan Sistem Ranked yang Diperbarui',
        excerpt: 'Season terbaru PUBG Mobile hadir dengan map baru bertema gurun arktik. Sistem ranked diperbarui dengan tier baru di atas Conqueror. Berbagai reward menarik tersedia untuk pemain yang berhasil mencapai tier tertinggi sebelum season berakhir.',
        date: '12 Mei 2026',
        readTime: '3 menit',
        image: null,
    },
    {
        id: 5,
        tag: 'Honkai: Star Rail',
        tagColor: 'bg-pink-100 text-pink-700',
        title: 'Honkai: Star Rail 3.3 Hadirkan Planet Baru dan Mekanisme Combat Terbaru',
        excerpt: 'Update 3.3 membawa pemain ke planet baru dengan lore yang sangat dalam. Sistem combat mendapat tambahan mechanic baru bernama "Resonance Chain" yang memungkinkan kombinasi ultimate antar karakter. Event poin memberikan light cone 5-bintang gratis.',
        date: '10 Mei 2026',
        readTime: '4 menit',
        image: null,
    },
    {
        id: 6,
        tag: 'Valorant',
        tagColor: 'bg-red-100 text-red-700',
        title: 'Valorant Mobile Resmi Diumumkan, Closed Beta Segera Dibuka di Asia Tenggara',
        excerpt: 'Riot Games akhirnya mengumumkan secara resmi Valorant Mobile untuk perangkat iOS dan Android. Closed beta pertama akan dibuka di kawasan Asia Tenggara termasuk Indonesia. Pendaftaran sudah bisa dilakukan melalui situs resmi Riot Games.',
        date: '8 Mei 2026',
        readTime: '3 menit',
        image: null,
    },
];

const featured = news[0];
const rest = news.slice(1);

export default function NewsIndex() {
    return (
        <PublicLayout>
            <Head title="Berita Game — NextPlay" />

            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-1">Berita Game</h1>
                <p className="text-muted-foreground text-sm">Update terbaru seputar dunia gaming</p>
            </div>

            {/* Featured Article */}
            <div className="mb-10 rounded-2xl border border-border overflow-hidden hover:border-primary hover:shadow-lg transition-all group cursor-pointer">
                <div className="aspect-[16/6] w-full bg-gradient-to-br from-slate-800 to-slate-600 flex items-center justify-center">
                    <span className="text-6xl">🎮</span>
                </div>
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${featured.tagColor}`}>
                            {featured.tag}
                        </span>
                        <span className="text-xs text-muted-foreground">{featured.date} · {featured.readTime} baca</span>
                    </div>
                    <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {featured.title}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {featured.excerpt}
                    </p>
                </div>
            </div>

            {/* Article Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((article) => (
                    <div
                        key={article.id}
                        className="rounded-xl border border-border overflow-hidden hover:border-primary hover:shadow-md transition-all group cursor-pointer"
                    >
                        <div className="aspect-video w-full bg-gradient-to-br from-slate-700 to-slate-500 flex items-center justify-center">
                            <span className="text-4xl">🎮</span>
                        </div>
                        <div className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${article.tagColor}`}>
                                    {article.tag}
                                </span>
                                <span className="text-xs text-muted-foreground">{article.date}</span>
                            </div>
                            <h3 className="text-sm font-bold leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                {article.title}
                            </h3>
                            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                                {article.excerpt}
                            </p>
                            <p className="text-xs text-muted-foreground mt-3">{article.readTime} baca</p>
                        </div>
                    </div>
                ))}
            </div>
        </PublicLayout>
    );
}