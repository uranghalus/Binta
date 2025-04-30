'use client';

import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { NavCollapsible, NavItem, NavLink, type NavGroup } from '@/types/layout';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { ReactNode } from 'react';

export function NavGroup({ title, items }: NavGroup) {
    const { state } = useSidebar();
    const { url } = usePage();

    return (
        <SidebarGroup>
            <SidebarGroupLabel>{title}</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const key = `${item.title}-${item.url}`;

                    if (!item.items) return <SidebarMenuLink key={key} item={item} href={url} />;
                    if (state === 'collapsed') return <SidebarMenuCollapsedDropdown key={key} item={item} href={url} />;

                    return <SidebarMenuCollapsible key={key} item={item} href={url} />;
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}

const NavBadge = ({ children }: { children: ReactNode }) => <Badge className="rounded-full px-1 py-0 text-xs">{children}</Badge>;

const SidebarMenuLink = ({ item, href }: { item: NavLink; href: string }) => {
    const { setOpenMobile } = useSidebar();
    return (
        <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={checkIsActive(href, item)} tooltip={item.title}>
                <Link href={item.url} onClick={() => setOpenMobile(false)}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    {item.badge && <NavBadge>{item.badge}</NavBadge>}
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
};

const SidebarMenuCollapsible = ({ item, href }: { item: NavCollapsible; href: string }) => {
    const { setOpenMobile } = useSidebar();
    return (
        <Collapsible asChild defaultOpen={checkIsActive(href, item, true)} className="group/collapsible">
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        {item.badge && <NavBadge>{item.badge}</NavBadge>}
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {item.items.map((subItem: NavLink) => (
                            <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild isActive={checkIsActive(href, subItem)}>
                                    <Link href={subItem.url} onClick={() => setOpenMobile(false)}>
                                        {subItem.icon && <subItem.icon />}
                                        <span>{subItem.title}</span>
                                        {subItem.badge && <NavBadge>{subItem.badge}</NavBadge>}
                                    </Link>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    );
};

const SidebarMenuCollapsedDropdown = ({ item, href }: { item: NavCollapsible; href: string }) => {
    return (
        <SidebarMenuItem>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <SidebarMenuButton tooltip={item.title} isActive={checkIsActive(href, item)}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        {item.badge && <NavBadge>{item.badge}</NavBadge>}
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="start" sideOffset={4}>
                    <DropdownMenuLabel>
                        {item.title} {item.badge ? `(${item.badge})` : ''}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {item.items.map((sub: NavLink) => (
                        <DropdownMenuItem key={`${sub.title}-${sub.url}`} asChild>
                            <Link href={sub.url} className={checkIsActive(href, sub) ? 'bg-secondary' : ''}>
                                {sub.icon && <sub.icon />}
                                <span className="max-w-52 text-wrap">{sub.title}</span>
                                {sub.badge && <span className="ml-auto text-xs">{sub.badge}</span>}
                            </Link>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarMenuItem>
    );
};

function checkIsActive(href: string, item: NavItem, mainNav = false): boolean {
    const cleanedHref = href.split('?')[0];
    const cleanedItemUrl = item.url?.split('?')[0] ?? '';

    if (cleanedHref === cleanedItemUrl) return true;

    if (item.items?.some((i) => cleanedHref === i.url?.split('?')[0])) return true;

    if (mainNav) {
        const hrefSegment = cleanedHref.split('/')[1];
        const itemSegment = cleanedItemUrl.split('/')[1];
        if (hrefSegment && itemSegment && hrefSegment === itemSegment) return true;
    }

    return false;
}
