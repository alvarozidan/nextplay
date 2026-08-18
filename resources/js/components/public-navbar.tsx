import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Menu, X, Gamepad2, ShoppingBag, LogIn,
    Newspaper, ShieldCheck, ChevronDown, Search,
    LayoutDashboard, Package, ClipboardList, Trophy, FileBarChart, House
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';

const adminLinks = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/games', label: 'Kelola Game', icon: Gamepad2 },
    { href: '/admin/products', label: 'Kelola Produk', icon: Package },
    { href: '/admin/orders', label: 'Kelola Order', icon: ClipboardList },
    { href: '/admin/news', label: 'Kelola Berita', icon: Newspaper },
    { href: '/admin/reports', label: 'Laporan', icon: FileBarChart },
];

const navLinks = [
    { href: '/', label: 'Beranda', icon: House },
    { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { href: '/orders', label: 'Riwayat Transaksi', icon: ShoppingBag },
    { href: '/news', label: 'Berita Game', icon: Newspaper },
];

export default function PublicNavbar() {
    const page = usePage();
    const { auth } = page.props as any;
    const getInitials = useInitials();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileAdminOpen, setMobileAdminOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    const isAdmin = auth?.user?.role === 'admin';

    function handleSearchSubmit(e: React.FormEvent) {
        e.preventDefault();
        router.get('/', searchValue.trim() ? { search: searchValue.trim() } : {});
        setMobileOpen(false);
    }

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 md:px-6">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary shrink-0">
                    <img
                        src="/logo.png"
                        alt="NextPlay Logo"
                        className="h-15 w-15"
                    />
                    
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-1 text-sm font-medium flex-1">
                    {navLinks.map(({ href, label, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-foreground/80 hover:text-primary hover:bg-accent transition-colors"
                        >
                            {Icon && <Icon className="h-4 w-4" />}
                            {label}
                        </Link>
                    ))}

                    {/* Admin Dropdown — hanya muncul kalau admin */}
                    {isAdmin && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors">
                                    <ShieldCheck className="h-4 w-4" />
                                    Admin
                                    <ChevronDown className="h-3 w-3 opacity-60" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-48">
                                <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                                    Panel Admin
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {adminLinks.map(({ href, label, icon: Icon }) => (
                                    <DropdownMenuItem key={href} asChild>
                                        <Link
                                            href={href}
                                            className="flex items-center gap-2 cursor-pointer"
                                        >
                                            <Icon className="h-4 w-4 text-muted-foreground" />
                                            {label}
                                        </Link>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>

                {/* Search Box — Desktop */}
                <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center flex-1 max-w-xs">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder="Cari game..."
                            className="w-full rounded-lg border border-border bg-muted/40 pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50 focus:bg-background transition-all"
                        />
                    </div>
                </form>

                {/* Right Side — Avatar / Login */}
                <div className="ml-auto flex items-center gap-3">
                    {auth?.user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2 rounded-full p-1 hover:bg-accent transition-colors">
                                    <Avatar className="size-8 overflow-hidden rounded-full">
                                        <AvatarImage src={auth.user?.avatar} alt={auth.user?.name} />
                                        <AvatarFallback className="rounded-full bg-primary text-primary-foreground text-xs">
                                            {getInitials(auth.user?.name ?? '')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="hidden md:block text-sm font-medium pr-1">
                                        {auth.user?.name}
                                    </span>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                {auth.user && <UserMenuContent user={auth.user} />}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link
                            href="/login"
                            className="flex items-center gap-2 rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                            <LogIn className="h-4 w-4" />
                            Login
                        </Link>
                    )}

                    {/* Mobile hamburger */}
                    <button
                        className="md:hidden p-2 rounded-md hover:bg-accent transition-colors"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden border-t border-border px-4 py-4 space-y-1 bg-background">
                    {/* Search Box — Mobile */}
                    <form onSubmit={handleSearchSubmit} className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder="Cari game..."
                            className="w-full rounded-lg border border-border bg-muted/40 pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50 focus:bg-background transition-all"
                        />
                    </form>

                    {navLinks.map(({ href, label, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:text-primary hover:bg-accent transition-colors"
                            onClick={() => setMobileOpen(false)}
                        >
                            {Icon && <Icon className="h-4 w-4" />}
                            {label}
                        </Link>
                    ))}

                    {/* Admin section di mobile */}
                    {isAdmin && (
                        <>
                            <div className="pt-2">
                                <button
                                    onClick={() => setMobileAdminOpen(!mobileAdminOpen)}
                                    className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors"
                                >
                                    <span className="flex items-center gap-2">
                                        <ShieldCheck className="h-4 w-4" />
                                        Admin
                                    </span>
                                    <ChevronDown className={`h-3 w-3 transition-transform ${mobileAdminOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {mobileAdminOpen && (
                                    <div className="mt-1 ml-4 space-y-1">
                                        {adminLinks.map(({ href, label, icon: Icon }) => (
                                            <Link
                                                key={href}
                                                href={href}
                                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-foreground/70 hover:text-primary hover:bg-accent transition-colors"
                                                onClick={() => setMobileOpen(false)}
                                            >
                                                <Icon className="h-4 w-4" />
                                                {label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {!auth?.user && (
                        <Link
                            href="/login"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-primary"
                            onClick={() => setMobileOpen(false)}
                        >
                            <LogIn className="h-4 w-4" />
                            Login
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
}