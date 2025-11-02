import React, { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import { Produk } from '@/types';

interface ProdukDeleteProps {
  isOpen: boolean;
  onClose: () => void;
  produkId: number;
}

export default function ProdukDelete({ isOpen, onClose, produkId }: ProdukDeleteProps) {
  const [produk, setProduk] = useState<Produk | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => { if (isOpen && produkId) { loadProduk(); } }, [isOpen, produkId]);

  const loadProduk = async () => {
    setIsLoadingData(true);
    try {
      const response = await fetch(`/admin/produks/${produkId}`);
      const data = await response.json();
      setProduk(data.produk);
    } catch (error) {
      console.error('Error loading produk:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await router.delete(`/admin/produks/${produkId}`, {
        onSuccess: () => onClose(),
        onFinish: () => setIsLoading(false),
      });
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleClose = () => { if (!isLoading) { setProduk(null); onClose(); } };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-red-500" /> Hapus Produk</DialogTitle>
          <DialogDescription>Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.</DialogDescription>
        </DialogHeader>

        {isLoadingData ? (
          <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
        ) : produk ? (
          <div className="py-4 space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                {produk.image ? (
                  <img src={`/storage/${produk.image}`} alt={produk.nama} className="h-12 w-12 rounded object-cover border" />
                ) : (
                  <div className="h-12 w-12 rounded border flex items-center justify-center text-gray-400"><ImageIcon className="h-5 w-5" /></div>
                )}
                <div>
                  <h4 className="font-medium text-gray-900">{produk.nama}</h4>
                  {produk.keterangan && (<p className="text-sm text-gray-600 mt-1">{produk.keterangan}</p>)}
                  <p className="text-xs text-gray-600 mt-1">URL: <a href={produk.url} target="_blank" className="text-blue-600 underline" rel="noreferrer">{produk.url}</a></p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Dibuat pada: {new Date(produk.created_at).toLocaleDateString('id-ID')}</p>
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

