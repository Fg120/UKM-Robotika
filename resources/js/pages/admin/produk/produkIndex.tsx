import React, { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Produk } from '@/types';
import { Card } from '@/components/ui/card';
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
import { ArrowDown, ArrowUp, ArrowUpDown, Image as ImageIcon, Pencil, Plus, Trash2, X } from 'lucide-react';
import ProdukCreate from './produkCreate';
import ProdukEdit from './produkEdit';
import ProdukDelete from './produkDelete';

interface Props {
  produks: {
    data: Produk[];
    links: any[];
    meta: any;
  };
  filters?: {
    search?: string;
    order_by?: string;
    sort_direction?: 'asc' | 'desc';
  };
}

export default function ProdukIndex({ produks, filters }: Props) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProduk, setSelectedProduk] = useState<Produk | null>(null);
  const [search, setSearch] = useState(filters?.search || '');
  const [sortBy, setSortBy] = useState(filters?.order_by || '');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(filters?.sort_direction || 'asc');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      router.get('/admin/produks', {
        search: search || undefined,
        order_by: sortBy || undefined,
        sort_direction: sortDirection,
        page: 1,
      }, { preserveState: true });
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [search, sortBy, sortDirection]);

  const handleSortChange = (column: string) => {
    let newDirection: 'asc' | 'desc' = 'asc';
    if (sortBy === column) newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortBy(column);
    setSortDirection(newDirection);
    router.get('/admin/produks', {
      search: search || undefined,
      order_by: column,
      sort_direction: newDirection,
      page: 1,
    }, { preserveState: true });
  };

  const getSortIcon = (column: string) => {
    if (sortBy !== column) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return sortDirection === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />;
  };

  const handleEdit = (produk: Produk) => { setSelectedProduk(produk); setIsEditOpen(true); };
  const handleDelete = (produk: Produk) => { setSelectedProduk(produk); setIsDeleteOpen(true); };

  return (
    <AppLayout>
      <Head title="Manajemen Produk" />
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Manajemen Produk</h1>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Produk
            </Button>
          </div>

          <div className="mb-6">
            <div className="flex gap-2">
              <Input
                placeholder="Cari produk berdasarkan nama atau keterangan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm"
              />
              {search && (
                <Button variant="outline" size="sm" onClick={() => setSearch('')} title="Hapus pencarian">
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
                  <TableHead>Keterangan</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>
                    <Button variant="ghost" className="h-auto p-0 font-semibold" onClick={() => handleSortChange('aktif')}>
                      Aktif {getSortIcon('aktif')}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="h-auto p-0 font-semibold" onClick={() => handleSortChange('created_at')}>
                      Dibuat {getSortIcon('created_at')}
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {produks.data.map((produk) => (
                  <TableRow key={produk.id}>
                    <TableCell>{produk.id}</TableCell>
                    <TableCell>
                      {produk.image ? (
                        <img src={`/storage/${produk.image}`} alt={produk.nama} className="h-10 w-10 rounded object-cover border" />
                      ) : (
                        <div className="h-10 w-10 rounded border flex items-center justify-center text-gray-400">
                          <ImageIcon className="h-5 w-5" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{produk.nama}</TableCell>
                    <TableCell>
                      {produk.keterangan ? (
                        <span className="text-sm text-gray-600 line-clamp-2">{produk.keterangan}</span>
                      ) : (
                        <span className="text-gray-400 italic">Tidak ada keterangan</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <a href={produk.url} target="_blank" className="text-blue-600 underline" rel="noreferrer">{produk.url}</a>
                    </TableCell>
                    <TableCell>
                      {produk.aktif ? (
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-700">Ya</span>
                      ) : (
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-700">Tidak</span>
                      )}
                    </TableCell>
                    <TableCell>{new Date(produk.created_at).toLocaleDateString('id-ID')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(produk)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(produk)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {produks.meta && produks.meta.last_page > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex gap-2">
                {produks.links.map((link: any, index: number) => (
                  <button
                    key={index}
                    className={`px-3 py-2 text-sm rounded ${
                      link.active
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

          <ProdukCreate isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
          {selectedProduk && (
            <ProdukEdit
              isOpen={isEditOpen}
              onClose={() => { setIsEditOpen(false); setSelectedProduk(null); }}
              produkId={selectedProduk.id}
            />
          )}
          {selectedProduk && (
            <ProdukDelete
              isOpen={isDeleteOpen}
              onClose={() => { setIsDeleteOpen(false); setSelectedProduk(null); }}
              produkId={selectedProduk.id}
            />
          )}
        </div>
      </Card>
    </AppLayout>
  );
}

