"use client";

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useProjectStore } from '@/lib/stores/project-store';
import { ProjectSidebar } from './_components/ProjectSidebar';
import { toast } from 'sonner';

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const setApiKey = useProjectStore(state => state.setApiKey);
    const [activeTab, setActiveTab] = React.useState<'overview' | 'users' | 'settings'>('overview');

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
        <>
            {children}
        </>
    );
}
