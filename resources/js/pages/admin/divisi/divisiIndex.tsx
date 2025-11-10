import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { Divisi } from '@/types';
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
import DivisiCreate from './divisiCreate';
import DivisiEdit from './divisiEdit';
import DivisiDelete from './divisiDelete';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';

interface Props {
    divisis: {
        data: Divisi[];
        links: any[];
        meta: any;
    };
    filters?: {
        search?: string;
        order_by?: string;
        sort_direction?: 'asc' | 'desc';
    };
}

export default function DivisiIndex({ divisis, filters }: Props) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedDivisi, setSelectedDivisi] = useState<Divisi | null>(null);
    const [search, setSearch] = useState(filters?.search || '');
    const [sortBy, setSortBy] = useState(filters?.order_by || '');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(filters?.sort_direction || 'asc');

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            router.get('/admin/divisis', {
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
        router.get('/admin/divisis', {
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

    const handleEdit = (divisi: Divisi) => {
        setSelectedDivisi(divisi);
        setIsEditOpen(true);
    };

    const handleDelete = (divisi: Divisi) => {
        setSelectedDivisi(divisi);
        setIsDeleteOpen(true);
    };

    return (
        <AppLayout>
            <Head title="Manajemen Divisi" />

            <Card>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Manajemen Divisi</h1>

                        <Button onClick={() => setIsCreateOpen(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Divisi
                        </Button>
                    </div>

                    <div className="mb-6">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Cari divisi berdasarkan nama atau deskripsi..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="max-w-sm"
                            />
                            {search && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSearch('')}
                                    title="Hapus pencarian"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        <Button variant="ghost" className="h-auto p-0 font-semibold" onClick={() => handleSortChange('id')}>
                                            ID {getSortIcon('id')}
                                        </Button>
                                    </TableHead>
                                    <TableHead>Gambar</TableHead>
                                    <TableHead>
                                        <Button variant="ghost" className="h-auto p-0 font-semibold" onClick={() => handleSortChange('nama')}>
                                            Nama {getSortIcon('nama')}
                                        </Button>
                                    </TableHead>
                                    <TableHead>Deskripsi</TableHead>
                                    <TableHead>
                                        <Button variant="ghost" className="h-auto p-0 font-semibold" onClick={() => handleSortChange('created_at')}>
                                            Dibuat {getSortIcon('created_at')}
                                        </Button>
                                    </TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {divisis.data.map((divisi) => (
                                    <TableRow key={divisi.id}>
                                        <TableCell>{divisi.id}</TableCell>
                                        <TableCell>
                                            {divisi.image ? (
                                                <img src={`/storage/${divisi.image}`} alt={divisi.nama} className="h-10 w-10 rounded object-cover border" />
                                            ) : (
                                                <div className="h-10 w-10 rounded border flex items-center justify-center text-gray-400">
                                                    <ImageIcon className="h-5 w-5" />
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">{divisi.nama}</TableCell>
                                        <TableCell>
                                            {divisi.deskripsi ? (
                                                <span className="text-sm text-gray-600 line-clamp-2">{divisi.deskripsi}</span>
                                            ) : (
                                                <span className="text-gray-400 italic">Tidak ada deskripsi</span>
                                            )}
                                        </TableCell>
                                        <TableCell>{new Date(divisi.created_at).toLocaleDateString('id-ID')}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="outline" size="sm" onClick={() => handleEdit(divisi)}>
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button variant="outline" size="sm" onClick={() => handleDelete(divisi)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {divisis.meta && divisis.meta.last_page > 1 && (
                        <div className="flex justify-center mt-6">
                            <div className="flex gap-2">
                                {divisis.links.map((link, index) => (
                                    <button
                                        key={index}
                                        className={`px-3 py-2 text-sm rounded ${link.active
                                            ? 'bg-blue-600 text-white'
                                            : link.url
                                                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            }`}
                                        onClick={() => link.url && (window.location.href = link.url)}
                                        disabled={!link.url}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <DivisiCreate isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
                    {selectedDivisi && (
                        <DivisiEdit
                            isOpen={isEditOpen}
                            onClose={() => { setIsEditOpen(false); setSelectedDivisi(null); }}
                            divisiId={selectedDivisi.id}
                        />
                    )}
                    {selectedDivisi && (
                        <DivisiDelete
                            isOpen={isDeleteOpen}
                            onClose={() => { setIsDeleteOpen(false); setSelectedDivisi(null); }}
                            divisiId={selectedDivisi.id}
                        />
                    )}
                </div>
            </Card>
        </AppLayout>
    );
}
