import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

interface BidangCreateProps {
  isOpen: boolean;
  onClose: () => void;
  currentBidangId?: number;
}

export default function BidangCreate({ isOpen, onClose, currentBidangId }: BidangCreateProps) {
  const [formData, setFormData] = useState<{ nama: string; deskripsi: string; image: File | null; urutan: string }>({ nama: '', deskripsi: '', image: null, urutan: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const payload: any = {
      nama: formData.nama,
      deskripsi: formData.deskripsi,
      urutan: formData.urutan,
    };
    if (formData.image) payload.image = formData.image;

    try {
      await router.post('/admin/bidangs', payload, {
        forceFormData: true,
        onSuccess: () => {
          setFormData({ nama: '', deskripsi: '', image: null, urutan: '' });
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
      setFormData({ nama: '', deskripsi: '', image: null, urutan: '' });
      setErrors({});
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Tambah Bidang Baru</DialogTitle>
          <DialogDescription>Tambah bidang beserta gambar opsional.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nama" className="text-right">Nama</Label>
              <div className="col-span-3">
                <Input id="nama" value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })} placeholder="Masukkan nama bidang" className={errors.nama ? 'border-red-500' : ''} />
                {errors.nama && (<p className="text-sm text-red-500 mt-1">{errors.nama}</p>)}
              </div>
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="deskripsi" className="text-right pt-2">Deskripsi</Label>
              <div className="col-span-3">
                <Textarea id="deskripsi" value={formData.deskripsi} onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })} placeholder="Masukkan deskripsi (opsional)" rows={3} className={errors.deskripsi ? 'border-red-500' : ''} />
                {errors.deskripsi && (<p className="text-sm text-red-500 mt-1">{errors.deskripsi}</p>)}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">Gambar</Label>
              <div className="col-span-3">
                <Input id="image" type="file" accept="image/*" onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })} />
                {errors.image && (<p className="text-sm text-red-500 mt-1">{errors.image}</p>)}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="urutan" className="text-right">Urutan</Label>
              <div className="col-span-3">
                <Input id="urutan" type="number" value={formData.urutan} onChange={(e) => setFormData({ ...formData, urutan: e.target.value })} placeholder="Masukkan urutan bidang" className={errors.urutan ? 'border-red-500' : ''} />
                {errors.urutan && (<p className="text-sm text-red-500 mt-1">{errors.urutan}</p>)}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>Batal</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Simpan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog >
  );
}