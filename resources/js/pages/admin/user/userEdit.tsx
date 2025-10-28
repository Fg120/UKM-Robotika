import React, { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { User, Role } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
}

export default function UserEdit({ isOpen, onClose, userId }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [userRole, setUserRole] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  const { data, setData, put, processing, reset } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: '' as string
  });

  // Fetch user data when dialog opens
  useEffect(() => {
    if (isOpen && userId) {
      setLoading(true);
      fetch(`/admin/users/${userId}/edit`)
        .then(response => response.json())
        .then(data => {
          if (data.user) {
            setUser(data.user);
            setRoles(data.roles || []);
            setUserRole(data.userRole ? data.userRole.toString() : '');
            setData({
              name: data.user.name,
              email: data.user.email,
              password: '',
              password_confirmation: '',
              role: data.userRole ? data.userRole.toString() : ''
            });
          } else if (data.error) {
            toast.error(data.error);
            onClose();
          }
        })
        .catch(error => {
          toast.error('Gagal memuat data pengguna');
          onClose();
        })
        .finally(() => setLoading(false));
    } else if (!isOpen) {
      // Reset state when dialog closes
      setUser(null);
      setRoles([]);
      setUserRole('');
      reset();
    }
  }, [isOpen, userId, setData, reset, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Data pengguna tidak tersedia');
      return;
    }
    
    put(`/admin/users/${user.id}`, {
      onSuccess: () => {
        toast.success('Pengguna berhasil diperbarui');
        onClose();
      },
      onError: (errors: any) => {
        if (errors.response?.data?.message) {
          toast.error(errors.response.data.message);
        } else {
          toast.error('Gagal memperbarui pengguna');
        }
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Memuat data...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Pengguna</DialogTitle>
            <DialogDescription>
              Perbarui informasi pengguna. Biarkan kolom kata sandi kosong untuk mempertahankan kata sandi saat ini.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Nama
              </Label>
              <Input
                id="edit-name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">
                Email
              </Label>
              <Input
                id="edit-email"
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-password" className="text-right">
                Kata Sandi
              </Label>
              <Input
                id="edit-password"
                type="password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                className="col-span-3"
                placeholder="Kosongkan untuk mempertahankan yang lama"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-password-confirmation" className="text-right">
                Konfirmasi
              </Label>
              <Input
                id="edit-password-confirmation"
                type="password"
                value={data.password_confirmation}
                onChange={(e) => setData('password_confirmation', e.target.value)}
                className="col-span-3"
                placeholder="Kosongkan untuk mempertahankan yang lama"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-role" className="text-right">
                Role
              </Label>
              <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Pilih role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id.toString()}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={processing}>
              {processing ? 'Memperbarui...' : 'Perbarui Pengguna'}
            </Button>
          </DialogFooter>
        </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
