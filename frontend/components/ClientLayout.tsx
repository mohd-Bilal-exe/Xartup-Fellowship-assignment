'use client';

import React from 'react';
import Sidebar from "./Sidebar";
import { SidebarProvider, useSidebar } from "./SidebarContext";
import { AuthProvider, useAuth } from "./AuthContext";
import { cn } from "@/lib/utils";
import { usePathname } from 'next/navigation';

function MainContent({ children }: { children: React.ReactNode }) {
    const { isCollapsed } = useSidebar();
    const { user } = useAuth();
    const pathname = usePathname();
    const isPublicPage = ['/', '/login', '/signup'].includes(pathname);

    return (
        <main
            className={cn(
                "min-h-screen transition-all duration-300 ease-in-out",
                !user || isPublicPage ? "pl-0" : (isCollapsed ? "pl-20" : "pl-[260px]")
            )}
        >
            <div className={cn(
                "mx-auto",
                !user || isPublicPage ? "" : "max-w-7xl p-8"
            )}>
                {children}
            </div>
        </main>
    );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <SidebarProvider>
                <SidebarWrapper />
                <MainContent>{children}</MainContent>
            </SidebarProvider>
        </AuthProvider>
    );
}

function SidebarWrapper() {
    const { user } = useAuth();
    const pathname = usePathname();
    const isPublicPage = ['/', '/login', '/signup'].includes(pathname);

    if (!user || isPublicPage) return null;
    return <Sidebar />;
}
