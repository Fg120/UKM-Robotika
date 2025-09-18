import { cn } from '@/lib/utils';
import { type PropsWithChildren } from 'react';

interface AdminShellProps extends PropsWithChildren {
    className?: string;
}

export function AdminShell({ children, className }: AdminShellProps) {
    return (
        <div className={cn(
            "min-h-screen bg-[background] font-sans antialiased",
            "relative flex h-screen overflow-hidden",
            className
        )}>
            {children}
        </div>
    );
}