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
import { Kategori } from '@/types';

interface KategoriEditProps {
  isOpen: boolean;
  onClose: () => void;
  kategoriId: number;
}

export default function KategoriEdit({ isOpen, onClose, kategoriId }: KategoriEditProps) {
  const [kategori, setKategori] = useState<Kategori | null>(null);
  const [formData, setFormData] = useState({
    nama: '',
    deskripsi: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
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
      const response = await fetch(`/admin/kategoris/${kategoriId}/edit`);
      const data = await response.json();

      setKategori(data.kategori);
      setFormData({
        nama: data.kategori.nama,
        deskripsi: data.kategori.deskripsi || '',
      });
    } catch (error) {
      console.error('Error loading kategori:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      await router.put(`/admin/kategoris/${kategoriId}`, formData, {
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
      setKategori(null);
      setFormData({ nama: '', deskripsi: '' });
      setErrors({});
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Kategori</DialogTitle>
          <DialogDescription>
            Perbarui informasi kategori.
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
                    placeholder="Masukkan nama kategori"
                    className={errors.nama ? 'border-red-500' : ''}
                  />
                  {errors.nama && (
                    <p className="text-sm text-red-500 mt-1">{errors.nama}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="deskripsi" className="text-right pt-2">
                  Deskripsi
                </Label>
                <div className="col-span-3">
                  <Textarea
                    id="deskripsi"
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                    placeholder="Masukkan deskripsi kategori (opsional)"
                    rows={3}
                    className={errors.deskripsi ? 'border-red-500' : ''}
                  />
                  {errors.deskripsi && (
                    <p className="text-sm text-red-500 mt-1">{errors.deskripsi}</p>
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