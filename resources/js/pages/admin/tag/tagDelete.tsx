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
import { Loader2 } from 'lucide-react';
import { Tag as TagType } from '@/types';

interface TagDeleteProps {
  isOpen: boolean;
  onClose: () => void;
  tagId: number;
}

export default function TagDelete({ isOpen, onClose, tagId }: TagDeleteProps) {
  const [tag, setTag] = useState<TagType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && tagId) {
      loadTag();
    }
  }, [isOpen, tagId]);

  const loadTag = async () => {
    try {
      const response = await fetch(`/admin/tags/${tagId}`);
      const data = await response.json();
      setTag(data.tag);
    } catch (error) {
      // noop
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await router.delete(`/admin/tags/${tagId}`, {
        onSuccess: () => {
          setTag(null);
          onClose();
        },
        onFinish: () => setIsLoading(false),
      });
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setTag(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Hapus Tag</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus tag ini? Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {tag ? (
            <p>
              Tag: <span className="font-semibold">{tag.nama}</span>
            </p>
          ) : (
            <p>Memuat data tag...</p>
          )}
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
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

