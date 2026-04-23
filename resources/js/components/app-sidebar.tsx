import { Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { ShieldCheck, LayoutDashboard,  Package } from 'lucide-react';
import { BookOpen, FolderGit2, Gamepad2, ClipboardList } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { home } from '@/routes';
import { index as ordersIndex } from '@/routes/orders';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Top Up',
        href: home(),
        icon: Gamepad2,
    },
    {
        title: 'Riwayat Transaksi',
        href: ordersIndex(),
        icon: ClipboardList,
    },
    
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const isAdmin = auth?.user?.role === 'admin';

    const adminNavItems: NavItem[] = isAdmin? [
        { title: 'Admin Dashboard', href: '/admin', icon: LayoutDashboard,},
        { title: 'Kelola Game', href: '/admin/games', icon: Gamepad2,},
        { title: 'Kelola Produk', href: '/admin/products', icon: Package,},
        { title: 'Kelola Order', href: '/admin/orders', icon: ClipboardList,},
    ] : [];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={home()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                {isAdmin && <NavMain items={adminNavItems}/>}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
