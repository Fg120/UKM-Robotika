import React, { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import { Galeri } from '@/types';

interface GaleriDeleteProps {
  isOpen: boolean;
  onClose: () => void;
  galeriId: number;
}

export default function GaleriDelete({ isOpen, onClose, galeriId }: GaleriDeleteProps) {
  const [galeri, setGaleri] = useState<Galeri | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => { if (isOpen && galeriId) { loadGaleri(); } }, [isOpen, galeriId]);

  const loadGaleri = async () => {
    setIsLoadingData(true);
    try {
      const response = await fetch(`/admin/galeris/${galeriId}`);
      const data = await response.json();
      setGaleri(data.galeri);
    } catch (error) {
      console.error('Error loading galeri:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await router.delete(`/admin/galeris/${galeriId}`, {
        onSuccess: () => onClose(),
        onFinish: () => setIsLoading(false),
      });
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleClose = () => { if (!isLoading) { setGaleri(null); onClose(); } };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-red-500" /> Hapus Galeri</DialogTitle>
          <DialogDescription>Apakah Anda yakin ingin menghapus galeri ini? Tindakan ini tidak dapat dibatalkan.</DialogDescription>
        </DialogHeader>

        {isLoadingData ? (
          <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
        ) : galeri ? (
          <div className="py-4 space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                {galeri.image ? (
                  <img src={`/storage/${galeri.image}`} alt={galeri.judul} className="h-12 w-12 rounded object-cover border" />
                ) : (
                  <div className="h-12 w-12 rounded border flex items-center justify-center text-gray-400"><ImageIcon className="h-5 w-5" /></div>
                )}
                <div>
                  <h4 className="font-medium text-gray-900">{galeri.judul}</h4>
                  <p className="text-xs text-gray-600 mt-1">Tanggal: {new Date(galeri.tanggal).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Dibuat pada: {new Date(galeri.created_at).toLocaleDateString('id-ID')}</p>
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

