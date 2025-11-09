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

// This is sample data.
const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Master Data",
            url: "#",
            icon: Command,
            items: [
                {
                    icon: User,
                    title: "Users",
                    url: route('admin.users.index'),
                },
                {
                    icon: Shield,
                    title: "Roles",
                    url: route('admin.roles.index'),
                },
                {
                    icon: Key,
                    title: "Permissions",
                    url: route('admin.permissions.index'),
                },
            ],
        },
        {
            title: "Konten",
            url: "#",
            icon: FileText,
            items: [
                {
                    icon: Folder,
                    title: "Kategori",
                    url: route('admin.kategoris.index'),
                },
                {
                    icon: Tag,
                    title: "Tags",
                    url: route('admin.tags.index'),
                },
                {
                    icon: Folder,
                    title: "Produk",
                    url: route('admin.produks.index'),
                },
                {
                    icon: Newspaper,
                    title: "Artikel",
                    url: route('admin.artikel.index'),
                },
                {
                    icon: Play,
                    title: "Galeri",
                    url: route('admin.galeris.index'),
                },
            ],
        },
        {
            title: "Profil",
            url: "#",
            icon: Info,
            items: [
                {
                    icon: Folder,
                    title: "Bidang",
                    url: route('admin.bidangs.index'),
                },
                {
                    icon: GraduationCap,
                    title: "Posisi",
                    url: route('admin.posisis.index'),
                },
                {
                    icon: Users,
                    title: "Pengurus",
                    url: route('admin.pengurus.index'),
                },
            ],
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" className="bg-blue-600 text-white" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="bg-white hover:bg-white active:bg-white">
                            <a href={route('dashboard')} className="px-8">
                                {/* from public */}
                                <img src="/asset/logo-panjang.png" alt="Logo Robotika" />
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar >
    )
}