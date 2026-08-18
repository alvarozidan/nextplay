import { Link } from '@inertiajs/react';
import { Instagram, MessageCircle, Music2, Landmark, Smartphone, QrCode, Store } from 'lucide-react';

const PAYMENT_LOGOS: { label: string; icon: typeof Landmark; color: string }[] = [
    { label: 'Transfer Bank', icon: Landmark, color: '#1a9fd4' },
    { label: 'E-Wallet', icon: Smartphone, color: '#0a9e7e' },
    { label: 'QRIS', icon: QrCode, color: '#e2231a' },
    { label: 'Minimarket', icon: Store, color: '#f59e0b' },
];

export default function PublicFooter() {
    return (
        <footer
            className="relative mt-16 text-slate-100"
            style={{ backgroundColor: '#123f6e' }}
        >
            {/* WAVE DIVIDER */}
            <div className="absolute top-0 left-0 w-full -translate-y-[calc(100%-1px)] leading-[0] pointer-events-none">
                <svg
                    className="w-full h-20 md:h-28"
                    viewBox="0 0 1440 140"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M0,70 C360,160 720,0 1080,80 C1260,120 1350,100 1440,60 L1440,140 L0,140 Z"
                        fill="#123f6e"
                    />
                </svg>
            </div>

            <div className="relative mx-auto max-w-7xl px-4 md:px-6 pt-12 md:pt-16 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <p className="text-xl font-bold text-white mb-3 flex items-center gap-0">
                           <img
                                src="/Footer.png"
                                alt="NextPlay Logo"
                                className="w-30 h-10"
                            />
                                                        
                        </p>
                        <p className="text-sm text-slate-200/80 leading-relaxed">
                            Platform top up game terpercaya dan terjangkau untuk semua gamer Indonesia.
                        </p>
                        {/* Social icons */}
                        <div className="flex items-center gap-2 mt-4">
                            <a href="#" aria-label="Instagram"
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href="#" aria-label="TikTok"
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                                <Music2 className="w-4 h-4" />
                            </a>
                            <a href="#" aria-label="WhatsApp"
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                                <MessageCircle className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-cyan-300 mb-4 uppercase tracking-wide">
                            Peta Situs
                        </p>
                        <ul className="space-y-2 text-sm text-slate-200/90">
                            <li><Link href="/" className="hover:text-white transition-colors">Beranda</Link></li>
                            <li><Link href="/login" className="hover:text-white transition-colors">Masuk</Link></li>
                            <li><Link href="/register" className="hover:text-white transition-colors">Daftar</Link></li>
                            <li><Link href="/orders" className="hover:text-white transition-colors">Cek Transaksi</Link></li>
                            <li><Link href="/news" className="hover:text-white transition-colors">Berita Game</Link></li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-cyan-300 mb-4 uppercase tracking-wide">
                            Legalitas
                        </p>
                        <ul className="space-y-2 text-sm text-slate-200/90">
                            <li><a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a></li>
                        </ul>
                        <p className="text-sm font-semibold text-cyan-300 mb-3 mt-6 uppercase tracking-wide">
                            Butuh Bantuan?
                        </p>
                        <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm text-slate-200/90 hover:text-white transition-colors">
                            <MessageCircle className="w-4 h-4" />
                            WA: 0812-3456-7890 (09.00–21.00)
                        </a>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-cyan-300 mb-4 uppercase tracking-wide">
                            Metode Pembayaran
                        </p>
                        <div className="grid grid-cols-2 gap-2.5">
                            {PAYMENT_LOGOS.map(({ label, icon: Icon, color }) => (
                                <div
                                    key={label}
                                    className="flex items-center gap-2 rounded-lg bg-white/10 px-2.5 py-2"
                                >
                                    <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
                                    <span className="text-xs text-slate-200/90 truncate">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mt-10 border-t border-white/15 pt-6 text-center text-xs text-slate-200/70">
                    © {new Date().getFullYear()} NextPlay. All rights reserved.
                </div>
            </div>
        </footer>
    );
}