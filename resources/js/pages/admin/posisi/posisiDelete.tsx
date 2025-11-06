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
import { Posisi } from '@/types';

interface PosisiDeleteProps {
  isOpen: boolean;
  onClose: () => void;
  posisiId: number;
}

export default function PosisiDelete({ isOpen, onClose, posisiId }: PosisiDeleteProps) {
  const [posisi, setPosisi] = useState<Posisi | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    if (isOpen && posisiId) {
      loadPosisi();
    }
  }, [isOpen, posisiId]);

  const loadPosisi = async () => {
    setIsLoadingData(true);
    try {
      const response = await fetch(`/admin/posisis/${posisiId}`);
      const data = await response.json();
      setPosisi(data.posisi);
    } catch (error) {
      console.error('Error loading posisi:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await router.delete(`/admin/posisis/${posisiId}`, {
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
      setPosisi(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Hapus Posisi
          </DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus posisi ini? Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>

        {isLoadingData ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : posisi ? (
          <div className="py-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900">{posisi.nama}</h4>
              {posisi.urutan && (
                <p className="text-sm text-gray-600 mt-1">{posisi.urutan}</p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Dibuat pada: {new Date(posisi.created_at).toLocaleDateString('id-ID')}
              </p>
            </div>

            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Perhatian:</strong> Menghapus posisi ini akan mempengaruhi artikel yang terkait.
                Pastikan tidak ada artikel yang masih menggunakan posisi ini.
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