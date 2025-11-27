import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface SponsorDeleteProps {
    sponsorId: number;
    open: boolean;
    onClose: () => void;
}

interface Sponsor {
    id: number;
    judul: string;
    deskripsi?: string;
    foto?: string;
}

export default function SponsorDelete({
    sponsorId,
    open,
    onClose,
}: SponsorDeleteProps) {
    const [sponsor, setSponsor] = useState<Sponsor | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (open && sponsorId) {
            fetch(route('admin.sponsor.show', sponsorId))
                .then(res => res.json())
                .then(data => {
                    setSponsor(data.sponsor);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    }, [open, sponsorId]);

    const handleDelete = () => {
        setDeleting(true);
        router.delete(route('admin.sponsor.destroy', sponsorId), {
            onSuccess: () => {
                setDeleting(false);
                onClose();
            },
            onError: () => {
                setDeleting(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Hapus Sponsor</DialogTitle>
                    <DialogDescription>
                        Apakah Anda yakin ingin menghapus sponsor ini?
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="text-center py-8">
                        <p className="text-gray-600">Memuat data...</p>
                    </div>
                ) : sponsor ? (
                    <div className="space-y-4">
                        {/* Preview */}
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                            {sponsor.foto && (
                                <img
                                    src={`/storage/${sponsor.foto}`}
                                    alt={sponsor.judul}
                                    className="w-full h-32 object-cover rounded"
                                />
                            )}
                            <p className="font-semibold text-gray-900">
                                {sponsor.judul}
                            </p>
                            {sponsor.deskripsi && (
                                <p className="text-sm text-gray-600 line-clamp-2">
                                    {sponsor.deskripsi}
                                </p>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={deleting}
                            >
                                Batal
                            </Button>
                            <Button
                                type="button"
                                className="bg-red-600 hover:bg-red-700 text-white"
                                onClick={handleDelete}
                                disabled={deleting}
                            >
                                {deleting ? 'Menghapus...' : 'Hapus'}
                            </Button>
                        </div>
                    </div>
                ) : null}
            </DialogContent>
        </Dialog>
    );
}
