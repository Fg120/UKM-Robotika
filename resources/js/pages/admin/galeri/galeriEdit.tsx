import React, { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import { Galeri } from '@/types';

interface GaleriEditProps {
  isOpen: boolean;
  onClose: () => void;
  galeriId: number;
}

export default function GaleriEdit({ isOpen, onClose, galeriId }: GaleriEditProps) {
  const [galeri, setGaleri] = useState<Galeri | null>(null);
  const [formData, setFormData] = useState<{ judul: string; tanggal: string; image: File | null }>({ judul: '', tanggal: '', image: null });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => { if (isOpen && galeriId) { loadGaleri(); } }, [isOpen, galeriId]);

  const loadGaleri = async () => {
    setIsLoadingData(true);
    try {
      const response = await fetch(`/admin/galeris/${galeriId}/edit`);
      const data = await response.json();
      const g: Galeri = data.galeri;
      setGaleri(g);
      setFormData({ judul: g.judul || '', tanggal: g.tanggal ? g.tanggal.substring(0,10) : '', image: null });
    } catch (error) {
      console.error('Error loading galeri:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    const payload: any = { judul: formData.judul, tanggal: formData.tanggal, _method: 'put' };
    if (formData.image) payload.image = formData.image;

    try {
      await router.post(`/admin/galeris/${galeriId}`, payload, {
        forceFormData: true,
        onSuccess: () => onClose(),
        onError: (err) => setErrors(err as any),
        onFinish: () => setIsLoading(false),
      });
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) { setGaleri(null); setFormData({ judul: '', tanggal: '', image: null }); setErrors({}); onClose(); }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Galeri</DialogTitle>
          <DialogDescription>Perbarui informasi galeri.</DialogDescription>
        </DialogHeader>

        {isLoadingData ? (
          <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
        ) : (
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

              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="image" className="text-right pt-2">Gambar</Label>
                <div className="col-span-3 space-y-2">
                  {galeri?.image ? (
                    <img src={`/storage/${galeri.image}`} alt={galeri.judul} className="h-16 w-16 rounded object-cover border" />
                  ) : (
                    <div className="h-16 w-16 rounded border flex items-center justify-center text-gray-400"><ImageIcon className="h-6 w-6" /></div>
                  )}
                  <Input id="image" type="file" accept="image/*" onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })} />
                  {errors.image && (<p className="text-sm text-red-500 mt-1">{errors.image}</p>)}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>Batal</Button>
              <Button type="submit" disabled={isLoading}>{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Perbarui</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

