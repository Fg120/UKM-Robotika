import React, { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Divisi, SubDivisi } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2, Plus, ArrowUpDown, ArrowUp, ArrowDown, X, Image as ImageIcon } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import SubDivisiCreate from './subDivisiCreate';
import SubDivisiEdit from './subDivisiEdit';
import SubDivisiDelete from './subDivisiDelete';

interface Props {
  subDivisis: { data: SubDivisi[]; links: any[]; meta: any };
  divisis: Pick<Divisi, 'id' | 'nama'>[];
  filters?: { search?: string; divisi_id?: string; order_by?: string; sort_direction?: 'asc' | 'desc' };
}

export default function SubDivisiIndex({ subDivisis, divisis, filters }: Props) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSubDivisi, setSelectedSubDivisi] = useState<SubDivisi | null>(null);
  const [search, setSearch] = useState(filters?.search || '');
  const [selectedDivisi, setSelectedDivisi] = useState<string>(filters?.divisi_id || 'all');
  const [sortBy, setSortBy] = useState(filters?.order_by || '');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(filters?.sort_direction || 'asc');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      router.get('/admin/subdivisis', {
        search: search || undefined,
        divisi_id: (selectedDivisi && selectedDivisi !== 'all') ? selectedDivisi : undefined,
        order_by: sortBy || undefined,
        sort_direction: sortDirection,
        page: 1,
      }, { preserveState: true });
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [search, selectedDivisi, sortBy, sortDirection]);

  const handleSortChange = (column: string) => {
    let newDirection: 'asc' | 'desc' = 'asc';
    if (sortBy === column) newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortBy(column); setSortDirection(newDirection);
    router.get('/admin/subdivisis', {
      search: search || undefined,
      divisi_id: (selectedDivisi && selectedDivisi !== 'all') ? selectedDivisi : undefined,
      order_by: column,
      sort_direction: newDirection,
      page: 1,
    }, { preserveState: true });
  };
  const getSortIcon = (column: string) => sortBy !== column ? <ArrowUpDown className="ml-2 h-4 w-4" /> : (sortDirection === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />);

  const handleEdit = (sub: SubDivisi) => { setSelectedSubDivisi(sub); setIsEditOpen(true); };
  const handleDelete = (sub: SubDivisi) => { setSelectedSubDivisi(sub); setIsDeleteOpen(true); };

  return (
    <AppLayout>
      <Head title="Manajemen Sub Divisi" />
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Manajemen Sub Divisi</h1>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />Tambah Sub Divisi
            </Button>
          </div>

          <div className="mb-6 flex gap-2 items-center">
            <Input placeholder="Cari sub divisi..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
            {search && (
              <Button variant="outline" size="sm" onClick={() => setSearch('')} title="Hapus pencarian"><X className="w-4 h-4" /></Button>
            )}
            <Select value={selectedDivisi} onValueChange={(val) => setSelectedDivisi(val)}>
              <SelectTrigger className="w-[220px]"><SelectValue placeholder="Filter divisi" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Divisi</SelectItem>
                {divisis.map(d => (<SelectItem key={d.id} value={String(d.id)}>{d.nama}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button variant="ghost" className="h-auto p-0 font-semibold" onClick={() => handleSortChange('id')}>ID {getSortIcon('id')}</Button>
                  </TableHead>
                  <TableHead>Gambar</TableHead>
                  <TableHead>
                    <Button variant="ghost" className="h-auto p-0 font-semibold" onClick={() => handleSortChange('nama')}>Nama {getSortIcon('nama')}</Button>
                  </TableHead>
                  <TableHead>Divisi</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>
                    <Button variant="ghost" className="h-auto p-0 font-semibold" onClick={() => handleSortChange('created_at')}>Dibuat {getSortIcon('created_at')}</Button>
                  </TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subDivisis.data.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell>{sub.id}</TableCell>
                    <TableCell>
                      {sub.image ? (
                        <img src={`/storage/${sub.image}`} alt={sub.nama} className="h-10 w-10 rounded object-cover border" />
                      ) : (
                        <div className="h-10 w-10 rounded border flex items-center justify-center text-gray-400"><ImageIcon className="h-5 w-5" /></div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{sub.nama}</TableCell>
                    <TableCell>{sub.divisi?.nama ?? '-'}</TableCell>
                    <TableCell>
                      {sub.deskripsi ? (<span className="text-sm text-gray-600 line-clamp-2">{sub.deskripsi}</span>) : (<span className="text-gray-400 italic">Tidak ada deskripsi</span>)}
                    </TableCell>
                    <TableCell>{new Date(sub.created_at).toLocaleDateString('id-ID')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(sub)}><Pencil className="w-4 h-4" /></Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(sub)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {subDivisis.meta && subDivisis.meta.last_page > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex gap-2">
                {subDivisis.links.map((link, index) => (
                  <button key={index} className={`px-3 py-2 text-sm rounded ${link.active ? 'bg-blue-600 text-white' : link.url ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`} onClick={() => link.url && (window.location.href = link.url)} disabled={!link.url} dangerouslySetInnerHTML={{ __html: link.label }} />
                ))}
              </div>
            </div>
          )}

          <SubDivisiCreate isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} divisis={divisis} />
          {selectedSubDivisi && (
            <SubDivisiEdit isOpen={isEditOpen} onClose={() => { setIsEditOpen(false); setSelectedSubDivisi(null); }} subDivisiId={selectedSubDivisi.id} />
          )}
          {selectedSubDivisi && (
            <SubDivisiDelete isOpen={isDeleteOpen} onClose={() => { setIsDeleteOpen(false); setSelectedSubDivisi(null); }} subDivisiId={selectedSubDivisi.id} />
          )}
        </div>
      </Card>
    </AppLayout>
  );
}