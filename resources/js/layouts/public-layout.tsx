import { type ReactNode } from 'react';
import PublicNavbar from '@/components/public-navbar';
import PublicFooter from '@/components/public-footer';

export default function PublicLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <PublicNavbar />
            <main className="flex-1 mx-auto w-full max-w-7xl px-4 md:px-6 py-8">
                {children}
            </main>
            <PublicFooter />
        </div>
    );
}