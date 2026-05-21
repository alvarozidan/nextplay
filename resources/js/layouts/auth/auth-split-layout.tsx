import { Link } from '@inertiajs/react';
import { CheckCircle } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

const features = [
    'Top up cepat & otomatis 24/7',
    'Harga kompetitif untuk semua game populer',
    'Notifikasi real-time status transaksi',
];

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex">
            {/* LEFT PANEL */}
            <div
                className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-10 overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, #1a9fd4 0%, #0d7ab5 30%, #0a9e7e 70%, #0bbf8a 100%)',
                }}
            >
                {/* decorative circles */}
                <div
                    className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-20"
                    style={{ background: 'rgba(255,255,255,0.3)' }}
                />
                <div
                    className="absolute bottom-0 right-0 w-72 h-72 rounded-full opacity-10"
                    style={{ background: 'rgba(255,255,255,0.4)' }}
                />
                <div
                    className="absolute top-1/2 -right-16 w-48 h-48 rounded-full opacity-15"
                    style={{ background: 'rgba(255,255,255,0.3)' }}
                />

                {/* Logo */}
                <Link href={home()} className="relative z-10 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                        <AppLogoIcon className="size-6 fill-current text-white" />
                    </div>
                    <span className="text-2xl font-extrabold text-white tracking-tight">
                        NextPlay
                    </span>
                </Link>

                {/* Center Content */}
                <div className="relative z-10">
                    <p className="text-sm font-semibold tracking-widest text-white/70 uppercase mb-3">
                        Selamat Datang Kembali
                    </p>
                    <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
                        Masuk dan lanjutkan<br />
                        top up favoritmu.
                    </h2>
                    <p className="text-white/80 text-sm mb-8 max-w-xs leading-relaxed">
                        Akses riwayat pesanan, cek status transaksi, dan nikmati harga spesial
                        member langsung dari satu dashboard.
                    </p>

                    <ul className="space-y-3">
                        {features.map((f) => (
                            <li key={f} className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
                                <span className="text-white text-sm font-medium">{f}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Footer */}
                <div className="relative z-10 flex items-center justify-between text-xs text-white/60">
                    <span>🔒 Terproteksi enkripsi &amp; OTP</span>
                    <span>Support 24/7</span>
                </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="flex flex-1 flex-col items-center justify-center p-6 sm:p-10 bg-white">
                {/* Mobile logo */}
                <Link href={home()} className="flex items-center gap-2 mb-8 lg:hidden">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl"
                        style={{ background: 'linear-gradient(135deg, #1a9fd4, #0a9e7e)' }}>
                        <AppLogoIcon className="size-5 fill-current text-white" />
                    </div>
                    <span className="text-xl font-extrabold text-gray-800">NextPlay</span>
                </Link>

                <div className="w-full max-w-sm">
                    {/* Back to home */}
                    <Link
                        href={home()}
                        className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 mb-8 transition-colors"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Beranda
                    </Link>

                    {/* Title */}
                    <div className="mb-7">
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">{title}</h1>
                        <p className="text-sm text-gray-500">{description}</p>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}
