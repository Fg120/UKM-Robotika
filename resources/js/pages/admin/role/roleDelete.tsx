import React, { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { Role, Permission } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  roleId: number;
}

export default function RoleDelete({ isOpen, onClose, roleId }: Props) {
  const [role, setRole] = useState<(Role & { permissions: Permission[] }) | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch role data when dialog opens
  useEffect(() => {
    if (isOpen && roleId) {
      setLoading(true);
      fetch(`/admin/roles/${roleId}/delete`)
        .then(response => response.json())
        .then(data => {
          if (data.role) {
            setRole(data.role);
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
    }
  }, [isOpen, roleId, onClose]);

  const handleDelete = () => {
    if (!role) {
      toast.error('Data role tidak tersedia');
      return;
    }

    router.delete(`/admin/roles/${role.id}`, {
      onSuccess: () => {
        toast.success('Role berhasil dihapus');
        onClose();
      },
      onError: (errors: any) => {
        if (errors.response?.data?.message) {
          toast.error(errors.response.data.message);
        } else {
          toast.error('Gagal menghapus role');
        }
      }
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Memuat data...</p>
            </div>
          </div>
        ) : role ? (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
              <AlertDialogDescription>
                Tindakan ini tidak dapat dibatalkan. Ini akan menghapus role{' '}
                <strong>{role.name}</strong> secara permanen.
                {role.permissions && role.permissions.length > 0 && (
                  <>
                    <br /><br />
                    Permission yang terkait: {role.permissions.map(p => p.name).join(', ')}
                  </>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Hapus Role
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        ) : (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-gray-600">Data role tidak tersedia</p>
          </div>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}