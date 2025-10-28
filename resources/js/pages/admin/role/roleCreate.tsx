import React, { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Permission } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function RoleCreate({ isOpen, onClose }: Props) {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);

  const { data, setData, post, processing, reset } = useForm({
    name: '',
    permissions: [] as number[]
  });

  // Fetch permissions when dialog opens
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch('/admin/roles/create')
        .then(response => response.json())
        .then(data => {
          if (data.permissions) {
            setPermissions(data.permissions);
          }
        })
        .catch(error => {
          toast.error('Gagal memuat data permission');
        })
        .finally(() => setLoading(false));
    } else {
      // Reset form when dialog closes
      reset();
      setPermissions([]);
    }
  }, [isOpen, reset]);

  const handlePermissionChange = (permissionId: number, checked: boolean) => {
    if (checked) {
      setData('permissions', [...data.permissions, permissionId]);
    } else {
      setData('permissions', data.permissions.filter(id => id !== permissionId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    post('/admin/roles', {
      onSuccess: () => {
        toast.success('Role berhasil dibuat');
        reset();
        onClose();
      },
      onError: (errors: any) => {
        if (errors.response?.data?.message) {
          toast.error(errors.response.data.message);
        } else {
          toast.error('Gagal membuat role');
        }
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Tambah Role Baru</DialogTitle>
            <DialogDescription>
              Buat role baru dan tetapkan permission yang sesuai.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nama Role
              </Label>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className="col-span-3"
                placeholder="Masukkan nama role"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">
                Permissions
              </Label>
              <div className="col-span-3 space-y-3 max-h-60 overflow-y-auto">
                {loading ? (
                  <p className="text-sm text-gray-500">Memuat permissions...</p>
                ) : permissions.length > 0 ? (
                  permissions.map((permission) => (
                    <div key={permission.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`permission-${permission.id}`}
                        checked={data.permissions.includes(permission.id)}
                        onCheckedChange={(checked) =>
                          handlePermissionChange(permission.id, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={`permission-${permission.id}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {permission.name}
                      </Label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Tidak ada permission tersedia</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={processing}>
              {processing ? 'Membuat...' : 'Buat Role'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}