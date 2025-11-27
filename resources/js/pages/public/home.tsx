import { Link } from '@inertiajs/react';
import { Artikel, Produk, Galeri, Bidang } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Eye, ArrowRight, Cpu, Zap, Target, Users, BookOpen, Image as ImageIcon } from 'lucide-react';
import PublicLayout from '@/layouts/public/PublicLayout';
import Silk from '@/components/Silk';
import BlurText from '@/components/BlurText';
import HeroCarousel from '@/components/HeroCarousel';

interface Props {
    latestArtikels: Artikel[];
    popularArtikels: Artikel[];
    galleries: Galeri[];
    bidangs: Bidang[];
    divisis: Bidang[];
    sponsors?: Array<{ id: number; judul: string; foto: string; url: string }>;
    totalPengurus: number;
}

export default function Home({ latestArtikels, popularArtikels, galleries, bidangs, divisis, sponsors = [], totalPengurus }: Props) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <PublicLayout title="Home - UKM Robotika" navbarTransparent={false}>

            {/* Hero Section with Silk Background */}
            <section id="home" className="relative pt-24 pb-16 overflow-hidden">
                {/* Silk Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
                    <Silk
                        speed={5}
                        scale={1}
                        color="#1A3D6D"
                        noiseIntensity={1.5}
                        rotation={0}
                    />
                </div>

                {/* Content */}
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid md:grid-cols-2 gap-12 items-center min-h-[600px]">
                        <div className="space-y-6">
                            <Badge variant="secondary" className="text-sm backdrop-blur-sm bg-white/10 border-white/20 text-white">
                                <Zap className="w-3 h-3 mr-1" />
                                Inovasi & Teknologi
                            </Badge>
                            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                                <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                                    Selamat Datang di
                                </span>
                                <br />
                                <span className="text-[#1d4ed8] bg-white rounded-2xl px-2">
                                    UKM Robotika
                                </span>
                            </h1>
                            <BlurText
                                text="Berinovasi untuk Masa Depan"
                                delay={150}
                                animateBy="words"
                                direction="top"
                                className="text-2xl text-gray-300"
                            />
                            <p className="text-xl text-gray-300 leading-relaxed">
                                Wadah bagi mahasiswa untuk belajar, berinovasi, dan mengembangkan teknologi robotika.
                                Bergabunglah dengan kami dalam menciptakan masa depan yang lebih cerdas.
                            </p>
                            <div className="flex gap-4">
                                <Link href="/artikel">
                                    <Button size="lg" className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300">
                                        <BookOpen className="w-5 h-5" />
                                        Baca Artikel
                                    </Button>
                                </Link>
                                <a href="#about">
                                    <Button size="lg" variant="outline" className="backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20">
                                        Pelajari Lebih Lanjut
                                    </Button>
                                </a>
                            </div>
                        </div>
                        <div className="relative w-full">
                            <HeroCarousel interval={5000} />
                            {/* <div className="hidden md:block absolute -top-10 -right-12 backdrop-blur-xl bg-white/10 border border-white/20 p-6 rounded-2xl shadow-2xl z-10">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-500/20 p-3 rounded-xl">
                                        <Users className="w-8 h-8 text-blue-400" />
                                    </div>
                                    <div className="text-white">
                                        <div className="text-2xl font-bold">{totalPengurus}</div>
                                        <div className="text-sm text-gray-300">Anggota Aktif</div>
                                    </div>
                                </div>
                            </div> */}
                            <div className="hidden md:block absolute -bottom-10 -left-12 backdrop-blur-xl bg-white/10 border border-white/20 p-6 rounded-2xl shadow-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="bg-purple-500/20 p-3 rounded-xl">
                                        <Target className="w-8 h-8 text-purple-400" />
                                    </div>
                                    <div className="text-white">
                                        <div className="text-2xl font-bold">{divisis.length}</div>
                                        <div className="text-sm text-gray-300">Divisi Kompetisi</div>
                                    </div>
                                </div>
                            </div>
                            <div className="md:hidden flex gap-4 mt-6">
                                <div className="flex-1 backdrop-blur-xl bg-white/10 border border-white/20 p-4 rounded-xl shadow-2xl">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-blue-500/20 p-2 rounded-lg">
                                            <Users className="w-6 h-6 text-blue-400" />
                                        </div>
                                        <div className="text-white">
                                            <div className="text-lg font-bold">{totalPengurus}</div>
                                            <div className="text-xs text-gray-300">Anggota</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 backdrop-blur-xl bg-white/10 border border-white/20 p-4 rounded-xl shadow-2xl">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-purple-500/20 p-2 rounded-lg">
                                            <Target className="w-6 h-6 text-purple-400" />
                                        </div>
                                        <div className="text-white">
                                            <div className="text-lg font-bold">{divisis.length}</div>
                                            <div className="text-xs text-gray-300">Divisi</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>            {/* About Section */}
            <section id="about" className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4">
                            <BlurText
                                text="Tentang UKM Robotika"
                                delay={100}
                                animateBy="words"
                                direction="top"
                                className="inline-block text-black"
                            />
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            Organisasi mahasiswa yang fokus pada pengembangan ilmu pengetahuan dan teknologi di bidang robotika
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="border-2 hover:border-primary hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                            <CardHeader>
                                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                                    <Cpu className="w-6 h-6 text-primary" />
                                </div>
                                <CardTitle>Inovasi</CardTitle>
                                <CardDescription>
                                    Mengembangkan ide-ide kreatif dan inovatif dalam teknologi robotika
                                </CardDescription>
                            </CardHeader>
                        </Card>
                        <Card className="border-2 hover:border-primary hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                            <CardHeader>
                                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                                    <Users className="w-6 h-6 text-primary" />
                                </div>
                                <CardTitle>Kolaborasi</CardTitle>
                                <CardDescription>
                                    Bekerja sama dalam tim untuk mencapai tujuan bersama
                                </CardDescription>
                            </CardHeader>
                        </Card>
                        <Card className="border-2 hover:border-primary hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                            <CardHeader>
                                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                                    <Target className="w-6 h-6 text-primary" />
                                </div>
                                <CardTitle>Prestasi</CardTitle>
                                <CardDescription>
                                    Meraih berbagai prestasi di tingkat regional dan nasional
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Divisi Section */}
            {divisis.length > 0 && (
                <section className="py-16 bg-gradient-to-b from-white to-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold mb-4">
                                <BlurText
                                    text="Divisi Kompetisi"
                                    delay={100}
                                    animateBy="words"
                                    direction="top"
                                    className="inline-block text-black"
                                />
                            </h2>
                            <p className="text-xl text-muted-foreground">
                                Jelajahi berbagai divisi kompetisi robotika Indonesia (KRI) yang penuh inovasi
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-6">
                            {divisis.map((divisi) => (
                                <div key={divisi.id} className="w-full sm:w-96">
                                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50 bg-black text-white h-full">
                                        <CardHeader>
                                            <CardTitle className="text-lg">{divisi.nama}</CardTitle>
                                            {divisi.deskripsi && (
                                                <CardDescription className="line-clamp-3 text-gray-300">
                                                    {divisi.deskripsi}
                                                </CardDescription>
                                            )}
                                        </CardHeader>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Bidang Section */}
            {bidangs.length > 0 && (
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold mb-4">
                                <BlurText
                                    text="Struktur Organisasi"
                                    delay={100}
                                    animateBy="words"
                                    direction="top"
                                    className="inline-block text-black"
                                />
                            </h2>
                            <p className="text-xl text-muted-foreground">
                                Kenali struktur dan bidang-bidang dalam organisasi kami
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-6">
                            {bidangs.map((bidang) => (
                                <div key={bidang.id} className="w-full sm:w-80">
                                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50">
                                        {bidang.image && (
                                            <div className="aspect-video overflow-hidden rounded-t-lg relative group">
                                                <img
                                                    src={bidang.image}
                                                    alt={bidang.nama}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            </div>
                                        )}
                                        <CardHeader>
                                            <CardTitle className="text-lg">{bidang.nama}</CardTitle>
                                            {bidang.deskripsi && (
                                                <CardDescription className="line-clamp-3">
                                                    {bidang.deskripsi}
                                                </CardDescription>
                                            )}
                                        </CardHeader>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Sponsor Section */}
            {sponsors && sponsors.length > 0 && (
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold mb-4">
                                <BlurText
                                    text="Sponsor Kami"
                                    delay={100}
                                    animateBy="words"
                                    direction="top"
                                    className="inline-block text-black"
                                />
                            </h2>
                            <p className="text-xl text-muted-foreground">
                                Terima kasih atas dukungan dari para sponsor
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center items-center gap-8">
                            {sponsors.map((sponsor) => (
                                <a
                                    href={sponsor.url ?? '#'}
                                    key={sponsor.id}
                                    className="group relative h-24 flex items-center justify-center"
                                >
                                    <img
                                        src={sponsor.foto}
                                        alt={sponsor.judul}
                                        className="h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                                    />
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                        <div className="bg-gray-900 text-white text-sm px-3 py-1 rounded whitespace-nowrap">
                                            {sponsor.judul}
                                        </div>
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Latest Articles Section */}
            <section className="py-16 bg-gradient-to-b from-white to-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <h2 className="text-4xl font-bold mb-2">
                                <BlurText
                                    text="Artikel Terbaru"
                                    delay={100}
                                    animateBy="words"
                                    direction="top"
                                    className="inline-block text-black"
                                />
                            </h2>
                            <p className="text-xl text-muted-foreground">
                                Berita dan informasi terkini seputar robotika
                            </p>
                        </div>
                        <Link href="/artikel">
                            <Button variant="outline" className="gap-2 hover:shadow-lg transition-all">
                                Lihat Semua
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {latestArtikels.map((artikel) => (
                            <Card key={artikel.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50">
                                <Link href={`/artikel/${artikel.slug}`}>
                                    {artikel.image ? (
                                        <div className="aspect-video overflow-hidden relative group">
                                            <img
                                                src={artikel.image}
                                                alt={artikel.judul}
                                                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </div>
                                    ) : (
                                        <div className="aspect-video bg-gradient-to-br from-primary/20 via-blue-500/10 to-purple-500/20 flex items-center justify-center">
                                            <span className="text-4xl font-bold text-primary/30">
                                                {artikel.judul.charAt(0)}
                                            </span>
                                        </div>
                                    )}
                                </Link>
                                <CardHeader>
                                    {artikel.kategori && (
                                        <Badge variant="secondary" className="text-xs w-fit mb-2">
                                            {artikel.kategori.nama}
                                        </Badge>
                                    )}
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
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>{formatDate(artikel.published_at || artikel.created_at)}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Eye className="w-4 h-4" />
                                            <span>{artikel.views}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            {galleries.length > 0 && (
                <section id="gallery" className="py-16 bg-gradient-to-b from-gray-50 to-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold mb-4">
                                <BlurText
                                    text="Galeri Kegiatan"
                                    delay={100}
                                    animateBy="words"
                                    direction="top"
                                    className="inline-block text-black"
                                />
                            </h2>
                            <p className="text-xl text-muted-foreground">
                                Dokumentasi berbagai kegiatan dan acara UKM Robotika
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {galleries.map((gallery) => (
                                <Card key={gallery.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50">
                                    {gallery.image ? (
                                        <div className="aspect-video overflow-hidden relative group">
                                            <img
                                                src={gallery.image}
                                                alt={gallery.judul}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                                <span className="text-white font-semibold">{gallery.judul}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="aspect-video bg-gradient-to-br from-primary/20 via-blue-500/10 to-purple-500/20 flex items-center justify-center">
                                            <ImageIcon className="w-16 h-16 text-primary/30" />
                                        </div>
                                    )}
                                    <CardHeader>
                                        <CardTitle className="text-lg">{gallery.judul}</CardTitle>
                                        <CardDescription>
                                            {formatDate(gallery.tanggal)}
                                        </CardDescription>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            )}

        </PublicLayout>
    );
}
