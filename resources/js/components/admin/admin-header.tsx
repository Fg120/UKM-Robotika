import { 
    Breadcrumb, 
    BreadcrumbItem as BreadcrumbItemComponent, 
    BreadcrumbLink, 
    BreadcrumbList, 
    BreadcrumbPage, 
    BreadcrumbSeparator 
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type BreadcrumbItem } from '@/types';
import { useSidebar } from '@/layouts/admin/admin-layout';
import { Bell, Search, Menu } from 'lucide-react';

interface AdminHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
    title?: string;
}

export function AdminHeader({ breadcrumbs = [], title }: AdminHeaderProps) {
    const { toggle } = useSidebar();

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center gap-4 px-4 lg:px-6">
                {/* Mobile Menu Button */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggle}
                    className="h-8 w-8 p-0 lg:hidden"
                >
                    <Menu className="h-4 w-4" />
                    <span className="sr-only">Toggle sidebar</span>
                </Button>

                {/* Breadcrumbs */}
                <div className="flex-1">
                    {breadcrumbs.length > 0 ? (
                        <Breadcrumb>
                            <BreadcrumbList>
                                {breadcrumbs.map((item, index) => {
                                    const isLast = index === breadcrumbs.length - 1;
                                    
                                    return (
                                        <div key={index} className="flex items-center">
                                            <BreadcrumbItemComponent>
                                                {isLast ? (
                                                    <BreadcrumbPage>{item.title}</BreadcrumbPage>
                                                ) : (
                                                    <BreadcrumbLink href={item.href}>
                                                        {item.title}
                                                    </BreadcrumbLink>
                                                )}
                                            </BreadcrumbItemComponent>
                                            {!isLast && <BreadcrumbSeparator />}
                                        </div>
                                    );
                                })}
                            </BreadcrumbList>
                        </Breadcrumb>
                    ) : title ? (
                        <h1 className="text-lg font-semibold">{title}</h1>
                    ) : null}
                </div>

                {/* Search - Hidden on small screens */}
                <div className="relative w-64 hidden sm:block">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search..."
                        className="pl-8"
                    />
                </div>

                {/* Notifications */}
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Bell className="h-4 w-4" />
                    <span className="sr-only">Notifications</span>
                </Button>
            </div>
        </header>
    );
}