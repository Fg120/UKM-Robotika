"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import { useState, useEffect } from 'react'

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Link } from "@inertiajs/react"

export function NavMain({
    items,
}: {
    items: {
        title: string
        url: string
        icon?: LucideIcon
        items?: {
            icon?: LucideIcon
            title: string
            url: string
        }[]
    }[]
}) {
    // Current path and helper
    const path = typeof window !== 'undefined' ? window.location.pathname : ''
    const extractPath = (url: string) => {
        try { return new URL(url, window.location.origin).pathname } catch { return url }
    }
    // Track active state for each item after mount
    const [activeKeys, setActiveKeys] = useState<Record<string, boolean>>({})
    useEffect(() => {
        const currentPath = window.location.pathname
        // Helper to extract pathname from a URL or fallback string
        const extractUrl = (url: string) => {
            try {
                return new URL(url, window.location.origin).pathname
            } catch {
                return url
            }
        }
        const newActive: Record<string, boolean> = {}
        items.forEach(item => {
            const itemPath = extractUrl(item.url)
            const isActive =
                currentPath === itemPath || currentPath.startsWith(itemPath + '/') ||
                !!item.items?.some(child => {
                    const childPath = extractUrl(child.url)
                    return currentPath === childPath || currentPath.startsWith(childPath + '/')
                })
            newActive[item.title] = isActive
        })
        setActiveKeys(newActive)
    }, [items])
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarMenu>
                {items.map(item => {
                    // Check if item has sub-items (dropdown) or is a single item
                    const hasSubItems = item.items && item.items.length > 0;

                    if (!hasSubItems) {
                        // Single item without dropdown
                        const itemPath = extractPath(item.url)
                        const isActive = path === itemPath || path.startsWith(itemPath + '/')

                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild isActive={isActive} className="py-4" tooltip={item.title}>
                                    <Link href={item.url}>
                                        {item.icon && <item.icon />}
                                        <span className="font-medium">{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    }

                    // Dropdown item with sub-items
                    const isActive = activeKeys[item.title]
                    return (
                        <Collapsible
                            key={item.title}
                            asChild
                            open={isActive}
                            // Toggle active state on user click
                            onOpenChange={(open) => setActiveKeys(prev => ({ ...prev, [item.title]: open }))}
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton tooltip={item.title} className="py-4">
                                        {item.icon && <item.icon />}
                                        <span className="font-medium">{item.title}</span>
                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {item.items?.map((subItem) => {
                                            const subPath = extractPath(subItem.url)
                                            const isSubActive = path === subPath || path.startsWith(subPath + '/')
                                            return (
                                                <SidebarMenuSubItem key={subItem.title}>
                                                    <SidebarMenuSubButton asChild isActive={isSubActive} className="py-4">
                                                        <Link href={subItem.url}>
                                                            {subItem.icon && <subItem.icon />}
                                                            <span className="font-medium">{subItem.title}</span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            )
                                        })}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    )
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
}
