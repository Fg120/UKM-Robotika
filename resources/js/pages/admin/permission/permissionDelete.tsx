import React, { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Permission } from '@/types';

interface PermissionDeleteProps {
  isOpen: boolean;
  onClose: () => void;
  permissionId: number;
}

export default function PermissionDelete({ isOpen, onClose, permissionId }: PermissionDeleteProps) {
  const [permission, setPermission] = useState<Permission | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { if (isOpen && permissionId) { loadPermission(); } }, [isOpen, permissionId]);

  const loadPermission = async () => {
    try {
      const res = await fetch(`/admin/permissions/${permissionId}`);
      const data = await res.json();
      setPermission(data.permission);
    } catch (e) { /* noop */ }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await router.delete(`/admin/permissions/${permissionId}`, {
        onSuccess: () => { setPermission(null); onClose(); },
        onFinish: () => setIsLoading(false),
      });
    } catch (e) { setIsLoading(false); }
  };

  const handleClose = () => { if (!isLoading) { setPermission(null); onClose(); } };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Hapus Permission</DialogTitle>
          <DialogDescription>Apakah Anda yakin ingin menghapus permission ini? Tindakan ini tidak dapat dibatalkan.</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {permission ? (
            <p>
              Permission: <span className="font-semibold">{permission.name}</span> ({permission.guard_name})
            </p>
          ) : (
            <p>Memuat data permission...</p>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>Batal</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Hapus</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}