"use client"

import * as React from "react"
import {
    AudioWaveform,
    BookOpen,
    Bot,
    Command,
    Frame,
    GalleryVerticalEnd,
    Map,
    PieChart,
    Settings2,
    SquareTerminal,
    User,
    Shield,
    Key,
    FileText,
    Folder,
    Tag,
    Newspaper,
    Info,
    Play,
    GraduationCap,
    History,
    Cog,
    Users,
    CreditCard,
    BarChart3,
    FolderTree,
    Handshake,
    LayoutDashboard,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import { route } from 'ziggy-js';
import { Link, usePage } from "@inertiajs/react"
import { SharedData } from "@/types"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { auth } = usePage<SharedData>().props;
    const permissions = auth?.permissions || [];

    // Helper function to check if user has permission
    const hasPermission = (permission: string) => {
        return permissions.includes(permission);
    };

    // Helper to check if user has any permission from a list
    const hasAnyPermission = (permissionList: string[]) => {
        return permissionList.some(permission => hasPermission(permission));
    };

    // Build navigation menu based on permissions
    const navMain = [];

    // Dashboard - accessible to all authenticated users
    navMain.push({
        title: "Dashboard",
        url: route('dashboard'),
        icon: LayoutDashboard,
        items: [],
    });

    // Master Data section
    const masterDataItems = [];
    if (hasPermission('view users')) {
        masterDataItems.push({
            icon: User,
            title: "Users",
            url: route('admin.users.index'),
        });
    }
    if (hasPermission('view roles')) {
        masterDataItems.push({
            icon: Shield,
            title: "Roles",
            url: route('admin.roles.index'),
        });
    }
    if (hasPermission('view permissions')) {
        masterDataItems.push({
            icon: Key,
            title: "Permissions",
            url: route('admin.permissions.index'),
        });
    }
    if (masterDataItems.length > 0) {
        navMain.push({
            title: "Master Data",
            url: "#",
            icon: Command,
            items: masterDataItems,
        });
    }

    // Konten section
    const kontenItems = [];
    if (hasPermission('view kategori')) {
        kontenItems.push({
            icon: Folder,
            title: "Kategori",
            url: route('admin.kategoris.index'),
        });
    }
    if (hasPermission('view tag')) {
        kontenItems.push({
            icon: Tag,
            title: "Tags",
            url: route('admin.tags.index'),
        });
    }
    if (hasPermission('view produk')) {
        kontenItems.push({
            icon: Folder,
            title: "Produk",
            url: route('admin.produks.index'),
        });
    }
    if (hasPermission('view artikel')) {
        kontenItems.push({
            icon: Newspaper,
            title: "Artikel",
            url: route('admin.artikel.index'),
        });
    }
    if (hasPermission('view galeri')) {
        kontenItems.push({
            icon: Play,
            title: "Galeri",
            url: route('admin.galeris.index'),
        });
    }
    if (hasPermission('view sponsor')) {
        kontenItems.push({
            icon: Handshake,
            title: "Sponsor",
            url: route('admin.sponsor.index'),
        });
    }
    if (kontenItems.length > 0) {
        navMain.push({
            title: "Konten",
            url: "#",
            icon: FileText,
            items: kontenItems,
        });
    }

    // Profil section
    const profilItems = [];
    if (hasPermission('view bidang')) {
        profilItems.push({
            icon: Folder,
            title: "Bidang",
            url: route('admin.bidangs.index'),
        });
    }
    if (hasPermission('view divisi')) {
        profilItems.push({
            icon: FolderTree,
            title: "Divisi",
            url: route('admin.divisis.index'),
        });
    }
    if (hasPermission('view posisi')) {
        profilItems.push({
            icon: GraduationCap,
            title: "Posisi",
            url: route('admin.posisis.index'),
        });
    }
    if (hasPermission('view pengurus')) {
        profilItems.push({
            icon: Users,
            title: "Pengurus",
            url: route('admin.pengurus.index'),
        });
    }
    if (profilItems.length > 0) {
        navMain.push({
            title: "Profil",
            url: "#",
            icon: Info,
            items: profilItems,
        });
    }

    return (
        <Sidebar collapsible="icon" className="bg-blue-600 text-white" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="bg-white hover:bg-white active:bg-white">
                            <Link href={route('dashboard')} className="px-8">
                                {/* from public */}
                                <img src="/asset/logo-panjang.png" alt="Logo Robotika" />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={auth?.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar >
    )
}