'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Compass,
    LayoutList,
    History,
    Settings,
    ChevronLeft,
    ChevronRight,
    Zap
} from 'lucide-react';
import { LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useSidebar } from './SidebarContext';
import { useAuth } from './AuthContext';

const menuItems = [
    { name: 'Discovery', icon: Compass, path: '/companies' },
    { name: 'My Lists', icon: LayoutList, path: '/lists' },
    { name: 'Saved Searches', icon: History, path: '/saved' },
    { name: 'Settings', icon: Settings, path: '/settings' },
];

export default function Sidebar() {
    const { isCollapsed, toggle } = useSidebar();
    const { user, logout } = useAuth();
    const pathname = usePathname();

    return (
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? '80px' : '260px' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={cn(
                "fixed left-0 top-0 h-screen bg-[#0d0d0d] border-r border-white/5 z-50 flex flex-col"
            )}
        >
            <div className="p-6 flex items-center justify-between">
                {!isCollapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2 font-bold text-xl tracking-tight text-white"
                    >
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                            <Zap className="w-5 h-5 text-white fill-white" />
                        </div>
                        <span>Antigravity</span>
                    </motion.div>
                )}
                {isCollapsed && (
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center mx-auto">
                        <Zap className="w-5 h-5 text-white fill-white" />
                    </div>
                )}
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={cn(
                                "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                                isActive
                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon className={cn(
                                "w-5 h-5 flex-shrink-0 transition-transform duration-200",
                                !isActive && "group-hover:scale-110"
                            )} />
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="font-medium"
                                >
                                    {item.name}
                                </motion.span>
                            )}
                            {isCollapsed && (
                                <div className="absolute left-full ml-6 px-3 py-1 bg-card border border-border rounded-md text-xs font-medium opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                    {item.name}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-border/50 flex flex-col gap-2">
                {!isCollapsed && user && (
                    <div className="px-4 py-2 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold border border-primary/50">
                            {user.name?.[0] || user.email?.[0]?.toUpperCase()}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-bold truncate text-white">{user.name || 'User'}</span>
                            <span className="text-[10px] text-muted-foreground truncate">{user.email}</span>
                        </div>
                    </div>
                )}

                <button
                    onClick={logout}
                    className={cn(
                        "w-full flex items-center gap-4 px-4 py-3 rounded-xl text-muted-foreground hover:bg-red-300/10 hover:text-red-300 transition-all duration-200 group relative"
                    )}
                >
                    <LogOut className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
                </button>

                <button
                    onClick={toggle}
                    className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white transition-colors"
                >
                    {isCollapsed ? <ChevronRight className="w-5 h-5" /> : (
                        <div className="flex items-center gap-2">
                            <ChevronLeft className="w-5 h-5" />
                            <span className="text-sm font-medium">Collapse</span>
                        </div>
                    )}
                </button>
            </div>
        </motion.aside>
    );
}
