import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

interface ProdukCreateProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProdukCreate({ isOpen, onClose }: ProdukCreateProps) {
  const [formData, setFormData] = useState<{ nama: string; keterangan: string; url: string; image: File | null; aktif: '1' | '0' }>({ nama: '', keterangan: '', url: '', image: null, aktif: '1' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const payload: any = {
      nama: formData.nama,
      keterangan: formData.keterangan,
      url: formData.url,
      aktif: formData.aktif,
    };
    if (formData.image) payload.image = formData.image;

    try {
      await router.post('/admin/produks', payload, {
        forceFormData: true,
        onSuccess: () => {
          setFormData({ nama: '', keterangan: '', url: '', image: null, aktif: '1' });
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
      setFormData({ nama: '', keterangan: '', url: '', image: null, aktif: '1' });
      setErrors({});
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Tambah Produk Baru</DialogTitle>
          <DialogDescription>Tambah produk beserta gambar, URL, dan status aktif.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nama" className="text-right">Nama</Label>
              <div className="col-span-3">
                <Input id="nama" value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })} placeholder="Masukkan nama produk" className={errors.nama ? 'border-red-500' : ''} />
                {errors.nama && (<p className="text-sm text-red-500 mt-1">{errors.nama}</p>)}
              </div>
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="keterangan" className="text-right pt-2">Keterangan</Label>
              <div className="col-span-3">
                <Textarea id="keterangan" value={formData.keterangan} onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })} placeholder="Masukkan keterangan (opsional)" rows={3} className={errors.keterangan ? 'border-red-500' : ''} />
                {errors.keterangan && (<p className="text-sm text-red-500 mt-1">{errors.keterangan}</p>)}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url" className="text-right">URL</Label>
              <div className="col-span-3">
                <Input id="url" value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} placeholder="https://contoh.com" className={errors.url ? 'border-red-500' : ''} />
                {errors.url && (<p className="text-sm text-red-500 mt-1">{errors.url}</p>)}
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
              <Label htmlFor="aktif" className="text-right">Aktif</Label>
              <div className="col-span-3">
                <select id="aktif" value={formData.aktif} onChange={(e) => setFormData({ ...formData, aktif: e.target.value as '1' | '0' })} className={`w-full border rounded px-3 py-2 ${errors.aktif ? 'border-red-500' : ''}`}>
                  <option value="1">Ya</option>
                  <option value="0">Tidak</option>
                </select>
                {errors.aktif && (<p className="text-sm text-red-500 mt-1">{errors.aktif}</p>)}
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

