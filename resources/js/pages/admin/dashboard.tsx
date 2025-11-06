import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { BarChart3, Users, ShoppingCart, TrendingUp, Activity, Eye, Download, Package, Layers } from 'lucide-react';
import { Head } from '@inertiajs/react';

interface DashboardProps {
    stats: {
        totalUsers: number;
        totalProduk: number;
        totalBidang: number;
        totalPengurus: number;
        totalGaleri: number;
        totalKategori: number;
        aktiveProduk: number;
        aktiveBidang: number;
    };
    recentData: {
        produk: any[];
        users: any[];
        galeri: any[];
        pengurus: any[];
    };
    bidangStats: any[];
    userGrowth: Record<string, number>;
    productStatus: {
        aktif: number;
        tidak_aktif: number;
    };
}

export default function AdminDashboard({
    stats,
    recentData,
    bidangStats,
    userGrowth,
    productStatus,
}: DashboardProps) {
    const breadcrumbs = [
        { label: 'Dashboard', href: '/admin' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Admin" />
            <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalUsers}</div>
                            <p className="text-xs text-muted-foreground">Pengguna terdaftar</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalProduk}</div>
                            <p className="text-xs text-muted-foreground">{stats.aktiveProduk} aktif</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Bidang</CardTitle>
                            <Layers className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalBidang}</div>
                            <p className="text-xs text-muted-foreground">Bidang organisasi</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Pengurus</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalPengurus}</div>
                            <p className="text-xs text-muted-foreground">Anggota pengurus</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts and Activities */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Analytics Chart */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Analytics</CardTitle>
                                    <CardDescription>
                                        Monthly overview of your business metrics
                                    </CardDescription>
                                </div>
                                <div className="flex space-x-2">
                                    <Button variant="outline" size="sm">
                                        <Eye className="h-4 w-4 mr-2" />
                                        View
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Download className="h-4 w-4 mr-2" />
                                        Export
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                                <div className="text-center">
                                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">Chart would be displayed here</p>
                                    <p className="text-sm text-muted-foreground">
                                        Integration with Chart.js or Recharts
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Activities */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Users</CardTitle>
                            <CardDescription>
                                5 user terakhir yang terdaftar
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {recentData.users.length > 0 ? (
                                recentData.users.map((user: any) => (
                                    <div key={user.id} className="flex items-start space-x-3">
                                        <div className="flex-shrink-0">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                <span className="text-xs font-medium text-primary">
                                                    {user.name.charAt(0)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium">{user.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {user.email}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(user.created_at).toLocaleDateString('id-ID')}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">Belum ada user</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>
                            Common administrative tasks
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            <Button>Add New User</Button>
                            <Button variant="outline">View Reports</Button>
                            <Button variant="outline">Manage Settings</Button>
                            <Button variant="outline">Export Data</Button>
                            <Button variant="outline">System Health</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}