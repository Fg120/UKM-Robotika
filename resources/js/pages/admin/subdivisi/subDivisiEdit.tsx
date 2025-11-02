import React, { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import { Divisi, SubDivisi } from '@/types';

interface Props { isOpen: boolean; onClose: () => void; subDivisiId: number; }

export default function SubDivisiEdit({ isOpen, onClose, subDivisiId }: Props) {
  const [subDivisi, setSubDivisi] = useState<SubDivisi | null>(null);
  const [divisis, setDivisis] = useState<Pick<Divisi, 'id' | 'nama'>[]>([]);
  const [formData, setFormData] = useState<{ divisi_id: string; nama: string; deskripsi: string; image: File | null }>({ divisi_id: '', nama: '', deskripsi: '', image: null });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => { if (isOpen && subDivisiId) { loadData(); } }, [isOpen, subDivisiId]);

  const loadData = async () => {
    setIsLoadingData(true);
    try {
      const response = await fetch(`/admin/subdivisis/${subDivisiId}/edit`);
      const data = await response.json();
      setSubDivisi(data.subDivisi);
      setDivisis(data.divisis);
      setFormData({ divisi_id: String(data.subDivisi.divisi_id), nama: data.subDivisi.nama, deskripsi: data.subDivisi.deskripsi || '', image: null });
    } catch (error) { console.error('Error loading subdivisi:', error); } finally { setIsLoadingData(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    const payload: any = { divisi_id: formData.divisi_id, nama: formData.nama, deskripsi: formData.deskripsi };
    if (formData.image) payload.image = formData.image;

    try {
      await router.post(`/admin/subdivisis/${subDivisiId}`, { ...payload, _method: 'put' }, {
        forceFormData: true,
        onSuccess: () => onClose(),
        onError: (err) => setErrors(err as any),
        onFinish: () => setIsLoading(false),
      });
    } catch (error) { setIsLoading(false); }
  };

  const handleClose = () => { if (!isLoading) { setSubDivisi(null); setFormData({ divisi_id: '', nama: '', deskripsi: '', image: null }); setErrors({}); onClose(); } };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Sub Divisi</DialogTitle>
          <DialogDescription>Perbarui informasi sub divisi.</DialogDescription>
        </DialogHeader>

        {isLoadingData ? (
          <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Divisi</Label>
                <div className="col-span-3">
                  <Select value={formData.divisi_id} onValueChange={(val) => setFormData({ ...formData, divisi_id: val })}>
                    <SelectTrigger><SelectValue placeholder="Pilih divisi" /></SelectTrigger>
                    <SelectContent>
                      {divisis.map(d => (<SelectItem key={d.id} value={String(d.id)}>{d.nama}</SelectItem>))}
                    </SelectContent>
                  </Select>
                  {errors.divisi_id && (<p className="text-sm text-red-500 mt-1">{errors.divisi_id}</p>)}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nama" className="text-right">Nama</Label>
                <div className="col-span-3">
                  <Input id="nama" value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })} placeholder="Masukkan nama sub divisi" className={errors.nama ? 'border-red-500' : ''} />
                  {errors.nama && (<p className="text-sm text-red-500 mt-1">{errors.nama}</p>)}
                </div>
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="deskripsi" className="text-right pt-2">Deskripsi</Label>
                <div className="col-span-3">
                  <Textarea id="deskripsi" value={formData.deskripsi} onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })} rows={3} placeholder="Masukkan deskripsi (opsional)" className={errors.deskripsi ? 'border-red-500' : ''} />
                  {errors.deskripsi && (<p className="text-sm text-red-500 mt-1">{errors.deskripsi}</p>)}
                </div>
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="image" className="text-right pt-2">Gambar</Label>
                <div className="col-span-3 space-y-2">
                  {subDivisi?.image ? (
                    <img src={`/storage/${subDivisi.image}`} alt={subDivisi.nama} className="h-16 w-16 rounded object-cover border" />
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