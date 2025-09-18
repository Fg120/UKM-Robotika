import { cn } from '@/lib/utils';
import { type PropsWithChildren } from 'react';

interface AdminContentProps extends PropsWithChildren {
    className?: string;
    isCollapsed?: boolean;
}

export function AdminContent({ children, className, isCollapsed = false }: AdminContentProps) {
    return (
        <div className={cn(
            "flex flex-1 flex-col min-h-0 overflow-hidden transition-all duration-300",
            // Responsive margin berdasarkan status collapse
            isCollapsed ? "lg:ml-16" : "lg:ml-64",
            className
        )}>
            {children}
        </div>
    );
}