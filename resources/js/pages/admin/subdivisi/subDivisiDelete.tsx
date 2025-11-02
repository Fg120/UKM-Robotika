import React, { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import { SubDivisi } from '@/types';

interface Props { isOpen: boolean; onClose: () => void; subDivisiId: number; }

export default function SubDivisiDelete({ isOpen, onClose, subDivisiId }: Props) {
  const [subDivisi, setSubDivisi] = useState<SubDivisi | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => { if (isOpen && subDivisiId) { loadSubDivisi(); } }, [isOpen, subDivisiId]);

  const loadSubDivisi = async () => {
    setIsLoadingData(true);
    try {
      const response = await fetch(`/admin/subdivisis/${subDivisiId}`);
      const data = await response.json();
      setSubDivisi(data.subDivisi);
    } catch (error) { console.error('Error loading sub divisi:', error); } finally { setIsLoadingData(false); }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await router.delete(`/admin/subdivisis/${subDivisiId}`, { onSuccess: () => onClose(), onFinish: () => setIsLoading(false) });
    } catch (error) { setIsLoading(false); }
  };

  const handleClose = () => { if (!isLoading) { setSubDivisi(null); onClose(); } };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-red-500" /> Hapus Sub Divisi</DialogTitle>
          <DialogDescription>Apakah Anda yakin ingin menghapus sub divisi ini? Tindakan ini tidak dapat dibatalkan.</DialogDescription>
        </DialogHeader>

        {isLoadingData ? (
          <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
        ) : subDivisi ? (
          <div className="py-4 space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                {subDivisi.image ? (
                  <img src={`/storage/${subDivisi.image}`} alt={subDivisi.nama} className="h-12 w-12 rounded object-cover border" />
                ) : (
                  <div className="h-12 w-12 rounded border flex items-center justify-center text-gray-400"><ImageIcon className="h-5 w-5" /></div>
                )}
                <div>
                  <h4 className="font-medium text-gray-900">{subDivisi.nama}</h4>
                  {subDivisi.deskripsi && (<p className="text-sm text-gray-600 mt-1">{subDivisi.deskripsi}</p>)}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Dibuat pada: {new Date(subDivisi.created_at).toLocaleDateString('id-ID')}</p>
            </div>
          </div>
        ) : null}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>Batal</Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}