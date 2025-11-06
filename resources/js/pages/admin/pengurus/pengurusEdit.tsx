import React, { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

interface Props { isOpen: boolean; onClose: () => void; pengurusId: number }

export default function PengurusEdit({ isOpen, onClose, pengurusId }: Props) {
  const [data, setData] = useState<any>(null);
  const [bidangs, setBidangs] = useState<{ id: number; nama: string }[]>([]);
  const [form, setForm] = useState<{ nama: string; posisi: 'Kepala' | 'Anggota' | ''; bidang_id: string; image: File | null; sosmeds: { platform: string; icon: string; url: string }[] }>({ nama: '', posisi: '', bidang_id: '', image: null, sosmeds: [] });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (isOpen && pengurusId) { load(); } else if (!isOpen) { setData(null); setErrors({}); } }, [isOpen, pengurusId]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/admin/pengurus/${pengurusId}/edit`); const json = await res.json();
      setData(json.pengurus); setBidangs(json.bidangs);
      setForm({ nama: json.pengurus.nama, posisi: json.pengurus.posisi, bidang_id: String(json.pengurus.bidang_id), image: null, sosmeds: (json.pengurus.sosmeds || []).map((s: any) => ({ platform: s.platform, icon: s.icon, url: s.url })) });
    } finally { setLoading(false); }
  };

  const addSosmed = () => setForm({ ...form, sosmeds: [...form.sosmeds, { platform: '', icon: '', url: '' }] });
  const removeSosmed = (i: number) => setForm({ ...form, sosmeds: form.sosmeds.filter((_, idx) => idx !== i) });
  const updateSosmed = (i: number, key: 'platform' | 'icon' | 'url', val: string) => {
    const next = [...form.sosmeds]; next[i] = { ...next[i], [key]: val }; if (key === 'platform') { const f = platforms.find(p => p.value === val); if (f) next[i].icon = f.icon; } setForm({ ...form, sosmeds: next });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setErrors({}); setLoading(true);
    const payload: any = { nama: form.nama, posisi: form.posisi, bidang_id: form.bidang_id, sosmeds: form.sosmeds.filter(s => s.platform && s.url) };
    if (form.image) payload.image = form.image;
    await router.post(`/admin/pengurus/${pengurusId}`, { ...payload, _method: 'put' }, { forceFormData: true, onSuccess: () => onClose(), onError: (e) => setErrors(e as any), onFinish: () => setLoading(false) });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Edit Pengurus</DialogTitle>
          <DialogDescription>Perbarui data pengurus.</DialogDescription>
        </DialogHeader>

        {loading ? (<div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>) : data ? (
          <form onSubmit={handleSubmit} className="grid gap-4 py-2">
            <div className="grid grid-cols-4 items-center gap-3">
              <Label className="text-right">Nama</Label>
              <div className="col-span-3"><Input value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} className={errors.nama ? 'border-red-500' : ''} /></div>
            </div>

            <div className="grid grid-cols-4 items-center gap-3">
              <Label className="text-right">Posisi</Label>
              <div className="col-span-3">
                <Select value={form.posisi} onValueChange={(v) => setForm({ ...form, posisi: v as any })}>
                  <SelectTrigger><SelectValue placeholder="Pilih posisi" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Kepala">Kepala</SelectItem>
                    <SelectItem value="Anggota">Anggota</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-3">
              <Label className="text-right">Bidang</Label>
              <div className="col-span-3">
                <Select value={form.bidang_id} onValueChange={(v) => setForm({ ...form, bidang_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Pilih bidang" /></SelectTrigger>
                  <SelectContent>
                    {bidangs.map(d => (<SelectItem key={d.id} value={String(d.id)}>{d.nama}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-3">
              <Label className="text-right">Foto</Label>
              <div className="col-span-3"><Input type="file" accept="image/*" onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })} /></div>
            </div>

            <div className="grid grid-cols-4 items-start gap-3">
              <Label className="text-right pt-2">Sosial Media</Label>
              <div className="col-span-3 space-y-2">
                {form.sosmeds.map((s, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <Select value={s.platform} onValueChange={(v) => updateSosmed(i, 'platform', v)}>
                      <SelectTrigger className="w-40"><SelectValue placeholder="Platform" /></SelectTrigger>
                      <SelectContent>
                        {platforms.map(p => (<SelectItem key={p.value} value={p.value}>{p.value}</SelectItem>))}
                      </SelectContent>
                    </Select>
                    <Input placeholder="URL" value={s.url} onChange={(e) => updateSosmed(i, 'url', e.target.value)} className="flex-1" />
                    <Button type="button" variant="outline" onClick={() => removeSosmed(i)}>Hapus</Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addSosmed}>Tambah Sosial Media</Button>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Batal</Button>
              <Button type="submit" disabled={loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Perbarui</Button>
            </DialogFooter>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}