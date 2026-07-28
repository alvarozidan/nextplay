import { Link } from '@inertiajs/react';
import { Gamepad2 } from 'lucide-react';

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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                    </div>
                </div>
                <div className="mt-10 border-t border-white/15 pt-6 text-center text-xs text-slate-200/70">
                    © {new Date().getFullYear()} NextPlay. All rights reserved.
                </div>
            </div>
        </footer>
    );
}