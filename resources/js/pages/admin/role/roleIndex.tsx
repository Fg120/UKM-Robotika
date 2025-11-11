import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { Role, Permission } from '@/types';
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
import RoleCreate from './roleCreate';
import RoleEdit from './roleEdit';
import RoleDelete from './roleDelete';
import RoleAssignPermissions from './roleAssignPermissions';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';

interface Props {
  roles: {
    data: (Role & { permissions: Permission[] })[];
    links: any[];
    meta: any;
  };
  filters?: {
    search?: string;
    order_by?: string;
    sort_direction?: 'asc' | 'desc';
  };
}

export default function RoleIndex({ roles, filters }: Props) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [search, setSearch] = useState(filters?.search || '');
  const [sortBy, setSortBy] = useState(filters?.order_by || '');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(filters?.sort_direction || 'asc');

  // Watch for search input changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      router.get('/admin/roles', {
        search: search || undefined,
        order_by: sortBy || undefined,
        sort_direction: sortDirection,
        page: 1 // Reset to first page when searching
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

    router.get('/admin/roles', {
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

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setIsEditOpen(true);
  };

  const handleDelete = (role: Role) => {
    setSelectedRole(role);
    setIsDeleteOpen(true);
  };

  return (
    <AppLayout>
      <Head title="Manajemen Role" />

      <Card>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Manajemen Role</h1>

            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Role
            </Button>
          </div>

          {/* Search Form */}
          <div className="mb-6">
            <div className="flex gap-2">
              <Input
                placeholder="Cari role berdasarkan nama..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm"
              />
              {search && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearch('')}
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Roles Table */}
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
                      onClick={() => handleSortChange('name')}
                    >
                      Nama Role
                      {getSortIcon('name')}
                    </Button>
                  </TableHead>
                  <TableHead>Permissions</TableHead>
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
                {roles.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      Belum ada data role
                    </TableCell>
                  </TableRow>
                ) : (
                  roles.data.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell>{role.id}</TableCell>
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions?.slice(0, 3).map((permission) => (
                            <span
                              key={permission.id}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                            >
                              {permission.name}
                            </span>
                          ))}
                          {role.permissions && role.permissions.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{role.permissions.length - 3} lainnya
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(role.created_at).toLocaleDateString('id-ID')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(role)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => { setSelectedRole(role); setIsAssignOpen(true); }}
                          >
                            Permissions
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(role)}
                          >
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

          {/* Pagination */}
          {roles.meta && roles.meta.last_page > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex gap-2">
                {roles.links.map((link, index) => (
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

          {/* Dialogs */}
          <RoleCreate
            isOpen={isCreateOpen}
            onClose={() => setIsCreateOpen(false)}
          />

          {selectedRole && (
            <RoleEdit
              isOpen={isEditOpen}
              onClose={() => {
                setIsEditOpen(false);
                setSelectedRole(null);
              }}
              roleId={selectedRole.id}
            />
          )}

          {selectedRole && (
            <RoleDelete
              isOpen={isDeleteOpen}
              onClose={() => {
                setIsDeleteOpen(false);
                setSelectedRole(null);
              }}
              roleId={selectedRole.id}
            />
          )}

          {selectedRole && (<RoleAssignPermissions isOpen={isAssignOpen} onClose={() => { setIsAssignOpen(false); setSelectedRole(null); }} roleId={selectedRole.id} />)}
        </div>
      </Card>
    </AppLayout>
  );
}