"use client"
import React, { useEffect } from 'react';
import Sidebar from "./Sidebar";
import { SidebarProvider, useSidebar } from "./SidebarContext";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MainContent({ children }: { children: React.ReactNode }) {
    const { isCollapsed } = useSidebar();
    const { user, loading } = useAuthStore();
    const pathname = usePathname();
    const isPublicPage = ['/', '/login', '/signup'].includes(pathname);

    if (loading) {
        return null; // or a better loading spinner
    }

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
    const { checkAuth } = useAuthStore();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        checkAuth(pathname, router);
    }, [pathname]);

    return (
        <SidebarProvider>
            <SidebarWrapper />
            <MainContent>{children}</MainContent>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </SidebarProvider>
    );
}

function SidebarWrapper() {
    const { user, loading } = useAuthStore();
    const pathname = usePathname();
    const isPublicPage = ['/', '/login', '/signup'].includes(pathname);

    if (loading || !user || isPublicPage) return null;
    return <Sidebar />;
}
