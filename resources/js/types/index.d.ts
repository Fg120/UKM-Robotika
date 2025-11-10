import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    roles?: Role[];
    [key: string]: unknown; // This allows for additional properties...
}

export interface Role {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    permissions?: Permission[];
}

export interface Permission {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
}

export interface Kategori {
    id: number;
    nama: string;
    slug: string;
    deskripsi: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface Tag {
    id: number;
    nama: string;
    slug: string;
    deskripsi: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}
export interface Bidang {
    id: number;
    nama: string;
    deskripsi: string | null;
    image: string | null;
    urutan: number | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface Divisi {
    id: number;
    nama: string;
    deskripsi: string | null;
    image: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface Produk {
    id: number;
    nama: string;
    keterangan: string | null;
    image: string | null;
    url: string;
    aktif: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface Galeri {
    id: number;
    judul: string;
    tanggal: string; // ISO date string
    image: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface PengurusSocial {
    id: number;
    pengurus_id: number;
    platform: string;
    icon: string;
    url: string;
    created_at?: string;
    updated_at?: string;
}

export interface Pengurus {
    id: number;
    nama: string;
    image: string | null;
    posisi_id: number;
    bidang_id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    bidang?: Pick<Bidang, 'id' | 'nama'>;
    posisi?: Pick<Posisi, 'id' | 'nama'>;
    sosmeds?: PengurusSocial[];
}

export interface Posisi {
    id: number;
    nama: string;
    urutan: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface Artikel {
    id: number;
    judul: string;
    slug: string;
    excerpt: string | null;
    konten: string;
    image: string | null;
    kategori_id: number | null;
    user_id: number;
    published: boolean;
    published_at: string | null;
    views: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    user?: Pick<User, 'id' | 'name' | 'email'>;
    kategori?: Pick<Kategori, 'id' | 'nama'>;
    tags?: Pick<Tag, 'id' | 'nama'>[];
}
