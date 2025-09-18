import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/layouts/admin/admin-layout';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function LongContentExample() {
    const breadcrumbs = [
        { title: 'Dashboard', href: '/admin' },
        { title: 'Example', href: '/admin/example' },
        { title: 'Long Content', href: '/admin/example/long' },
    ];

    // Generate sample long content
    const longContent = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        title: `Content Item ${i + 1}`,
        description: `This is a sample content item ${i + 1} with some description text that demonstrates how the layout handles long content without affecting the sidebar position.`,
        category: ['Technology', 'Business', 'Design', 'Marketing'][i % 4],
        status: ['Active', 'Pending', 'Draft'][i % 3],
    }));

    return (
        <AdminLayout breadcrumbs={breadcrumbs} title="Long Content Example">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Long Content Example</h1>
                        <p className="text-muted-foreground">
                            This page demonstrates how the layout handles very long content.
                            The sidebar should remain fixed and not be affected by the content length.
                        </p>
                    </div>
                    <Button>Add New Item</Button>
                </div>

                {/* Info Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{longContent.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Active</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {longContent.filter(item => item.status === 'Active').length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {longContent.filter(item => item.status === 'Pending').length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Draft</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {longContent.filter(item => item.status === 'Draft').length}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Long Content List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Content Items</CardTitle>
                        <CardDescription>
                            A very long list of content items to test layout scrolling
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {longContent.map((item) => (
                                <div key={item.id} className="border rounded-lg p-4 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold">{item.title}</h3>
                                        <div className="flex gap-2">
                                            <Badge variant="outline">{item.category}</Badge>
                                            <Badge 
                                                variant={
                                                    item.status === 'Active' ? 'default' :
                                                    item.status === 'Pending' ? 'secondary' : 'destructive'
                                                }
                                            >
                                                {item.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm">Edit</Button>
                                        <Button variant="outline" size="sm">View</Button>
                                        <Button variant="outline" size="sm" className="text-destructive">
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Bottom Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Bottom Section</CardTitle>
                        <CardDescription>
                            This section is at the bottom to show that scrolling works properly
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">
                            If you've scrolled down to see this section, you should notice that:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                            <li>The sidebar remains fixed in position on desktop</li>
                            <li>The header stays sticky at the top</li>
                            <li>Only the main content area scrolls</li>
                            <li>On mobile, the sidebar appears as a floating drawer</li>
                            <li>The layout is fully responsive across all device sizes</li>
                        </ul>
                        <div className="mt-6 flex gap-2">
                            <Button>Back to Top</Button>
                            <Button variant="outline">Save Changes</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}