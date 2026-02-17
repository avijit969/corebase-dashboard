"use client";

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useProjectStore } from '@/lib/stores/project-store';

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
    const params = useParams();
    const id = params?.id as string;
    const setApiKey = useProjectStore(state => state.setApiKey);

    useEffect(() => {
        const fetchProject = async () => {
            const token = localStorage.getItem("platform_token");
            if (!token) return;

            try {
                const data = await api.projects.get(id, token);
                if (data && (data.api_key || data.apiKey)) {
                    setApiKey(data.api_key || data.apiKey);
                }
            } catch (error) {
                console.error("Failed to fetch project for layout", error);
            }
        };

        if (id) {
            fetchProject();
        }
    }, [id, setApiKey]);

    return (
        <div className="flex h-screen bg-neutral-950 text-white overflow-hidden">
            <main className="flex-1 overflow-auto p-8 relative z-10">
                {children}
            </main>
        </div>
    );
}
