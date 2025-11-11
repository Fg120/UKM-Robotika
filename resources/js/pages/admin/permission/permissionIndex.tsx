import React, { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Permission } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2, Plus, ArrowUpDown, ArrowUp, ArrowDown, X } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import PermissionCreate from './permissionCreate';
import PermissionEdit from './permissionEdit';
import PermissionDelete from './permissionDelete';

interface Props {
  permissions: {
    data: Permission[];
    links: any[];
    meta: any;
  };
  filters?: {
    search?: string;
    order_by?: string;
    sort_direction?: 'asc' | 'desc';
  };
}

export default function PermissionIndex({ permissions, filters }: Props) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
  const [search, setSearch] = useState(filters?.search || '');
  const [sortBy, setSortBy] = useState(filters?.order_by || '');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(filters?.sort_direction || 'asc');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      router.get('/admin/permissions', {
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

    router.get('/admin/permissions', {
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

  const handleEdit = (permission: Permission) => {
    setSelectedPermission(permission);
    setIsEditOpen(true);
  };

  const handleDelete = (permission: Permission) => {
    setSelectedPermission(permission);
    setIsDeleteOpen(true);
  };

  return (
    <AppLayout>
      <Head title="Manajemen Permission" />

      <Card>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Manajemen Permission</h1>

            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Permission
            </Button>
          </div>

          <div className="mb-6">
            <div className="flex gap-2">
              <Input
                placeholder="Cari permission berdasarkan nama..."
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
                  <TableHead>
                    <Button variant="ghost" className="h-auto p-0 font-semibold" onClick={() => handleSortChange('name')}>
                      Nama Permission {getSortIcon('name')}
                    </Button>
                  </TableHead>
                  <TableHead>Guard</TableHead>
                  <TableHead>
                    <Button variant="ghost" className="h-auto p-0 font-semibold" onClick={() => handleSortChange('created_at')}>
                      Dibuat {getSortIcon('created_at')}
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissions.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      Belum ada data permission
                    </TableCell>
                  </TableRow>
                ) : (
                  permissions.data.map((permission) => (
                    <TableRow key={permission.id}>
                      <TableCell>{permission.id}</TableCell>
                      <TableCell className="font-medium">{permission.name}</TableCell>
                      <TableCell>{permission.guard_name}</TableCell>
                      <TableCell>{new Date(permission.created_at).toLocaleDateString('id-ID')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(permission)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(permission)}>
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

          {permissions.meta && permissions.meta.last_page > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex gap-2">
                {permissions.links.map((link, index) => (
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

          <PermissionCreate isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
          {selectedPermission && (
            <PermissionEdit
              isOpen={isEditOpen}
              onClose={() => { setIsEditOpen(false); setSelectedPermission(null); }}
              permissionId={selectedPermission.id}
            />
          )}
          {selectedPermission && (
            <PermissionDelete
              isOpen={isDeleteOpen}
              onClose={() => { setIsDeleteOpen(false); setSelectedPermission(null); }}
              permissionId={selectedPermission.id}
            />
          )}
        </div>
      </Card>
    </AppLayout>
  );
}