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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { Posisi } from '@/types';

interface PosisiEditProps {
  isOpen: boolean;
  onClose: () => void;
  posisiId: number;
}

export default function PosisiEdit({ isOpen, onClose, posisiId }: PosisiEditProps) {
  const [posisi, setPosisi] = useState<Posisi | null>(null);
  const [formData, setFormData] = useState({
    nama: '',
    urutan: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
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
      const response = await fetch(`/admin/posisis/${posisiId}/edit`);
      const data = await response.json();

      setPosisi(data.posisi);
      setFormData({
        nama: data.posisi.nama,
        urutan: data.posisi.urutan || '',
      });
    } catch (error) {
      console.error('Error loading posisi:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      await router.put(`/admin/posisis/${posisiId}`, formData, {
        onSuccess: () => {
          onClose();
        },
        onError: (errors) => {
          setErrors(errors);
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
      setFormData({ nama: '', urutan: '' });
      setErrors({});
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Posisi</DialogTitle>
          <DialogDescription>
            Perbarui informasi posisi.
          </DialogDescription>
        </DialogHeader>

        {isLoadingData ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nama" className="text-right">
                  Nama
                </Label>
                <div className="col-span-3">
                  <Input
                    id="nama"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    placeholder="Masukkan nama posisi"
                    className={errors.nama ? 'border-red-500' : ''}
                  />
                  {errors.nama && (
                    <p className="text-sm text-red-500 mt-1">{errors.nama}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="urutan" className="text-right">
                  Urutan
                </Label>
                <div className="col-span-3">
                  <Input
                    id="urutan"
                    value={formData.urutan}
                    onChange={(e) => setFormData({ ...formData, urutan: e.target.value })}
                    placeholder="Masukkan urutan posisi"
                    className={errors.urutan ? 'border-red-500' : ''}
                  />
                  {errors.urutan && (
                    <p className="text-sm text-red-500 mt-1">{errors.urutan}</p>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Perbarui
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}