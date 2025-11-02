import React, { useState, useMemo } from 'react';
import { router } from '@inertiajs/react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

const platforms = [
  { value: 'Facebook', icon: 'Facebook' },
  { value: 'Instagram', icon: 'Instagram' },
  { value: 'Twitter', icon: 'Twitter' },
  { value: 'Linkedin', icon: 'Linkedin' },
  { value: 'Youtube', icon: 'Youtube' },
  { value: 'Website', icon: 'Globe' },
  { value: 'Link', icon: 'Link' },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  divisis: { id:number; nama:string }[];
  selectedDivisi: string;
}

export default function PengurusCreate({ isOpen, onClose, divisis, selectedDivisi }: Props) {
  const [formData, setFormData] = useState<{ nama:string; posisi:'Kepala'|'Anggota'|''; divisi_id:string; sub_divisi_id:string; image:File|null; sosmeds:{platform:string; icon:string; url:string}[] }>({ nama:'', posisi:'', divisi_id: selectedDivisi && selectedDivisi!=='all' ? selectedDivisi : '', sub_divisi_id:'', image:null, sosmeds:[] });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [subDivisis, setSubDivisis] = useState<{id:number; nama:string}[]>([]);

  const loadSubDivisis = async (divisiId: string) => {
    if (!divisiId) { setSubDivisis([]); return; }
    try { const res = await fetch(`/admin/subdivisis?divisi_id=${divisiId}`); const html = await res.text(); /* fallback no API */ } catch {}
  };

  const addSosmed = () => setFormData({ ...formData, sosmeds: [...formData.sosmeds, { platform:'', icon:'', url:'' }] });
  const removeSosmed = (i:number) => setFormData({ ...formData, sosmeds: formData.sosmeds.filter((_,idx)=> idx!==i) });
  const updateSosmed = (i:number, key:'platform'|'icon'|'url', val:string) => {
    const next = [...formData.sosmeds];
    next[i] = { ...next[i], [key]: val };
    if (key==='platform') {
      const found = platforms.find(p=>p.value===val); if (found) next[i].icon = found.icon;
    }
    setFormData({ ...formData, sosmeds: next });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setIsLoading(true); setErrors({});
    const payload:any = { nama: formData.nama, posisi: formData.posisi, divisi_id: formData.divisi_id, sub_divisi_id: formData.sub_divisi_id || undefined };
    if (formData.image) payload.image = formData.image;
    if (formData.sosmeds.length) payload.sosmeds = formData.sosmeds.filter(s => s.platform && s.url);
    try {
      await router.post('/admin/pengurus', { ...payload }, { forceFormData: true, onSuccess: () => { setFormData({ nama:'', posisi:'', divisi_id:selectedDivisi!=='all'?selectedDivisi:'', sub_divisi_id:'', image:null, sosmeds:[] }); onClose(); }, onError: (e)=> setErrors(e as any), onFinish: ()=> setIsLoading(false) });
    } catch { setIsLoading(false); }
  };

  const handleClose = () => { if (!isLoading) { onClose(); setErrors({}); } };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Tambah Pengurus</DialogTitle>
          <DialogDescription>Tambahkan pengurus untuk divisi terkait.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          <div className="grid grid-cols-4 items-center gap-3">
            <Label className="text-right">Nama</Label>
            <div className="col-span-3">
              <Input value={formData.nama} onChange={(e)=> setFormData({ ...formData, nama: e.target.value })} className={errors.nama? 'border-red-500':''} placeholder="Nama pengurus" />
              {errors.nama && <p className="text-sm text-red-500 mt-1">{errors.nama}</p>}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-3">
            <Label className="text-right">Posisi</Label>
            <div className="col-span-3">
              <Select value={formData.posisi} onValueChange={(v)=> setFormData({ ...formData, posisi: v as any })}>
                <SelectTrigger><SelectValue placeholder="Pilih posisi" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Kepala">Kepala</SelectItem>
                  <SelectItem value="Anggota">Anggota</SelectItem>
                </SelectContent>
              </Select>
              {errors.posisi && <p className="text-sm text-red-500 mt-1">{errors.posisi}</p>}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-3">
            <Label className="text-right">Divisi</Label>
            <div className="col-span-3">
              <Select value={formData.divisi_id} onValueChange={(v)=> { setFormData({ ...formData, divisi_id:v, sub_divisi_id:'' }); loadSubDivisis(v); }}>
                <SelectTrigger><SelectValue placeholder="Pilih divisi" /></SelectTrigger>
                <SelectContent>
                  {divisis.map(d => (<SelectItem key={d.id} value={String(d.id)}>{d.nama}</SelectItem>))}
                </SelectContent>
              </Select>
              {errors.divisi_id && <p className="text-sm text-red-500 mt-1">{errors.divisi_id}</p>}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-3">
            <Label className="text-right">Sub Divisi</Label>
            <div className="col-span-3">
              <Select value={formData.sub_divisi_id} onValueChange={(v)=> setFormData({ ...formData, sub_divisi_id: v })}>
                <SelectTrigger><SelectValue placeholder="Pilih sub divisi (opsional)" /></SelectTrigger>
                <SelectContent>
                  {subDivisis.map(sd => (<SelectItem key={sd.id} value={String(sd.id)}>{sd.nama}</SelectItem>))}
                </SelectContent>
              </Select>
              {errors.sub_divisi_id && <p className="text-sm text-red-500 mt-1">{errors.sub_divisi_id}</p>}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-3">
            <Label className="text-right">Foto</Label>
            <div className="col-span-3">
              <Input type="file" accept="image/*" onChange={(e)=> setFormData({ ...formData, image: e.target.files?.[0] || null })} />
              {errors.image && <p className="text-sm text-red-500 mt-1">{errors.image}</p>}
            </div>
          </div>

          <div className="grid grid-cols-4 items-start gap-3">
            <Label className="text-right pt-2">Sosial Media</Label>
            <div className="col-span-3 space-y-2">
              {formData.sosmeds.map((s, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Select value={s.platform} onValueChange={(v)=> updateSosmed(i, 'platform', v)}>
                    <SelectTrigger className="w-40"><SelectValue placeholder="Platform" /></SelectTrigger>
                    <SelectContent>
                      {platforms.map(p => (<SelectItem key={p.value} value={p.value}>{p.value}</SelectItem>))}
                    </SelectContent>
                  </Select>
                  <Input placeholder="URL" value={s.url} onChange={(e)=> updateSosmed(i, 'url', e.target.value)} className="flex-1" />
                  <Button type="button" variant="outline" onClick={()=> removeSosmed(i)}>Hapus</Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addSosmed}>Tambah Sosial Media</Button>
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