import { useEffect, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
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

interface SponsorEditProps {
    sponsorId: number;
    open: boolean;
    onClose: () => void;
}

interface Sponsor {
    id: number;
    judul: string;
    deskripsi?: string;
    url?: string;
    foto?: string;
}

export default function SponsorEdit({
    sponsorId,
    open,
    onClose,
}: SponsorEditProps) {
    const { props } = usePage();
    const [sponsor, setSponsor] = useState<Sponsor | null>(null);
    const [formData, setFormData] = useState({
        judul: '',
        deskripsi: '',
        url: '',
        foto: null as File | null,
    });
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (open && sponsorId) {
            // Fetch sponsor data
            console.log('Fetching sponsor data for ID:', sponsorId);
            fetch(route('admin.sponsor.show', sponsorId))
                .then(res => {
                    console.log('Response status:', res.status);
                    return res.json();
                })
                .then(data => {
                    console.log('Fetched data:', data);
                    if (data.sponsor) {
                        setSponsor(data.sponsor);
                        setFormData({
                            judul: data.sponsor.judul,
                            deskripsi: data.sponsor.deskripsi || '',
                            url: data.sponsor.url || '',
                            foto: null,
                        });
                        if (data.sponsor.foto) {
                            setPreview(`/storage/${data.sponsor.foto}`);
                        }
                    } else {
                        console.error('Sponsor data missing in response');
                    }
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Error fetching sponsor:', err);
                    setLoading(false);
                });
        }
    }, [open, sponsorId]);

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
        setSubmitting(true);

        const form = new FormData();
        form.append('_method', 'PUT');
        form.append('judul', formData.judul);
        form.append('deskripsi', formData.deskripsi);
        form.append('url', formData.url);
        if (formData.foto) {
            form.append('foto', formData.foto);
        }

        router.post(route('admin.sponsor.update', sponsorId), form, {
            onSuccess: () => {
                setFormData({ judul: '', deskripsi: '', url: '', foto: null });
                setPreview(null);
                setSubmitting(false);
                onClose();
            },
            onError: () => {
                setSubmitting(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Sponsor</DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="text-center py-8">
                        <p className="text-gray-600">Memuat data...</p>
                    </div>
                ) : (
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
                                disabled={submitting}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                disabled={submitting}
                            >
                                {submitting ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
