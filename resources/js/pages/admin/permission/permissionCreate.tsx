import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface PermissionCreateProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PermissionCreate({ isOpen, onClose }: PermissionCreateProps) {
  const [formData, setFormData] = useState({ name: '', guard_name: 'web' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      await router.post('/admin/permissions', formData, {
        onSuccess: () => {
          setFormData({ name: '', guard_name: 'web' });
          onClose();
        },
        onError: (errs) => setErrors(errs),
        onFinish: () => setIsLoading(false),
      });
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({ name: '', guard_name: 'web' });
      setErrors({});
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Permission Baru</DialogTitle>
          <DialogDescription>Tambahkan permission baru untuk kontrol akses.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Nama</Label>
            <div className="col-span-3">
              <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="contoh: view reports" className={errors.name ? 'border-red-500' : ''} />
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
            <Button type="submit" disabled={isLoading}>{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Simpan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}