import React, { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Galeri } from '@/types';
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
import GaleriCreate from './galeriCreate';
import GaleriEdit from './galeriEdit';
import GaleriDelete from './galeriDelete';

interface Props {
  galeris: {
    data: Galeri[];
    links: any[];
    meta: any;
  };
  filters?: {
    search?: string;
    order_by?: string;
    sort_direction?: 'asc' | 'desc';
  };
}

export default function GaleriIndex({ galeris, filters }: Props) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedGaleri, setSelectedGaleri] = useState<Galeri | null>(null);
  const [search, setSearch] = useState(filters?.search || '');
  const [sortBy, setSortBy] = useState(filters?.order_by || '');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(filters?.sort_direction || 'asc');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      router.get('/admin/galeris', {
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
    router.get('/admin/galeris', {
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

  const handleEdit = (galeri: Galeri) => { setSelectedGaleri(galeri); setIsEditOpen(true); };
  const handleDelete = (galeri: Galeri) => { setSelectedGaleri(galeri); setIsDeleteOpen(true); };

  return (
    <AppLayout>
      <Head title="Manajemen Galeri" />
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Manajemen Galeri</h1>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Galeri
            </Button>
          </div>

          <div className="mb-6">
            <div className="flex gap-2">
              <Input
                placeholder="Cari galeri berdasarkan judul..."
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
                    <Button variant="ghost" className="h-auto p-0 font-semibold" onClick={() => handleSortChange('judul')}>
                      Judul {getSortIcon('judul')}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="h-auto p-0 font-semibold" onClick={() => handleSortChange('tanggal')}>
                      Tanggal {getSortIcon('tanggal')}
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
                {galeris.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Belum ada data galeri
                    </TableCell>
                  </TableRow>
                ) : (
                  galeris.data.map((galeri) => (
                    <TableRow key={galeri.id}>
                      <TableCell>{galeri.id}</TableCell>
                      <TableCell>
                        {galeri.image ? (
                          <img src={`/storage/${galeri.image}`} alt={galeri.judul} className="h-10 w-10 rounded object-cover border" />
                        ) : (
                          <div className="h-10 w-10 rounded border flex items-center justify-center text-gray-400">
                            <ImageIcon className="h-5 w-5" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{galeri.judul}</TableCell>
                      <TableCell>{new Date(galeri.tanggal).toLocaleDateString('id-ID')}</TableCell>
                      <TableCell>{new Date(galeri.created_at).toLocaleDateString('id-ID')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(galeri)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(galeri)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {galeris.meta && galeris.meta.last_page > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex gap-2">
                {galeris.links.map((link: any, index: number) => (
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

          <GaleriCreate isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
          {selectedGaleri && (
            <GaleriEdit
              isOpen={isEditOpen}
              onClose={() => { setIsEditOpen(false); setSelectedGaleri(null); }}
              galeriId={selectedGaleri.id}
            />
          )}
          {selectedGaleri && (
            <GaleriDelete
              isOpen={isDeleteOpen}
              onClose={() => { setIsDeleteOpen(false); setSelectedGaleri(null); }}
              galeriId={selectedGaleri.id}
            />
          )}
        </div>
      </Card>
    </AppLayout>
  );
}

