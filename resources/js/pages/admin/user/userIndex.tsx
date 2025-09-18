import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { User } from '@/types';
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
import { Pencil, Trash2, Plus, Search, ArrowUpDown, ArrowUp, ArrowDown, X } from 'lucide-react';
import UserCreate from './userCreate';
import UserEdit from './userEdit';
import UserDelete from './userDelete';
import AdminLayout from '@/layouts/admin-layout';

interface Props {
  users: {
    data: User[];
    links: any[];
    meta: any;
  };
  filters: {
    search?: string;
    order_by?: string;
    sort_direction?: 'asc' | 'desc';
  };
}

export default function UserIndex({ users, filters }: Props) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [search, setSearch] = useState(filters.search || '');
  const [sortBy, setSortBy] = useState(filters.order_by || '');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(filters.sort_direction || 'asc');

  // Watch for search input changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      router.get('/admin/users', { 
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
    
    router.get('/admin/users', { 
      search: search || undefined, 
      order_by: column,
      sort_direction: newDirection,
      page: 1 // Reset to first page when sorting
    }, { preserveState: true });
  };

  const getSortIcon = (column: string) => {
    if (sortBy !== column) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return sortDirection === 'asc' 
      ? <ArrowUp className="ml-2 h-4 w-4" />
      : <ArrowDown className="ml-2 h-4 w-4" />;
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  return (
    <AdminLayout>
      <Head title="Manajemen Pengguna" />
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manajemen Pengguna</h1>
          
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Pengguna
          </Button>
        </div>

        {/* Search Form */}
        <div className="mb-6">
          <div className="flex gap-2">
            <Input
              placeholder="Cari pengguna berdasarkan nama atau email..."
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

        {/* Users Table */}
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
                    Nama
                    {getSortIcon('name')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    className="h-auto p-0 font-semibold"
                    onClick={() => handleSortChange('email')}
                  >
                    Email
                    {getSortIcon('email')}
                  </Button>
                </TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.data.map((user: User) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(user)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(user)}
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

        {/* Dialogs */}
        <UserCreate 
          isOpen={isCreateOpen} 
          onClose={() => setIsCreateOpen(false)} 
        />
        
        {selectedUser && (
          <UserEdit 
            isOpen={isEditOpen} 
            onClose={() => {
              setIsEditOpen(false);
              setSelectedUser(null);
            }}
            userId={selectedUser.id}
          />
        )}
        
        {selectedUser && (
          <UserDelete 
            isOpen={isDeleteOpen} 
            onClose={() => {
              setIsDeleteOpen(false);
              setSelectedUser(null);
            }}
            userId={selectedUser.id}
          />
        )}
      </div>
    </AdminLayout>
  );
}
