import React, { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface Props { isOpen:boolean; onClose:()=>void; pengurusId:number }

export default function PengurusDelete({ isOpen, onClose, pengurusId }: Props) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{ if(isOpen && pengurusId){ load(); } else if(!isOpen){ setData(null); } },[isOpen, pengurusId]);
  const load = async () => { try { const res = await fetch(`/admin/pengurus/${pengurusId}`); const json = await res.json(); setData(json.pengurus); } catch {} };

  const handleDelete = async () => {
    setLoading(true);
    try { await router.delete(`/admin/pengurus/${pengurusId}`, { onSuccess: ()=> onClose(), onFinish: ()=> setLoading(false) }); } catch { setLoading(false); }
  };

  const handleClose = () => { if(!loading){ onClose(); } };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Hapus Pengurus</DialogTitle>
          <DialogDescription>Yakin ingin menghapus pengurus ini? Tindakan tidak dapat dibatalkan.</DialogDescription>
        </DialogHeader>
        <div className="py-2">
          {data ? (<div className="bg-gray-50 p-3 rounded"><div className="font-medium">{data.nama}</div><div className="text-sm text-gray-500">{data.posisi}</div></div>) : 'Memuat...'}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>Batal</Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Hapus</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}