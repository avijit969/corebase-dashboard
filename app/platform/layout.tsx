"use client";
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Layers, LogOut, Settings, User } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Conditionally render layout based on route
    if (pathname?.startsWith('/platform/login') || pathname?.startsWith('/platform/signup')) {
        return (
            <div className="min-h-screen bg-black text-white font-sans overflow-auto relative">
                {/* Background Gradients for Auth Pages */}
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none" />
                {children}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white flex font-sans">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 bg-black p-4 hidden md:flex flex-col sticky top-0 h-screen">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter mb-8 px-2 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 rounded-lg bg-linear-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                        <Layers className="w-5 h-5 text-white" />
                    </div>
                    CoreBase
                </Link>

                <div className="mb-6 px-2">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Platform</div>
                    <nav className="space-y-1">
                        <NavLink href="/platform" icon={<Layers className="w-4 h-4" />}>Projects</NavLink>
                        <NavLink href="/platform/settings" icon={<Settings className="w-4 h-4" />}>Settings</NavLink>
                    </nav>
                </div>

                <div className="mt-auto border-t border-white/10 pt-4">
                    <div className="flex items-center gap-3 px-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center border border-white/10">
                            <User className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium text-white truncate">Dev Account</p>
                            <p className="text-xs text-gray-500 truncate">dev@corebase.com</p>
                        </div>
                    </div>
                    <NavLink href="/" icon={<LogOut className="w-4 h-4" />}>Sign Out</NavLink>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-neutral-900/20 relative">
                {/* Mobile Header */}
                <div className="md:hidden h-16 border-b border-white/10 flex items-center px-4 bg-black sticky top-0 z-40">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter">
                        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                            <Layers className="w-5 h-5 text-white" />
                        </div>
                        CoreBase
                    </Link>
                </div>
                {children}
            </main>
        </div>
    );
}

function NavLink({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
    const pathname = usePathname();
    // Simple check if pathname starts with href, but exact match for /platform
    const isActive = href === '/platform' ? pathname === href : pathname?.startsWith(href);

    return (
        <Link href={href}>
            <Button
                variant="ghost"
                className={`w-full justify-start gap-2 ${isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
                {icon}
                {children}
            </Button>
        </Link>
    )
}
