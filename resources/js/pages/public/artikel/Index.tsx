import React, { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import { Artikel, Kategori, Tag } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Calendar, Eye, User } from 'lucide-react';
import PublicLayout from '@/layouts/public/PublicLayout';

interface Props {
    artikels: { data: Artikel[]; links: any[]; meta: any };
    kategoris: Pick<Kategori, 'id' | 'nama' | 'slug'>[];
    tags: Pick<Tag, 'id' | 'nama' | 'slug'>[];
    filters?: { search?: string; kategori?: string; tag?: string };
}

export default function ArtikelIndex({ artikels, kategoris, tags, filters }: Props) {
    const [search, setSearch] = useState(filters?.search || '');
    const [kategoriFilter, setKategoriFilter] = useState(filters?.kategori || 'all');
    const [tagFilter, setTagFilter] = useState(filters?.tag || 'all');

    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            router.get('/artikel', {
                search: search || undefined,
                kategori: kategoriFilter !== 'all' ? kategoriFilter : undefined,
                tag: tagFilter !== 'all' ? tagFilter : undefined,
            }, { preserveState: true, preserveScroll: true });
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [search, kategoriFilter, tagFilter]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <PublicLayout title="Artikel">

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-primary/50 via-blue-50 to-purple-200 py-16 pt-24">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Artikel & Berita</h1>
                    <p className="text-lg md:text-xl text-gray-600">
                        Temukan artikel menarik seputar robotika dan teknologi
                    </p>
                </div>
            </div>

            {/* Filter Section */}
            <div className="container mx-auto px-4 py-8">
                <Card className="mb-8">
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari artikel..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <Select value={kategoriFilter} onValueChange={setKategoriFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Semua Kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Kategori</SelectItem>
                                    {kategoris.map(k => (
                                        <SelectItem key={k.id} value={k.slug}>{k.nama}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={tagFilter} onValueChange={setTagFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Semua Tag" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Tag</SelectItem>
                                    {tags.map(t => (
                                        <SelectItem key={t.id} value={t.slug}>{t.nama}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {artikels.data.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <p className="text-muted-foreground text-lg">Tidak ada artikel ditemukan</p>
                        </div>
                    ) : (
                        artikels.data.map((artikel) => (
                            <Card key={artikel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                <Link href={`/artikel/${artikel.slug}`}>
                                    {artikel.image ? (
                                        <div className="aspect-video overflow-hidden">
                                            <img
                                                src={artikel.image}
                                                alt={artikel.judul}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    ) : (
                                        <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                                            <span className="text-4xl font-bold text-primary/30">
                                                {artikel.judul.charAt(0)}
                                            </span>
                                        </div>
                                    )}
                                </Link>
                                <CardHeader>
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                        {artikel.kategori && (
                                            <Badge variant="secondary" className="text-xs">
                                                {artikel.kategori.nama}
                                            </Badge>
                                        )}
                                        {artikel.tags?.slice(0, 2).map(tag => (
                                            <Badge key={tag.id} variant="outline" className="text-xs">
                                                {tag.nama}
                                            </Badge>
                                        ))}
                                    </div>
                                    <Link href={`/artikel/${artikel.slug}`}>
                                        <CardTitle className="hover:text-primary transition-colors line-clamp-2">
                                            {artikel.judul}
                                        </CardTitle>
                                    </Link>
                                    <CardDescription className="line-clamp-2">
                                        {artikel.excerpt || 'Tidak ada ringkasan'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                <span>{formatDate(artikel.published_at || artikel.created_at)}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Eye className="w-4 h-4" />
                                                <span>{artikel.views}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {artikel.user && (
                                        <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                                            <User className="w-4 h-4" />
                                            <span>{artikel.user.name}</span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {artikels.links.length > 3 && (
                    <div className="flex justify-center gap-2">
                        {artikels.links.map((link, index) => (
                            <Button
                                key={index}
                                variant={link.active ? 'default' : 'outline'}
                                onClick={() => link.url && router.visit(link.url)}
                                disabled={!link.url}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>

        </PublicLayout>
    );
}
