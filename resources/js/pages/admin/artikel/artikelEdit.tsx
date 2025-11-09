import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Artikel, Kategori, Tag } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Loader2, X, ArrowLeft } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import CKEditorComponent from '@/components/CKEditorComponent';

interface Props {
    artikel: Artikel & { tags: Pick<Tag, 'id' | 'nama'>[] };
    kategoris: Pick<Kategori, 'id' | 'nama'>[];
    tags: Pick<Tag, 'id' | 'nama'>[];
}

export default function ArtikelEdit({ artikel, kategoris, tags }: Props) {
    const [formData, setFormData] = useState({
        judul: artikel.judul,
        slug: artikel.slug,
        excerpt: artikel.excerpt || '',
        konten: artikel.konten,
        image: null as File | null,
        kategori_id: artikel.kategori_id ? String(artikel.kategori_id) : '',
        tags: artikel.tags.map(t => t.id),
        published: !!artikel.published,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        const payload: any = {
            _method: 'PUT',
            judul: formData.judul,
            slug: formData.slug || undefined,
            excerpt: formData.excerpt || undefined,
            konten: formData.konten,
            kategori_id: formData.kategori_id || undefined,
            tags: formData.tags.length > 0 ? formData.tags : undefined,
            published: formData.published,
        };

        if (formData.image) {
            payload.image = formData.image;
        }

        router.post(`/admin/artikel/${artikel.id}`, payload, {
            forceFormData: true,
            onError: (e) => setErrors(e as any),
            onFinish: () => setIsLoading(false),
        });
    };

    const toggleTag = (tagId: number) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.includes(tagId)
                ? prev.tags.filter(id => id !== tagId)
                : [...prev.tags, tagId]
        }));
    };

    return (
        <AppLayout>
            <Head title={`Edit: ${artikel.judul}`} />

            <Card>
                <div className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <Button variant="outline" size="sm" onClick={() => router.visit('/admin/artikel')}>
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <h1 className="text-2xl font-bold">Edit Artikel</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-4">
                            <div>
                                <Label>Judul Artikel *</Label>
                                <Input
                                    value={formData.judul}
                                    onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                                    placeholder="Masukkan judul artikel"
                                    className={errors.judul ? 'border-red-500' : ''}
                                />
                                {errors.judul && <p className="text-sm text-red-500 mt-1">{errors.judul}</p>}
                            </div>

                            <div>
                                <Label>Slug *</Label>
                                <Input
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    placeholder="slug-artikel"
                                    className={errors.slug ? 'border-red-500' : ''}
                                />
                                {errors.slug && <p className="text-sm text-red-500 mt-1">{errors.slug}</p>}
                            </div>

                            <div>
                                <Label>Excerpt (Ringkasan)</Label>
                                <Input
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    placeholder="Ringkasan singkat artikel"
                                    className={errors.excerpt ? 'border-red-500' : ''}
                                />
                                {errors.excerpt && <p className="text-sm text-red-500 mt-1">{errors.excerpt}</p>}
                            </div>

                            <div>
                                <Label>Konten Artikel *</Label>
                                <CKEditorComponent
                                    data={formData.konten}
                                    onChange={(data: string) => setFormData({ ...formData, konten: data })}
                                />
                                {errors.konten && <p className="text-sm text-red-500 mt-1">{errors.konten}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Kategori</Label>
                                    <Select value={formData.kategori_id || 'none'} onValueChange={(v) => setFormData({ ...formData, kategori_id: v === 'none' ? '' : v })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih kategori" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Tanpa Kategori</SelectItem>
                                            {kategoris.map(k => (
                                                <SelectItem key={k.id} value={String(k.id)}>{k.nama}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.kategori_id && <p className="text-sm text-red-500 mt-1">{errors.kategori_id}</p>}
                                </div>

                                <div>
                                    <Label>Gambar Cover {artikel.image && '(saat ini: ' + artikel.image.split('/').pop() + ')'}</Label>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                                        className={errors.image ? 'border-red-500' : ''}
                                    />
                                    {errors.image && <p className="text-sm text-red-500 mt-1">{errors.image}</p>}
                                </div>
                            </div>

                            <div>
                                <Label>Tags</Label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {tags.map(tag => {
                                        const isSelected = formData.tags.includes(tag.id);
                                        return (
                                            <Badge
                                                key={tag.id}
                                                variant={isSelected ? 'default' : 'outline'}
                                                className="cursor-pointer"
                                                onClick={() => toggleTag(tag.id)}
                                            >
                                                {tag.nama}
                                                {isSelected && <X className="w-3 h-3 ml-1" />}
                                            </Badge>
                                        );
                                    })}
                                </div>
                                {errors.tags && <p className="text-sm text-red-500 mt-1">{errors.tags}</p>}
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="published"
                                    checked={formData.published}
                                    onCheckedChange={(checked) => setFormData({ ...formData, published: checked as boolean })}
                                />
                                <Label htmlFor="published" className="cursor-pointer">Publikasikan artikel</Label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => router.visit('/admin/artikel')} disabled={isLoading}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Update Artikel
                            </Button>
                        </div>
                    </form>
                </div>
            </Card>
        </AppLayout>
    );
}
