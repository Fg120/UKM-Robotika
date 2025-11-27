import { useState } from 'react';
import { router } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface SponsorCreateProps {
    open: boolean;
    onClose: () => void;
}

export default function SponsorCreate({ open, onClose }: SponsorCreateProps) {
    const [formData, setFormData] = useState({
        judul: '',
        deskripsi: '',
        url: '',
        foto: null as File | null,
    });
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({ ...prev, foto: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const form = new FormData();
        form.append('judul', formData.judul);
        form.append('deskripsi', formData.deskripsi);
        form.append('url', formData.url);
        if (formData.foto) {
            form.append('foto', formData.foto);
        }

        router.post(route('admin.sponsor.store'), form, {
            onSuccess: () => {
                setFormData({ judul: '', deskripsi: '', url: '', foto: null });
                setPreview(null);
                setLoading(false);
                onClose();
            },
            onError: () => {
                setLoading(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Tambah Sponsor Baru</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Judul */}
                    <div>
                        <Label htmlFor="judul">Judul *</Label>
                        <Input
                            id="judul"
                            name="judul"
                            type="text"
                            value={formData.judul}
                            onChange={handleChange}
                            placeholder="Nama sponsor"
                            required
                        />
                    </div>

                    {/* Deskripsi */}
                    <div>
                        <Label htmlFor="deskripsi">Deskripsi</Label>
                        <Textarea
                            id="deskripsi"
                            name="deskripsi"
                            value={formData.deskripsi}
                            onChange={handleChange}
                            placeholder="Deskripsi sponsor"
                            rows={3}
                        />
                    </div>

                    {/* URL */}
                    <div>
                        <Label htmlFor="url">URL</Label>
                        <Input
                            id="url"
                            name="url"
                            type="url"
                            value={formData.url}
                            onChange={handleChange}
                            placeholder="https://example.com"
                        />
                    </div>

                    {/* Foto */}
                    <div>
                        <Label htmlFor="foto">Foto</Label>
                        <Input
                            id="foto"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="cursor-pointer"
                        />
                        {preview && (
                            <div className="mt-2">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-full h-auto rounded max-h-48 object-cover"
                                />
                            </div>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={loading}
                        >
                            {loading ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
