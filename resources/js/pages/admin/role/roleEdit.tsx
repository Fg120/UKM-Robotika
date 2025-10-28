import React, { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Role, Permission } from '@/types';
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
  roleId: number;
}

export default function RoleEdit({ isOpen, onClose, roleId }: Props) {
  const [role, setRole] = useState<Role | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const { data, setData, put, processing, reset } = useForm({
    name: '',
    permissions: [] as number[]
  });

  // Fetch role data when dialog opens
  useEffect(() => {
    if (isOpen && roleId) {
      setLoading(true);
      fetch(`/admin/roles/${roleId}/edit`)
        .then(response => response.json())
        .then(data => {
          if (data.role) {
            setRole(data.role);
            setPermissions(data.permissions || []);
            setRolePermissions(data.rolePermissions || []);
            setData({
              name: data.role.name,
              permissions: data.rolePermissions || []
            });
          } else if (data.error) {
            toast.error(data.error);
            onClose();
          }
        })
        .catch(error => {
          toast.error('Gagal memuat data role');
          onClose();
        })
        .finally(() => setLoading(false));
    } else if (!isOpen) {
      // Reset state when dialog closes
      setRole(null);
      setPermissions([]);
      setRolePermissions([]);
      reset();
    }
  }, [isOpen, roleId, setData, reset, onClose]);

  const handlePermissionChange = (permissionId: number, checked: boolean) => {
    if (checked) {
      setData('permissions', [...data.permissions, permissionId]);
    } else {
      setData('permissions', data.permissions.filter(id => id !== permissionId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!role) {
      toast.error('Data role tidak tersedia');
      return;
    }

    put(`/admin/roles/${role.id}`, {
      onSuccess: () => {
        toast.success('Role berhasil diperbarui');
        onClose();
      },
      onError: (errors: any) => {
        if (errors.response?.data?.message) {
          toast.error(errors.response.data.message);
        } else {
          toast.error('Gagal memperbarui role');
        }
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
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
              <DialogTitle>Edit Role</DialogTitle>
              <DialogDescription>
                Perbarui nama role dan permission yang terkait.
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
                  {permissions.length > 0 ? (
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
                {processing ? 'Memperbarui...' : 'Perbarui Role'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}