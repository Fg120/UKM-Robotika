import React, { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { User } from '@/types';
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
  userId: number;
}

export default function UserDelete({ isOpen, onClose, userId }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch user data when dialog opens
  useEffect(() => {
    if (isOpen && userId) {
      setLoading(true);
      fetch(`/admin/users/${userId}/delete`)
        .then(response => response.json())
        .then(data => {
          if (data.user) {
            setUser(data.user);
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
    }
  }, [isOpen, userId, onClose]);

  const handleDelete = () => {
    if (!user) {
      toast.error('Data pengguna tidak tersedia');
      return;
    }
    
    router.delete(`/admin/users/${user.id}`, {
      onSuccess: () => {
        toast.success('Pengguna berhasil dihapus');
        onClose();
      },
      onError: (errors: any) => {
        if (errors.response?.data?.message) {
          toast.error(errors.response.data.message);
        } else {
          toast.error('Gagal menghapus pengguna');
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
        ) : user ? (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
              <AlertDialogDescription>
                Tindakan ini tidak dapat dibatalkan. Ini akan menghapus akun pengguna untuk{' '}
                <strong>{user.name}</strong> ({user.email}) secara permanen dan menghapus semua data terkait.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Hapus Pengguna
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        ) : (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-gray-600">Data pengguna tidak tersedia</p>
          </div>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
