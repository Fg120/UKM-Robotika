import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/layouts/admin/admin-layout';
import { usePage } from '@inertiajs/react';
import { 
    ChevronDown, 
    ChevronLeft,
    ChevronRight,
    Home, 
    LogOut, 
    Settings, 
    User
} from 'lucide-react';
import { useEffect } from 'react';

interface AdminSidebarProps {
    className?: string;
}

const navigation = [
    {
        title: 'Dashboard',
        href: '/admin',
        icon: Home,
    },
    {
        title: 'Users',
        href: '/admin/users',
        icon: User,
    },
    {
        title: 'Settings',
        href: '/admin/settings',
        icon: Settings,
    },
];

function SidebarContent({ isCollapsed = false, onToggleCollapse }: { 
    isCollapsed?: boolean; 
    onToggleCollapse?: () => void; 
}) {
    const { url } = usePage();

    return (
        <div className="flex h-full flex-col bg-[#03045E]">
            {/* Header */}
            <div className="flex h-14 items-center justify-between border-b px-4">
                {!isCollapsed && (
                    <><img className='h-8' src="/asset/logo.png" alt="Logo" /><h2 className="text-lg font-semibold">Robo</h2></>
                )}
                {/* Desktop Collapse Button */}
                {onToggleCollapse && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onToggleCollapse}
                        className="h-8 w-8 p-0 hidden lg:flex"
                    >
                        {isCollapsed ? (
                            <ChevronRight className="h-4 w-4" />
                        ) : (
                            <ChevronLeft className="h-4 w-4" />
                        )}
                    </Button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2 p-4">
                {navigation.map((item) => {
                    const Icon = item.icon;
                    // Check if current path matches navigation item, ignoring query parameters
                    const currentPath = url.split('?')[0];
                    const isActive = currentPath === item.href || 
                        (currentPath.startsWith(item.href + '/') && item.href !== '/admin');
                    
                    return (
                        <Button
                            key={item.href}
                            className={cn(
                                "w-full h-10 hover:bg-[#B8FB3C] text-white",
                                isCollapsed ? "justify-center px-2" : "justify-start gap-2",
                                isActive ? "bg-[#B8FB3C]" : "bg-transparent"
                            )}
                            asChild
                        >
                            <a href={item.href}>
                                <Icon className="h-4 w-4" />
                                {!isCollapsed && <span className='font-bold'>{item.title}</span>}
                            </a>
                        </Button>
                    );
                })}
            </nav>

            {/* User Menu */}
            <div className="border-t p-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full h-10",
                                isCollapsed ? "justify-center px-2" : "justify-start gap-2"
                            )}
                        >
                            <Avatar className="h-6 w-6">
                                <AvatarImage src="/asset/logo.png" />
                                <AvatarFallback>AD</AvatarFallback>
                            </Avatar>
                            {!isCollapsed && (
                                <>
                                    <span className="flex-1 text-left">Admin</span>
                                    <ChevronDown className="h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}

export function AdminSidebar({ className }: AdminSidebarProps) {
    const { isOpen, close, isCollapsed, toggleCollapse } = useSidebar();

    // Close sidebar when screen size changes to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) { // lg breakpoint
                close();
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [close]);

    return (
        <>
            {/* Desktop Sidebar - Fixed */}
            <div className={cn(
                "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-50 transition-all duration-300",
                "border-r bg-background",
                isCollapsed ? "lg:w-16" : "lg:w-64",
                className
            )}>
                <SidebarContent 
                    isCollapsed={isCollapsed} 
                    onToggleCollapse={toggleCollapse} 
                />
            </div>

            {/* Mobile Sidebar - Sheet/Drawer */}
            <Sheet open={isOpen} onOpenChange={close}>
                <SheetContent side="left" className="w-64 p-0 lg:hidden">
                    <SidebarContent />
                </SheetContent>
            </Sheet>
        </>
    );
}