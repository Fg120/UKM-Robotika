import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import type { ReactNode } from 'react'
import { Fragment, useEffect } from 'react'
import { usePage } from '@inertiajs/react'
import { AlertProvider, useAlert } from '@/contexts/AlertContext'

// Define breadcrumb item type
interface BreadcrumbItemProps {
  label: string
  href?: string
}

interface AppLayoutProps {
  children: ReactNode
  breadcrumbs?: BreadcrumbItemProps[]
}

// Flash alert bridge: reads Inertia flash props and shows shadcn alerts
function FlashAlerts() {
  const page = usePage();
  const { success, error, warning, info } = useAlert();

  const flash = (page.props as any)?.flash as
    | { success?: string; error?: string; warning?: string; info?: string; id?: string }
    | undefined;

  useEffect(() => {
    if (!flash) return;
    const hasAny = !!(flash.success || flash.error || flash.warning || flash.info);
    if (!hasAny) return;
    const duration = 5000; // 2 seconds as requested
    if (flash.success) success(flash.success, 'Sukses', duration);
    if (flash.error) error(flash.error, 'Error', duration);
    if (flash.warning) warning(flash.warning, 'Peringatan', duration);
    if (flash.info) info(flash.info, 'Info', duration);
    // Only react when flash id changes to allow identical messages repeating
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flash?.id]);

  return null;
}

export default function AppLayout({ children, breadcrumbs = [] }: AppLayoutProps) {
  return (
    <AlertProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              {/* Dynamic Breadcrumbs */}
              {breadcrumbs.length > 0 && (
                <Breadcrumb>
                  <BreadcrumbList>
                    {breadcrumbs.map((item, idx) => (
                      <Fragment key={idx}>
                        {item.href ? (
                          <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink href={item.href}>
                              {item.label}
                            </BreadcrumbLink>
                          </BreadcrumbItem>
                        ) : (
                          <BreadcrumbItem>
                            <BreadcrumbPage>{item.label}</BreadcrumbPage>
                          </BreadcrumbItem>
                        )}
                        {idx < breadcrumbs.length - 1 && (
                          <BreadcrumbSeparator className="hidden md:block" />
                        )}
                      </Fragment>
                    ))}
                  </BreadcrumbList>
                </Breadcrumb>
              )}
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </SidebarInset>
        {/* Flash messages hook */}
        <FlashAlerts />
      </SidebarProvider>
    </AlertProvider>
  )
}
