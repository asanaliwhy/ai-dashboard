"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type SidebarItemProps = {
    href: string,
    label: string,
}

export function SidebarItem({href, label}: SidebarItemProps){
   const pathName = usePathname();
   const isActive = pathName === href;

   return (
    <Link href={href} className={cn(
        "flex items-center rounded-lg px-4 py-2 transition-colors",
        isActive ? "text-primary" : "text-muted-foreground"
    )}>
        <span className="capitalize">{label}</span>
    </Link>
   )
}