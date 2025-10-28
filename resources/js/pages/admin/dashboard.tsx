import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/layouts/Layout';
import { BarChart3, Users, ShoppingCart, TrendingUp, Activity, Eye, Download } from 'lucide-react';

const stats = [
    {
        title: 'Total Users',
        value: '12,345',
        change: '+12%',
        changeType: 'positive' as const,
        icon: Users,
    },
    {
        title: 'Total Orders',
        value: '8,492',
        change: '+8%',
        changeType: 'positive' as const,
        icon: ShoppingCart,
    },
    {
        title: 'Revenue',
        value: '$45,231',
        change: '-3%',
        changeType: 'negative' as const,
        icon: TrendingUp,
    },
    {
        title: 'Active Sessions',
        value: '2,341',
        change: '+15%',
        changeType: 'positive' as const,
        icon: Activity,
    },
];

const recentActivities = [
    {
        user: 'John Doe',
        action: 'Created new account',
        time: '2 minutes ago',
        type: 'user',
    },
    {
        user: 'Jane Smith',
        action: 'Made a purchase',
        time: '5 minutes ago',
        type: 'order',
    },
    {
        user: 'Bob Johnson',
        action: 'Updated profile',
        time: '10 minutes ago',
        type: 'profile',
    },
    {
        user: 'Alice Brown',
        action: 'Logged out',
        time: '15 minutes ago',
        type: 'auth',
    },
];

export default function AdminDashboard() {
    const breadcrumbs = [
        { title: 'Dashboard', href: '/admin' },
    ];

    return (
        <AdminLayout breadcrumbs={breadcrumbs} title="Dashboard">
            <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={stat.title}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {stat.title}
                                    </CardTitle>
                                    <Icon className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    <div className="flex items-center space-x-2">
                                        <Badge 
                                            variant={stat.changeType === 'positive' ? 'default' : 'destructive'}
                                            className="text-xs"
                                        >
                                            {stat.change}
                                        </Badge>
                                        <p className="text-xs text-muted-foreground">
                                            from last month
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
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
                            <CardTitle>Recent Activities</CardTitle>
                            <CardDescription>
                                Latest user activities in your system
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {recentActivities.map((activity, index) => (
                                <div key={index} className="flex items-start space-x-3">
                                    <div className="flex-shrink-0">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="text-xs font-medium text-primary">
                                                {activity.user.charAt(0)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium">{activity.user}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {activity.action}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {activity.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
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
        </AdminLayout>
    );
}