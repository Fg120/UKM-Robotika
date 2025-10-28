import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { Tag as TagType } from '@/types';
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
import { Pencil, Trash2, Plus, ArrowUpDown, ArrowUp, ArrowDown, X } from 'lucide-react';
import TagCreate from './tagCreate';
import TagEdit from './tagEdit';
import TagDelete from './tagDelete';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';

interface Props {
  tags: {
    data: TagType[];
    links: any[];
    meta: any;
  };
  filters?: {
    search?: string;
    order_by?: string;
    sort_direction?: 'asc' | 'desc';
  };
}

export default function TagIndex({ tags, filters }: Props) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<TagType | null>(null);
  const [search, setSearch] = useState(filters?.search || '');
  const [sortBy, setSortBy] = useState(filters?.order_by || '');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(filters?.sort_direction || 'asc');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      router.get('/admin/tags', {
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
    router.get('/admin/tags', {
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

  const handleEdit = (tag: TagType) => {
    setSelectedTag(tag);
    setIsEditOpen(true);
  };

  const handleDelete = (tag: TagType) => {
    setSelectedTag(tag);
    setIsDeleteOpen(true);
  };

  return (
    <AppLayout>
      <Head title="Manajemen Tag" />

      <Card>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Manajemen Tag</h1>

            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Tag
            </Button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="flex gap-2">
              <Input
                placeholder="Cari tag berdasarkan nama atau deskripsi..."
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

          {/* Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="h-auto p-0 font-semibold"
                      onClick={() => handleSortChange('id')}
                    >
                      ID
                      {getSortIcon('id')}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="h-auto p-0 font-semibold"
                      onClick={() => handleSortChange('nama')}
                    >
                      Nama
                      {getSortIcon('nama')}
                    </Button>
                  </TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="h-auto p-0 font-semibold"
                      onClick={() => handleSortChange('created_at')}
                    >
                      Dibuat
                      {getSortIcon('created_at')}
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tags.data.map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell>{tag.id}</TableCell>
                    <TableCell className="font-medium">{tag.nama}</TableCell>
                    <TableCell>
                      {tag.deskripsi ? (
                        <span className="text-sm text-gray-600 line-clamp-2">
                          {tag.deskripsi}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">Tidak ada deskripsi</span>
                      )}
                    </TableCell>
                    <TableCell>{new Date(tag.created_at).toLocaleDateString('id-ID')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(tag)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(tag)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {tags.meta && tags.meta.last_page > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex gap-2">
                {tags.links.map((link, index) => (
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

          {/* Modals */}
          <TagCreate
            isOpen={isCreateOpen}
            onClose={() => setIsCreateOpen(false)}
          />

          {selectedTag && (
            <TagEdit
              isOpen={isEditOpen}
              onClose={() => {
                setIsEditOpen(false);
                setSelectedTag(null);
              }}
              tagId={selectedTag.id}
            />
          )}

          {selectedTag && (
            <TagDelete
              isOpen={isDeleteOpen}
              onClose={() => {
                setIsDeleteOpen(false);
                setSelectedTag(null);
              }}
              tagId={selectedTag.id}
            />
          )}
        </div>
      </Card>
    </AppLayout>
  );
}

