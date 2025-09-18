import { AdminContent } from '@/components/admin/admin-content';
import { AdminHeader } from '@/components/admin/admin-header';
import { AdminShell } from '@/components/admin/admin-shell';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AlertProvider } from '@/contexts/AlertContext';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren, createContext, useContext, useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

interface AdminLayoutProps extends PropsWithChildren {
    breadcrumbs?: BreadcrumbItem[];
    title?: string;
}

interface SidebarContextType {
    isOpen: boolean;
    toggle: () => void;
    close: () => void;
    isCollapsed: boolean;
    toggleCollapse: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within AdminLayout');
    }
    return context;
};

export default function AdminLayout({ 
    children, 
    breadcrumbs = [], 
    title 
}: AdminLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { props } = usePage();
    const [currentAlert, setCurrentAlert] = useState<{type: string, message: string} | null>(null);

    // Handle flash messages
    useEffect(() => {
        const flash = props.flash as any;
        
        if (flash?.success) {
            setCurrentAlert({type: 'success', message: flash.success});
        } else if (flash?.error) {
            setCurrentAlert({type: 'error', message: flash.error});
        } else if (flash?.info) {
            setCurrentAlert({type: 'info', message: flash.info});
        } else if (flash?.warning) {
            setCurrentAlert({type: 'warning', message: flash.warning});
        }
    }, [props.flash]);

    const sidebarContext: SidebarContextType = {
        isOpen: sidebarOpen,
        toggle: () => setSidebarOpen(!sidebarOpen),
        close: () => setSidebarOpen(false),
        isCollapsed,
        toggleCollapse: () => setIsCollapsed(!isCollapsed),
    };

    return (
        <AlertProvider>
            <SidebarContext.Provider value={sidebarContext}>
                {/* Flash Messages - AlertDialog style */}
                <AlertDialog open={!!currentAlert} onOpenChange={() => setCurrentAlert(null)}>
                    <AlertDialogContent className="sm:max-w-[425px]">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                                {currentAlert?.type === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
                                {currentAlert?.type === 'error' && <XCircle className="h-5 w-5 text-red-600" />}
                                {currentAlert?.type === 'warning' && <AlertCircle className="h-5 w-5 text-yellow-600" />}
                                {currentAlert?.type === 'info' && <Info className="h-5 w-5 text-blue-600" />}
                                {currentAlert?.type === 'success' ? 'Berhasil' :
                                 currentAlert?.type === 'error' ? 'Error' :
                                 currentAlert?.type === 'warning' ? 'Peringatan' : 'Informasi'}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                {currentAlert?.message}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogAction onClick={() => setCurrentAlert(null)}>
                                OK
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                
                <AdminShell>
                    <AdminSidebar />
                    <AdminContent isCollapsed={isCollapsed}>
                        <AdminHeader breadcrumbs={breadcrumbs} title={title} />
                        <main className="flex-1 overflow-auto p-4 lg:p-6">
                            {children}
                        </main>
                    </AdminContent>
                </AdminShell>
            </SidebarContext.Provider>
        </AlertProvider>
    );
}