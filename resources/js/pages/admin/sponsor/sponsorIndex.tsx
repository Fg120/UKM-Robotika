import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { Sponsor } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Pencil, Trash2, Plus, ArrowUpDown, ArrowUp, ArrowDown, X, Image as ImageIcon } from 'lucide-react';
import SponsorCreate from './sponsorCreate';
import SponsorEdit from './sponsorEdit';
import SponsorDelete from './sponsorDelete';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';

interface Props {
    sponsors: {
        data: Sponsor[];
        links: any[];
        meta: any;
    };
    filters?: {
        search?: string;
        order_by?: string;
        sort_direction?: 'asc' | 'desc';
    };
}

export default function SponsorIndex({ sponsors, filters }: Props) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);
    const [search, setSearch] = useState(filters?.search || '');
    const [sortBy, setSortBy] = useState(filters?.order_by || '');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(filters?.sort_direction || 'asc');

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            router.get('/admin/sponsors', {
                search: search || undefined,
                order_by: sortBy || undefined,
                sort_direction: sortDirection,
                page: 1
            }, { preserveState: true });
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [search, sortBy, sortDirection]);

    const handleSortChange = (column: string) => {
        let newDirection: 'asc' | 'desc' = 'asc';
        if (sortBy === column) {
            newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        }
        setSortBy(column);
        setSortDirection(newDirection);
        router.get('/admin/sponsors', {
            search: search || undefined,
            order_by: column,
            sort_direction: newDirection,
            page: 1
        }, { preserveState: true });
    };

    const getSortIcon = (column: string) => {
        if (sortBy !== column) return <ArrowUpDown className="ml-2 h-4 w-4" />;
        return sortDirection === 'asc'
            ? <ArrowUp className="ml-2 h-4 w-4" />
            : <ArrowDown className="ml-2 h-4 w-4" />;
    };

    const handleEdit = (sponsor: Sponsor) => {
        setSelectedSponsor(sponsor);
        setIsEditOpen(true);
    };

    const handleDelete = (sponsor: Sponsor) => {
        setSelectedSponsor(sponsor);
        setIsDeleteOpen(true);
    };

    return (
        <AppLayout>
            <Head title="Manajemen Sponsor" />

            <Card>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Manajemen Sponsor</h1>

                        <Button onClick={() => setIsCreateOpen(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Sponsor
                        </Button>
                    </div>

                    <div className="mb-6">
                        <Input
                            type="text"
                            placeholder="Cari sponsor..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="max-w-md"
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">No</TableHead>
                                    <TableHead
                                        className="cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSortChange('judul')}
                                    >
                                        <div className="flex items-center">
                                            Judul
                                            {getSortIcon('judul')}
                                        </div>
                                    </TableHead>
                                    <TableHead>Deskripsi</TableHead>
                                    <TableHead>Foto</TableHead>
                                    <TableHead>URL</TableHead>
                                    <TableHead
                                        className="cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSortChange('created_at')}
                                    >
                                        <div className="flex items-center">
                                            Tanggal
                                            {getSortIcon('created_at')}
                                        </div>
                                    </TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sponsors.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                            Belum ada data sponsor
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    sponsors.data.map((sponsor, index) => (
                                        <TableRow key={sponsor.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell className="font-medium">{sponsor.judul}</TableCell>
                                            <TableCell>
                                                <div className="max-w-xs truncate text-sm text-gray-600">
                                                    {sponsor.deskripsi || '-'}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {sponsor.foto ? (
                                                    <img
                                                        src={`/storage/${sponsor.foto}`}
                                                        alt={sponsor.judul}
                                                        className="w-10 h-10 object-cover rounded"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                                                        <ImageIcon className="w-5 h-5 text-gray-400" />
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {sponsor.url ? (
                                                    <a
                                                        href={sponsor.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline truncate block max-w-xs"
                                                    >
                                                        {sponsor.url}
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {new Date(sponsor.created_at).toLocaleDateString('id-ID')}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEdit(sponsor)}
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(sponsor)}
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-600" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {sponsors.data.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            Belum ada data sponsor
                        </div>
                    )}

                    {sponsors.links && sponsors.links.length > 1 && (
                        <div className="flex justify-center gap-1 mt-6">
                            {sponsors.links.map((link, index) => (
                                link.url ? (
                                    <Button
                                        key={index}
                                        variant={link.active ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => router.get(link.url)}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <Button
                                        key={index}
                                        variant="outline"
                                        size="sm"
                                        disabled
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                )
                            ))}
                        </div>
                    )}
                </div>
            </Card>

            <SponsorCreate open={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
            {selectedSponsor && (
                <>
                    <SponsorEdit
                        sponsorId={selectedSponsor.id}
                        open={isEditOpen}
                        onClose={() => {
                            setIsEditOpen(false);
                            setSelectedSponsor(null);
                        }}
                    />
                    <SponsorDelete
                        sponsorId={selectedSponsor.id}
                        open={isDeleteOpen}
                        onClose={() => {
                            setIsDeleteOpen(false);
                            setSelectedSponsor(null);
                        }}
                    />
                </>
            )}
        </AppLayout>
    );
}
