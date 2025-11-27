import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    links: PaginationLink[];
}

export default function Pagination({ links }: Props) {
    if (links.length <= 3) return null;

    return (
        <div className="flex flex-wrap justify-center gap-2 mt-12">
            {links.map((link, key) => {
                // Parse label to handle HTML entities like &laquo; and &raquo;
                let label = link.label;
                if (label.includes('&laquo;')) label = 'Previous';
                if (label.includes('&raquo;')) label = 'Next';

                // For Previous/Next with icons
                const isPrev = label === 'Previous';
                const isNext = label === 'Next';

                if (link.url === null) {
                    return (
                        <Button
                            key={key}
                            variant="outline"
                            disabled
                            className="opacity-50 cursor-not-allowed"
                        >
                            {isPrev ? <ChevronLeft className="w-4 h-4" /> : isNext ? <ChevronRight className="w-4 h-4" /> : <span dangerouslySetInnerHTML={{ __html: link.label }} />}
                        </Button>
                    );
                }

                return (
                    <Link key={key} href={link.url} preserveScroll>
                        <Button
                            variant={link.active ? "default" : "outline"}
                            className={link.active ? "bg-blue-600 hover:bg-blue-700" : "bg-white/5 hover:bg-white/10 border-white/10 text-white hover:text-blue-400"}
                        >
                            {isPrev ? <ChevronLeft className="w-4 h-4" /> : isNext ? <ChevronRight className="w-4 h-4" /> : <span dangerouslySetInnerHTML={{ __html: link.label }} />}
                        </Button>
                    </Link>
                );
            })}
        </div>
    );
}
