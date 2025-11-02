import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface GaleriCreateProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GaleriCreate({ isOpen, onClose }: GaleriCreateProps) {
  const [formData, setFormData] = useState<{ judul: string; tanggal: string; image: File | null }>({ judul: '', tanggal: '', image: null });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const payload: any = {
      judul: formData.judul,
      tanggal: formData.tanggal,
    };
    if (formData.image) payload.image = formData.image;

    try {
      await router.post('/admin/galeris', payload, {
        forceFormData: true,
        onSuccess: () => {
          setFormData({ judul: '', tanggal: '', image: null });
          onClose();
        },
        onError: (err) => setErrors(err as any),
        onFinish: () => setIsLoading(false),
      });
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({ judul: '', tanggal: '', image: null });
      setErrors({});
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Tambah Galeri Baru</DialogTitle>
          <DialogDescription>Tambah entri galeri beserta tanggal dan gambar.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="judul" className="text-right">Judul</Label>
              <div className="col-span-3">
                <Input id="judul" value={formData.judul} onChange={(e) => setFormData({ ...formData, judul: e.target.value })} placeholder="Masukkan judul" className={errors.judul ? 'border-red-500' : ''} />
                {errors.judul && (<p className="text-sm text-red-500 mt-1">{errors.judul}</p>)}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tanggal" className="text-right">Tanggal</Label>
              <div className="col-span-3">
                <Input id="tanggal" type="date" value={formData.tanggal} onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })} className={errors.tanggal ? 'border-red-500' : ''} />
                {errors.tanggal && (<p className="text-sm text-red-500 mt-1">{errors.tanggal}</p>)}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">Gambar</Label>
              <div className="col-span-3">
                <Input id="image" type="file" accept="image/*" onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })} />
                {errors.image && (<p className="text-sm text-red-500 mt-1">{errors.image}</p>)}
              </div>
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

