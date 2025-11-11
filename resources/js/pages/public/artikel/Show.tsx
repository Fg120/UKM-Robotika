import React from 'react';
import { Link } from '@inertiajs/react';
import { Artikel } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Eye, User, ArrowLeft, Clock } from 'lucide-react';
import PublicLayout from '@/layouts/public/PublicLayout';

interface Props {
    artikel: Artikel;
    relatedArtikels: Artikel[];
}

export default function ArtikelShow({ artikel, relatedArtikels }: Props) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const calculateReadTime = (content: string) => {
        const wordsPerMinute = 200;
        const words = content.split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return minutes;
    };

    return (
        <PublicLayout title={artikel.judul}>
            {/* Back Button */}
            <div className="bg-transparent sticky top-24 z-40 py-3">
                <div className="container mx-auto px-4">
                    <Link href="/artikel">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Kembali ke Artikel
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Article Content */}
            <article className="container mx-auto px-4 pt-24 max-w-4xl">
                {/* Hero Image */}
                {artikel.image && (
                    <div className="aspect-video w-full overflow-hidden rounded-lg mb-8 shadow-lg bg-muted p-1">
                        <img
                            src={`/storage/${artikel.image}`}
                            alt={artikel.judul}
                            className="w-full h-full object-contain"
                        />
                    </div>
                )}

                {/* Article Header */}
                <div className="my-8">
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                        {artikel.kategori && (
                            <Badge variant="secondary" className="text-sm text-black">
                                {artikel.kategori.nama}
                            </Badge>
                        )}
                        {artikel.tags?.map(tag => (
                            <Badge key={tag.id} variant="outline" className="text-sm text-black">
                                {tag.nama}
                            </Badge>
                        ))}
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight text-black">
                        {artikel.judul}
                    </h1>

                    {artikel.excerpt && (
                        <p className="text-xl text-muted-foreground mb-6 text-black">
                            {artikel.excerpt}
                        </p>
                    )}

                    <div className="flex items-center gap-6 text-muted-foreground bg-slate-700 p-4 rounded-full w-fit flex-wrap">
                        {artikel.user && (
                            <div className="flex items-center gap-2">
                                <User className="w-5 h-5" />
                                <span className="font-medium">{artikel.user.name}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            <span>{formatDate(artikel.published_at || artikel.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Eye className="w-5 h-5" />
                            <span>{artikel.views} views</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            <span>{calculateReadTime(artikel.konten)} min read</span>
                        </div>
                    </div>
                </div>

                <Separator className="mb-8" />

                {/* Article Body */}
                <div
                    className="prose prose-lg max-w-none mb-12"
                    dangerouslySetInnerHTML={{ __html: artikel.konten }}
                />

                <Separator className="mb-8" />

                {/* Share Section */}
                <div className="bg-muted/50 rounded-lg p-6 mb-12">
                    <h3 className="text-lg font-semibold mb-4">Bagikan Artikel Ini</h3>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                const url = window.location.href;
                                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                            }}
                        >
                            Facebook
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                const url = window.location.href;
                                const text = artikel.judul;
                                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
                            }}
                        >
                            Twitter
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                const url = window.location.href;
                                const text = artikel.judul;
                                window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
                            }}
                        >
                            WhatsApp
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                alert('Link artikel berhasil disalin!');
                            }}
                        >
                            Copy Link
                        </Button>
                    </div>
                </div>

                {/* Related Articles */}
                {relatedArtikels.length > 0 && (
                    <div>
                        <h2 className="text-3xl font-bold mb-6">Artikel Terkait</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedArtikels.map((related) => (
                                <Card key={related.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                    <Link href={`/artikel/${related.slug}`}>
                                        {related.image ? (
                                            <div className="aspect-video overflow-hidden">
                                                <img
                                                    src={`/storage/${related.image}`}
                                                    alt={related.judul}
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                        ) : (
                                            <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                                                <span className="text-3xl font-bold text-primary/30">
                                                    {related.judul.charAt(0)}
                                                </span>
                                            </div>
                                        )}
                                    </Link>
                                    <CardHeader>
                                        {related.kategori && (
                                            <Badge variant="secondary" className="text-xs w-fit mb-2">
                                                {related.kategori.nama}
                                            </Badge>
                                        )}
                                        <Link href={`/artikel/${related.slug}`}>
                                            <CardTitle className="text-base hover:text-primary transition-colors line-clamp-2">
                                                {related.judul}
                                            </CardTitle>
                                        </Link>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                <span>{formatDate(related.published_at || related.created_at)}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Eye className="w-3 h-3" />
                                                <span>{related.views}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </article>

        </PublicLayout>
    );
}
