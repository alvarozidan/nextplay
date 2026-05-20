import { Link } from '@inertiajs/react';

export default function PublicFooter() {
    return (
        <footer className="mt-16 border-t border-border bg-slate-800 text-slate-100">
            <div className="mx-auto max-w-7xl px-4 md:px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <p className="text-xl font-bold text-white mb-3">🎮 NextPlay</p>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Platform top up game terpercaya dan terjangkau untuk semua gamer Indonesia.
                        </p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-cyan-400 mb-4 uppercase tracking-wide">
                            Peta Situs
                        </p>
                        <ul className="space-y-2 text-sm text-slate-300">
                            <li><Link href="/" className="hover:text-white transition-colors">Beranda</Link></li>
                            <li><Link href="/login" className="hover:text-white transition-colors">Masuk</Link></li>
                            <li><Link href="/register" className="hover:text-white transition-colors">Daftar</Link></li>
                            <li><Link href="/orders" className="hover:text-white transition-colors">Cek Transaksi</Link></li>
                            <li><Link href="/news" className="hover:text-white transition-colors">Berita Game</Link></li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-cyan-400 mb-4 uppercase tracking-wide">
                            Legalitas
                        </p>
                        <ul className="space-y-2 text-sm text-slate-300">
                            <li><a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-10 border-t border-slate-700 pt-6 text-center text-xs text-slate-500">
                    © {new Date().getFullYear()} NextPlay. All rights reserved.
                </div>
            </div>
        </footer>
    );
}