import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
import {
    BarChart3, Users, ShoppingCart, TrendingUp, Activity, Eye, Download, Package, Layers,
    FileText, Trash2, CheckCircle, XCircle, Award, Tag, Building2, UserCircle,
    TrendingDown, ArrowUpRight, ArrowDownRight, Image, Target
} from 'lucide-react';
import { Head, Link } from '@inertiajs/react';

interface DashboardProps {
    stats: {
        totalUsers: number;
        totalArtikel: number;
        totalProduk: number;
        totalBidang: number;
        totalDivisi: number;
        totalPengurus: number;
        totalGaleri: number;
        totalKategori: number;
        totalTags: number;
        totalSponsor: number;
        totalPosisi: number;
        aktiveProduk: number;
        publishedArtikel: number;
        deletedUsers: number;
        deletedArtikel: number;
        deletedProduk: number;
        deletedPengurus: number;
    };
    recentData: {
        artikel: any[];
        produk: any[];
        users: any[];
        galeri: any[];
        pengurus: any[];
    };
    bidangStats: any[];
    divisiStats: any[];
    artikelGrowth: Record<string, number>;
    produktStatus: {
        aktif: number;
        tidak_aktif: number;
    };
    artikelStats: {
        total: number;
        published: number;
        draft: number;
        deleted: number;
    };
    artikelByKategori: Array<{ nama: string; count: number }>;
    mostViewedArtikel: any[];
    topContributors: Array<{ id: number; name: string; email: string; artikel_count: number }>;
    popularTags: Array<{ nama: string; count: number }>;
    monthlyStats: {
        artikel: number;
        produk: number;
        pengurus: number;
    };
    growthPercent: {
        artikel: number;
    };
}

