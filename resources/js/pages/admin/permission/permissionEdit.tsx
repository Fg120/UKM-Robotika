import React, { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Permission } from '@/types';

interface PermissionEditProps {
  isOpen: boolean;
  onClose: () => void;
  permissionId: number;
}

export default function PermissionEdit({ isOpen, onClose, permissionId }: PermissionEditProps) {
  const [permission, setPermission] = useState<Permission | null>(null);
  const [formData, setFormData] = useState({ name: '', guard_name: 'web' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { if (isOpen && permissionId) { loadPermission(); } }, [isOpen, permissionId]);

  const loadPermission = async () => {
    try {
      const res = await fetch(`/admin/permissions/${permissionId}/edit`);
      const data = await res.json();
      setPermission(data.permission);
      setFormData({ name: data.permission.name ?? '', guard_name: data.permission.guard_name ?? 'web' });
    } catch (e) {
      // noop
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    try {
      await router.put(`/admin/permissions/${permissionId}`, formData, {
        onSuccess: () => { setPermission(null); onClose(); },
        onError: (errs) => setErrors(errs),
        onFinish: () => setIsLoading(false),
      });
    } catch (e) { setIsLoading(false); }
  };

  const handleClose = () => { if (!isLoading) { setPermission(null); setErrors({}); onClose(); } };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Permission</DialogTitle>
          <DialogDescription>Perbarui nama/guard permission.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Nama</Label>
            <div className="col-span-3">
              <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="contoh: edit posts" className={errors.name ? 'border-red-500' : ''} />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="guard_name" className="text-right">Guard</Label>
            <div className="col-span-3">
              <Input id="guard_name" value={formData.guard_name} onChange={(e) => setFormData({ ...formData, guard_name: e.target.value })} placeholder="web" />
              {errors.guard_name && <p className="text-sm text-red-500 mt-1">{errors.guard_name}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>Batal</Button>
            <Button type="submit" disabled={isLoading}>{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Perbarui</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}