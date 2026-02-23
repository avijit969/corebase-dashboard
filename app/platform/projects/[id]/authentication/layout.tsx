"use client";

import React from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Users, Shield, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthDocsSheet } from './_components/AuthDocsSheet';

export default function AuthenticationLayout({ children }: { children: React.ReactNode }) {
    const params = useParams();
    const router = useRouter();
    const pathname = usePathname();
    const id = params?.id as string;
    const [openDocs, setOpenDocs] = React.useState(false);

    const tabs = [
        { id: 'users', label: 'Users', icon: Users, path: `/platform/projects/${id}/authentication/users` },
        { id: 'providers', label: 'Providers', icon: Shield, path: `/platform/projects/${id}/authentication/providers` },
    ];

    const currentTab = tabs.find(tab => pathname?.includes(tab.path))?.id || 'users';

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Authentication</h1>
                    <p className="text-gray-400 mt-1">Manage your project's users and authentication methods.</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setOpenDocs(true)}>
                    <BookOpen className="w-4 h-4 mr-2" />
                    Docs
                </Button>
            </div>

            <div className="border-b border-white/10">
                <div className="flex gap-4">
                    {tabs.map((tab) => {
                        const isActive = pathname?.includes(tab.path);
                        return (
                            <button
                                key={tab.id}
                                onClick={() => router.push(tab.path)}
                                className={`relative pb-4 px-2 flex items-center gap-2 text-sm font-medium transition-colors ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeAuthTab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="pt-2">
                {children}
            </div>

            <AuthDocsSheet open={openDocs} onOpenChange={setOpenDocs} />
        </div>
    );
}
