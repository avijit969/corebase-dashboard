import React from 'react';
import { Database, Users, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface ProjectSidebarProps {
    activeTab: 'overview' | 'users' | 'settings';
    setActiveTab: (tab: 'overview' | 'users' | 'settings') => void;
}

export function ProjectSidebar({ activeTab, setActiveTab }: ProjectSidebarProps) {
    const tabs = [
        { id: 'overview', label: 'Overview', icon: Database },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'settings', label: 'Settings', icon: Settings },
    ] as const;

    return (
        <aside className="w-full md:w-64 flex flex-col gap-2">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-4">Menu</div>
            <nav className="space-y-1">
                {tabs.map((tab) => (
                    <Button
                        key={tab.id}
                        variant="ghost"
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full justify-start gap-2 relative ${activeTab === tab.id
                                ? 'bg-white/10 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="activePrejectTab"
                                className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500 rounded-r-full"
                            />
                        )}
                    </Button>
                ))}
            </nav>
        </aside>
    );
}
