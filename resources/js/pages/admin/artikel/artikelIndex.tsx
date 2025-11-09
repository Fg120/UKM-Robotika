import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Artikel, Kategori, Tag } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Image as ImageIcon, Pencil, Trash2, Plus, Eye, CheckCircle, XCircle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import ArtikelDelete from './artikelDelete';

interface Props {
    artikels: { data: Artikel[]; links: any[]; meta: any };
    kategoris: Pick<Kategori, 'id' | 'nama'>[];
    tags: Pick<Tag, 'id' | 'nama'>[];
    filters?: { search?: string; kategori_id?: string; published?: string };
}

export default function ArtikelIndex({ artikels, kategoris, tags, filters }: Props) {
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedArtikel, setSelectedArtikel] = useState<Artikel | null>(null);
    const [search, setSearch] = useState(filters?.search || '');
    const [kategoriFilter, setKategoriFilter] = useState(filters?.kategori_id || 'all');
    const [publishedFilter, setPublishedFilter] = useState(filters?.published || 'all');

    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            router.get('/admin/artikel', {
                search: search || undefined,
                kategori_id: kategoriFilter !== 'all' ? kategoriFilter : undefined,
                published: publishedFilter !== 'all' ? publishedFilter : undefined,
            }, { preserveState: true });
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [search, kategoriFilter, publishedFilter]);

    return (
        <AppLayout>
            <Head title="Manajemen Artikel" />

            <Card>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Manajemen Artikel</h1>
                        <Button onClick={() => router.visit('/admin/artikel/create')}>
                            <Plus className="w-4 h-4 mr-2" />Tambah Artikel
                        </Button>
                    </div>

                    <div className="flex gap-4 mb-6">
                        <Input
                            placeholder="Cari artikel..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="max-w-sm"
                        />
                        <Select value={kategoriFilter} onValueChange={setKategoriFilter}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Semua Kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Kategori</SelectItem>
                                {kategoris.map(k => (
                                    <SelectItem key={k.id} value={String(k.id)}>{k.nama}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={publishedFilter} onValueChange={setPublishedFilter}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Semua Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Status</SelectItem>
                                <SelectItem value="1">Published</SelectItem>
                                <SelectItem value="0">Draft</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Gambar</TableHead>
                                    <TableHead>Judul</TableHead>
                                    <TableHead>Kategori</TableHead>
                                    <TableHead>Tags</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Views</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {artikels.data.map((artikel) => (
                                    <TableRow key={artikel.id}>
                                        <TableCell>
                                            {artikel.image ? (
                                                <img src={`/storage/${artikel.image}`} alt={artikel.judul} className="h-12 w-16 rounded object-cover border" />
                                            ) : (
                                                <div className="h-12 w-16 rounded border flex items-center justify-center text-gray-400">
                                                    <ImageIcon className="h-5 w-5" />
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{artikel.judul}</div>
                                            {artikel.excerpt && (
                                                <div className="text-sm text-gray-500 truncate max-w-xs">{artikel.excerpt}</div>
                                            )}
                                        </TableCell>
                                        <TableCell>{artikel.kategori?.nama ?? '-'}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {artikel.tags?.slice(0, 2).map((tag) => (
                                                    <Badge key={tag.id} variant="secondary" className="text-xs">{tag.nama}</Badge>
                                                ))}
                                                {(artikel.tags?.length ?? 0) > 2 && (
                                                    <Badge variant="secondary" className="text-xs">+{(artikel.tags?.length ?? 0) - 2}</Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {artikel.published ? (
                                                <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Published</Badge>
                                            ) : (
                                                <Badge variant="secondary"><XCircle className="w-3 h-3 mr-1" />Draft</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Eye className="w-4 h-4 text-gray-400" />
                                                {artikel.views}
                                            </div>
                                        </TableCell>
                                        <TableCell>{new Date(artikel.created_at).toLocaleDateString('id-ID')}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="outline" size="sm" onClick={() => router.visit(`/admin/artikel/${artikel.id}/edit`)}>
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button variant="outline" size="sm" onClick={() => { setSelectedArtikel(artikel); setIsDeleteOpen(true); }}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {artikels.meta && artikels.meta.last_page > 1 && (
                        <div className="flex justify-center mt-6">
                            <div className="flex gap-2">
                                {artikels.links.map((link, index) => (
                                    <button
                                        key={index}
                                        className={`px-3 py-2 text-sm rounded ${link.active ? 'bg-blue-600 text-white' : link.url ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                                        onClick={() => link.url && (window.location.href = link.url)}
                                        disabled={!link.url}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {selectedArtikel && (
                        <ArtikelDelete
                            isOpen={isDeleteOpen}
                            onClose={() => { setIsDeleteOpen(false); setSelectedArtikel(null); }}
                            artikelId={selectedArtikel.id}
                        />
                    )}
                </div>
            </Card>
        </AppLayout>
    );
}
