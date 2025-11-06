import React, { useEffect, useMemo, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Bidang } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Image as ImageIcon, Pencil, Trash2, Plus, ArrowUpDown, ArrowUp, ArrowDown, X, Facebook, Instagram, Twitter, Linkedin, Youtube, Globe, Link as LinkIcon } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import PengurusCreate from './pengurusCreate';
import PengurusEdit from './pengurusEdit';
import PengurusDelete from './pengurusDelete';

interface Sosmed { id?: number; platform: string; icon: string; url: string }
interface Pengurus {
  id: number;
  nama: string;
  image: string | null;
  posisi: 'Kepala' | 'Anggota';
  bidang_id: number;
  bidang?: Pick<Bidang, 'id' | 'nama'>;
  sosmeds?: Sosmed[];
  created_at: string;
}

interface Props {
  penguruses: { data: Pengurus[]; links: any[]; meta: any };
  bidangs: Pick<Bidang, 'id' | 'nama'>[];
  filters?: { search?: string; bidang_id?: string; order_by?: string; sort_direction?: 'asc' | 'desc' };
}

export default function PengurusIndex({ penguruses, bidangs, filters }: Props) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPengurus, setSelectedPengurus] = useState<Pengurus | null>(null);
  const [search, setSearch] = useState(filters?.search || '');
  const [selectedBidang, setSelectedBidang] = useState<string>(filters?.bidang_id || 'all');
  const [sortBy, setSortBy] = useState(filters?.order_by || '');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(filters?.sort_direction || 'asc');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      router.get('/admin/pengurus', {
        search: search || undefined,
        bidang_id: (selectedBidang && selectedBidang !== 'all') ? selectedBidang : undefined,
        order_by: sortBy || undefined,
        sort_direction: sortDirection,
        page: 1,
      }, { preserveState: true });
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [search, selectedBidang, sortBy, sortDirection]);

  const handleSortChange = (column: string) => {
    let newDirection: 'asc' | 'desc' = 'asc';
    if (sortBy === column) newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortBy(column); setSortDirection(newDirection);
    router.get('/admin/pengurus', {
      search: search || undefined,
      bidang_id: (selectedBidang && selectedBidang !== 'all') ? selectedBidang : undefined,
      order_by: column,
      sort_direction: newDirection,
      page: 1,
    }, { preserveState: true });
  };
  const getSortIcon = (column: string) => sortBy !== column ? <ArrowUpDown className="ml-2 h-4 w-4" /> : (sortDirection === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />);

  const [showCUD, setShowCUD] = useState(false);
  useEffect(() => { setShowCUD(selectedBidang !== 'all'); }, [selectedBidang]);

  const Sidebar = () => (
    <div className="w-64 border-r pr-4">
      <div className="font-semibold mb-2">Bidang</div>
      <nav className="flex flex-col gap-1">
        <button className={`text-left px-3 py-2 rounded ${selectedBidang === 'all' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`} onClick={() => setSelectedBidang('all')}>Semua Pengurus</button>
        {bidangs.map(d => (
          <button key={d.id} className={`text-left px-3 py-2 rounded ${String(d.id) === selectedBidang ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`} onClick={() => setSelectedBidang(String(d.id))}>{d.nama}</button>
        ))}
      </nav>
    </div>
  );

  return (
    <AppLayout>
      <Head title="Manajemen Pengurus" />

      <Card>
        <div className="p-6">
          <div className="flex mb-6">
            <Sidebar />
            <div className="flex-1 pl-6">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">{selectedBidang === 'all' ? 'Semua Pengurus' : 'Pengurus Bidang'}</h1>
                {showCUD && (
                  <Button onClick={() => setIsCreateOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />Tambah Pengurus
                  </Button>
                )}
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead><Button variant="ghost" className="h-auto p-0 font-semibold" onClick={() => handleSortChange('id')}>ID {getSortIcon('id')}</Button></TableHead>
                      <TableHead>Foto</TableHead>
                      <TableHead><Button variant="ghost" className="h-auto p-0 font-semibold" onClick={() => handleSortChange('nama')}>Nama {getSortIcon('nama')}</Button></TableHead>
                      <TableHead>Posisi</TableHead>
                      <TableHead>Bidang</TableHead>
                      <TableHead>Sosmed</TableHead>
                      <TableHead><Button variant="ghost" className="h-auto p-0 font-semibold" onClick={() => handleSortChange('created_at')}>Dibuat {getSortIcon('created_at')}</Button></TableHead>
                      {showCUD && (<TableHead className="text-right">Aksi</TableHead>)}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {penguruses.data.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>{p.id}</TableCell>
                        <TableCell>{p.image ? (<img src={`/storage/${p.image}`} alt={p.nama} className="h-10 w-10 rounded object-cover border" />) : (<div className="h-10 w-10 rounded border flex items-center justify-center text-gray-400"><ImageIcon className="h-5 w-5" /></div>)}</TableCell>
                        <TableCell className="font-medium">{p.nama}</TableCell>
                        <TableCell>{p.posisi}</TableCell>
                        <TableCell>{p.bidang?.nama ?? '-'}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {p.sosmeds?.map((s, i) => {
                              const Icon = ({ Facebook, Instagram, Twitter, Linkedin, Youtube, Globe, Link: LinkIcon } as any)[s.icon] || LinkIcon;
                              return <a key={i} href={s.url} target="_blank" className="text-gray-600 hover:text-blue-600"><Icon className="w-4 h-4" /></a>
                            })}
                          </div>
                        </TableCell>
                        <TableCell>{new Date(p.created_at).toLocaleDateString('id-ID')}</TableCell>
                        {showCUD && (
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => { setSelectedPengurus(p); setIsEditOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                              <Button variant="outline" size="sm" onClick={() => { setSelectedPengurus(p); setIsDeleteOpen(true); }}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {penguruses.meta && penguruses.meta.last_page > 1 && (
                <div className="flex justify-center mt-6">
                  <div className="flex gap-2">
                    {penguruses.links.map((link, index) => (
                      <button key={index} className={`px-3 py-2 text-sm rounded ${link.active ? 'bg-blue-600 text-white' : link.url ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`} onClick={() => link.url && (window.location.href = link.url)} disabled={!link.url} dangerouslySetInnerHTML={{ __html: link.label }} />
                    ))}
                  </div>
                </div>
              )}

              <PengurusCreate isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} bidangs={bidangs} selectedBidang={selectedBidang} />
              {selectedPengurus && (
                <PengurusEdit isOpen={isEditOpen} onClose={() => { setIsEditOpen(false); setSelectedPengurus(null); }} pengurusId={selectedPengurus.id} />
              )}
              {selectedPengurus && (
                <PengurusDelete isOpen={isDeleteOpen} onClose={() => { setIsDeleteOpen(false); setSelectedPengurus(null); }} pengurusId={selectedPengurus.id} />
              )}
            </div>
          </div>
        </div>
      </Card>
    </AppLayout>
  );
}