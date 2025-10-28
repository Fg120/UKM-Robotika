import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Kategori } from '@/types';

interface KategoriDeleteProps {
  isOpen: boolean;
  onClose: () => void;
  kategoriId: number;
}

export default function KategoriDelete({ isOpen, onClose, kategoriId }: KategoriDeleteProps) {
  const [kategori, setKategori] = useState<Kategori | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    if (isOpen && kategoriId) {
      loadKategori();
    }
  }, [isOpen, kategoriId]);

  const loadKategori = async () => {
    setIsLoadingData(true);
    try {
      const response = await fetch(`/admin/kategoris/${kategoriId}`);
      const data = await response.json();
      setKategori(data.kategori);
    } catch (error) {
      console.error('Error loading kategori:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await router.delete(`/admin/kategoris/${kategoriId}`, {
        onSuccess: () => {
          onClose();
        },
        onFinish: () => {
          setIsLoading(false);
        },
      });
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setKategori(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Hapus Kategori
          </DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus kategori ini? Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>

        {isLoadingData ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : kategori ? (
          <div className="py-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900">{kategori.nama}</h4>
              {kategori.deskripsi && (
                <p className="text-sm text-gray-600 mt-1">{kategori.deskripsi}</p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Dibuat pada: {new Date(kategori.created_at).toLocaleDateString('id-ID')}
              </p>
            </div>

            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Perhatian:</strong> Menghapus kategori ini akan mempengaruhi artikel yang terkait.
                Pastikan tidak ada artikel yang masih menggunakan kategori ini.
              </p>
            </div>
          </div>
        ) : null}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}