export default function AdminDashboard({
    stats,
    recentData,
    bidangStats,
    divisiStats,
    artikelGrowth,
    produktStatus,
    artikelStats,
    artikelByKategori,
    mostViewedArtikel,
    topContributors,
    popularTags,
    monthlyStats,
    growthPercent,
}: DashboardProps) {
    const breadcrumbs = [
        { label: 'Dashboard', href: '/admin' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Admin" />
            <div className="space-y-6">
                {/* Main Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Artikel</CardTitle>
                            <FileText className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalArtikel}</div>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                                <span className="flex items-center text-green-600">
                                    {growthPercent.artikel > 0 ? (
                                        <>
                                            <ArrowUpRight className="h-3 w-3 mr-1" />
                                            +{growthPercent.artikel}%
                                        </>
                                    ) : growthPercent.artikel < 0 ? (
                                        <>
                                            <ArrowDownRight className="h-3 w-3 mr-1" />
                                            {growthPercent.artikel}%
                                        </>
                                    ) : (
                                        '0%'
                                    )}
                                </span>
                                <span className="ml-2">{stats.publishedArtikel} published</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Produk</CardTitle>
                            <Package className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalProduk}</div>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs bg-green-500">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    {stats.aktiveProduk} aktif
                                </Badge>
                                <Badge variant="outline" className="text-xs bg-red-500">
                                    <XCircle className="h-3 w-3 mr-1" />
                                    {produktStatus.tidak_aktif} nonaktif
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pengurus</CardTitle>
                            <Activity className="h-4 w-4 text-lime-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalPengurus}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stats.totalBidang} bidang • {stats.totalDivisi} divisi
                            </p>
                            <p className="text-xs text-muted-foreground">{stats.totalPosisi} posisi</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Galeri</CardTitle>
                            <Image className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalGaleri}</div>
                            <p className="text-xs text-muted-foreground">Foto & media</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Kategori</CardTitle>
                            <Layers className="h-4 w-4 text-cyan-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalKategori}</div>
                            <p className="text-xs text-muted-foreground">Kategori artikel</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tags</CardTitle>
                            <Tag className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalTags}</div>
                            <p className="text-xs text-muted-foreground">Tag artikel</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Sponsor</CardTitle>
                            <Building2 className="h-4 w-4 text-violet-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalSponsor}</div>
                            <p className="text-xs text-muted-foreground">Partner & sponsor</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts and Activities */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Artikel Growth */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Publikasi Artikel</CardTitle>
                                    <CardDescription>
                                        Aktivitas publikasi 7 hari terakhir
                                    </CardDescription>
                                </div>
                                <Badge variant="outline">
                                    <FileText className="h-3 w-3 mr-1" />
                                    {monthlyStats.artikel} bulan ini
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">Total Artikel</p>
                                        <p className="text-2xl font-bold">{stats.totalArtikel}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">Published</p>
                                        <p className="text-2xl font-bold text-green-600">{stats.publishedArtikel}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">Draft</p>
                                        <p className="text-2xl font-bold text-blue-600">{artikelStats.draft}</p>
                                    </div>
                                </div>

                                <div className="space-y-2 pt-4">
                                    <p className="text-sm font-medium">Aktivitas 7 hari terakhir:</p>
                                    {Object.entries(artikelGrowth).slice(-7).map(([date, count]) => (
                                        <div key={date} className="flex items-center gap-2">
                                            <span className="text-xs text-muted-foreground w-20">
                                                {new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                                            </span>
                                            <Progress
                                                value={count > 0 ? (count / Math.max(...Object.values(artikelGrowth), 1)) * 100 : 0}
                                                className="h-2 flex-1"
                                            />
                                            <span className="text-xs font-medium w-8 text-right">{count}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-4 border-t">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Bulan ini</span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold">{monthlyStats.artikel} artikel</span>
                                            <span className={`text-xs ${growthPercent.artikel > 0 ? 'text-green-600' : growthPercent.artikel < 0 ? 'text-red-600' : 'text-muted-foreground'}`}>
                                                {growthPercent.artikel > 0 ? '+' : ''}{growthPercent.artikel}% vs bulan lalu
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Contributors */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Award className="h-4 w-4 text-yellow-500" />
                                Top Contributors
                            </CardTitle>
                            <CardDescription>
                                Penulis artikel terbanyak
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {topContributors.length > 0 ? (
                                topContributors.map((contributor, index) => (
                                    <div key={contributor.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex-shrink-0">
                                                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                                    index === 1 ? 'bg-gray-100 text-gray-700' :
                                                        index === 2 ? 'bg-orange-100 text-orange-700' :
                                                            'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    <span className="text-xs font-bold">
                                                        {contributor.name.charAt(0)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">{contributor.name}</p>
                                                <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                                                    {contributor.email}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge variant="secondary" className="ml-2">
                                            {contributor.artikel_count}
                                        </Badge>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">Belum ada kontributor</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Artikel Analytics */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Artikel Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Status Artikel</CardTitle>
                            <CardDescription>
                                Distribusi status artikel
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        Published
                                    </span>
                                    <span className="font-medium">{artikelStats.published}</span>
                                </div>
                                <Progress value={(artikelStats.published / artikelStats.total) * 100} className="h-2" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-blue-500" />
                                        Draft
                                    </span>
                                    <span className="font-medium">{artikelStats.draft}</span>
                                </div>
                                <Progress value={(artikelStats.draft / artikelStats.total) * 100} className="h-2" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-2">
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                        Deleted
                                    </span>
                                    <span className="font-medium">{artikelStats.deleted}</span>
                                </div>
                                <Progress value={(artikelStats.deleted / (artikelStats.total + artikelStats.deleted)) * 100} className="h-2" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Artikel by Kategori */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Artikel per Kategori</CardTitle>
                            <CardDescription>
                                Distribusi berdasarkan kategori
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {artikelByKategori.slice(0, 5).map((kategori, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <span className="text-sm truncate">{kategori.nama}</span>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline">{kategori.count}</Badge>
                                        </div>
                                    </div>
                                ))}
                                {artikelByKategori.length === 0 && (
                                    <p className="text-sm text-muted-foreground text-center py-4">Belum ada kategori</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Popular Tags */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Popular Tags</CardTitle>
                            <CardDescription>
                                Tag yang paling sering digunakan
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {popularTags.slice(0, 10).map((tag, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                        {tag.nama} ({tag.count})
                                    </Badge>
                                ))}
                                {popularTags.length === 0 && (
                                    <p className="text-sm text-muted-foreground text-center w-full py-4">Belum ada tag</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Most Viewed & Recent Content */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Most Viewed Artikel */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Eye className="h-4 w-4 text-blue-500" />
                                        Artikel Terpopuler
                                    </CardTitle>
                                    <CardDescription>
                                        Artikel dengan views terbanyak
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {mostViewedArtikel.length > 0 ? (
                                mostViewedArtikel.map((artikel: any) => (
                                    <div key={artikel.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-accent transition-colors">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium line-clamp-1">{artikel.judul}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="outline" className="text-xs">
                                                    <Eye className="h-3 w-3 mr-1" />
                                                    {artikel.views} views
                                                </Badge>
                                                {artikel.kategori && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        {artikel.kategori.nama}
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Oleh {artikel.user?.name || 'Unknown'}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">Belum ada artikel</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Artikel */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Artikel Terbaru</CardTitle>
                            <CardDescription>
                                5 artikel terakhir dibuat
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {recentData.artikel.length > 0 ? (
                                recentData.artikel.map((artikel: any) => (
                                    <div key={artikel.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-accent transition-colors">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium line-clamp-1">{artikel.judul}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                {artikel.published ? (
                                                    <Badge className="text-xs bg-green-100 text-green-700">
                                                        Published
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-xs">
                                                        Draft
                                                    </Badge>
                                                )}
                                                {artikel.kategori && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        {artikel.kategori.nama}
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {new Date(artikel.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">Belum ada artikel</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Organization Structure */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Bidang Statistics */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Layers className="h-4 w-4 text-purple-500" />
                                Distribusi Pengurus per Bidang
                            </CardTitle>
                            <CardDescription>
                                Jumlah pengurus di setiap bidang
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {bidangStats.length > 0 ? (
                                    bidangStats.map((bidang: any) => (
                                        <div key={bidang.id} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium">{bidang.nama}</span>
                                                <Badge variant="outline">
                                                    {bidang.pengurus_count} pengurus
                                                </Badge>
                                            </div>
                                            <Progress
                                                value={bidangStats.reduce((acc: number, b: any) => acc + b.pengurus_count, 0) > 0
                                                    ? (bidang.pengurus_count / bidangStats.reduce((acc: number, b: any) => acc + b.pengurus_count, 0)) * 100
                                                    : 0
                                                }
                                                className="h-2"
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-4">Belum ada bidang</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Content Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-4 w-4 text-indigo-500" />
                                Ringkasan Konten
                            </CardTitle>
                            <CardDescription>
                                Total konten website
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 rounded-lg border">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-5 w-5 text-purple-500" />
                                        <div>
                                            <p className="text-sm font-medium">Artikel</p>
                                            <p className="text-xs text-muted-foreground">{stats.publishedArtikel} published, {artikelStats.draft} draft</p>
                                        </div>
                                    </div>
                                    <span className="text-lg font-bold">{stats.totalArtikel}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg border">
                                    <div className="flex items-center gap-3">
                                        <Package className="h-5 w-5 text-green-500" />
                                        <div>
                                            <p className="text-sm font-medium">Produk</p>
                                            <p className="text-xs text-muted-foreground">{stats.aktiveProduk} aktif</p>
                                        </div>
                                    </div>
                                    <span className="text-lg font-bold">{stats.totalProduk}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg border">
                                    <div className="flex items-center gap-3">
                                        <Image className="h-5 w-5 text-blue-500" />
                                        <div>
                                            <p className="text-sm font-medium">Galeri</p>
                                            <p className="text-xs text-muted-foreground">Foto & media</p>
                                        </div>
                                    </div>
                                    <span className="text-lg font-bold">{stats.totalGaleri}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg border">
                                    <div className="flex items-center gap-3">
                                        <Building2 className="h-5 w-5 text-orange-500" />
                                        <div>
                                            <p className="text-sm font-medium">Sponsor</p>
                                            <p className="text-xs text-muted-foreground">Partner & sponsor</p>
                                        </div>
                                    </div>
                                    <span className="text-lg font-bold">{stats.totalSponsor}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Monthly Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-green-500" />
                            Aktivitas Bulan Ini
                        </CardTitle>
                        <CardDescription>
                            Data yang ditambahkan dalam {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Artikel Baru</span>
                                    <FileText className="h-4 w-4 text-purple-500" />
                                </div>
                                <div className="text-2xl font-bold">{monthlyStats.artikel}</div>
                                <div className="text-xs text-muted-foreground flex items-center">
                                    {growthPercent.artikel > 0 ? (
                                        <span className="text-green-600 flex items-center">
                                            <TrendingUp className="h-3 w-3 mr-1" />
                                            +{growthPercent.artikel}%
                                        </span>
                                    ) : growthPercent.artikel < 0 ? (
                                        <span className="text-red-600 flex items-center">
                                            <TrendingDown className="h-3 w-3 mr-1" />
                                            {growthPercent.artikel}%
                                        </span>
                                    ) : (
                                        <span>0%</span>
                                    )}
                                    <span className="ml-1">vs bulan lalu</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Produk Baru</span>
                                    <Package className="h-4 w-4 text-green-500" />
                                </div>
                                <div className="text-2xl font-bold">{monthlyStats.produk}</div>
                                <div className="text-xs text-muted-foreground">produk ditambahkan</div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Pengurus Baru</span>
                                    <Activity className="h-4 w-4 text-orange-500" />
                                </div>
                                <div className="text-2xl font-bold">{monthlyStats.pengurus}</div>
                                <div className="text-xs text-muted-foreground">pengurus ditambahkan</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}