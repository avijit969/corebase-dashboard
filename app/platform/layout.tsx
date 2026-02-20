"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Layers, LogOut, Settings, User, Menu } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

import { MobileSidebar, PlatformSidebar } from '@/components/PlatformSidebar';

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const closeSidebar = React.useCallback(() => setSidebarOpen(false), []);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const router = useRouter();
    // check the user authentication
    useEffect(() => {
        const token = localStorage.getItem("platform_token");
        // todo: check from the backend
        if (!token) {
            router.push("/platform/login");
        }
        setIsAuthLoading(false);
    }, [router])
    if (isAuthLoading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }
    // Conditionally render layout based on route
    if (pathname?.startsWith('/platform/login') || pathname?.startsWith('/platform/signup')) {
        return (
            <div className="min-h-screen bg-black text-white font-sans overflow-auto relative">
                {/* Background Gradients for Auth Pages */}
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none" />
                {children}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white flex font-sans">
            <PlatformSidebar />
            <MobileSidebar isOpen={sidebarOpen} onClose={closeSidebar} />

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-neutral-900/20 relative">
                {/* Mobile Header */}
                <div className="md:hidden h-16 border-b border-white/10 flex items-center px-4 bg-black sticky top-0 z-40 gap-3">
                    <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="-ml-2 text-gray-400 hover:text-white">
                        <Menu className="w-5 h-5" />
                    </Button>
                    <Link href="/" className="flex items-center">
                        <img src="/logo/dark.svg" alt="CoreBase Logo" className="h-6 w-auto" />
                    </Link>
                </div>
                {children}
            </main>
        </div>
    );
}


