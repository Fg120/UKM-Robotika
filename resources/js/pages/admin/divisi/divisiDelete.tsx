import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import { Divisi } from '@/types';

interface DivisiDeleteProps {
    isOpen: boolean;
    onClose: () => void;
    divisiId: number;
}

export default function DivisiDelete({ isOpen, onClose, divisiId }: DivisiDeleteProps) {
    const [divisi, setDivisi] = useState<Divisi | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);

    useEffect(() => { if (isOpen && divisiId) { loadDivisi(); } }, [isOpen, divisiId]);

    const loadDivisi = async () => {
        setIsLoadingData(true);
        try {
            const response = await fetch(`/admin/divisis/${divisiId}`);
            const data = await response.json();
            setDivisi(data.divisi);
        } catch (error) { console.error('Error loading divisi:', error); } finally { setIsLoadingData(false); }
    };

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            await router.delete(`/admin/divisis/${divisiId}`, {
                onSuccess: () => onClose(),
                onFinish: () => setIsLoading(false),
            });
        } catch (error) { setIsLoading(false); }
    };

    const handleClose = () => { if (!isLoading) { setDivisi(null); onClose(); } };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-red-500" /> Hapus Divisi</DialogTitle>
                    <DialogDescription>Apakah Anda yakin ingin menghapus divisi ini? Tindakan ini tidak dapat dibatalkan.</DialogDescription>
                </DialogHeader>

                {isLoadingData ? (
                    <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
                ) : divisi ? (
                    <div className="py-4 space-y-3">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center gap-3">
                                {divisi.image ? (
                                    <img src={`/storage/${divisi.image}`} alt={divisi.nama} className="h-12 w-12 rounded object-cover border" />
                                ) : (
                                    <div className="h-12 w-12 rounded border flex items-center justify-center text-gray-400"><ImageIcon className="h-5 w-5" /></div>
                                )}
                                <div>
                                    <h4 className="font-medium text-gray-900">{divisi.nama}</h4>
                                    {divisi.deskripsi && (<p className="text-sm text-gray-600 mt-1">{divisi.deskripsi}</p>)}
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Dibuat pada: {new Date(divisi.created_at).toLocaleDateString('id-ID')}</p>
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
