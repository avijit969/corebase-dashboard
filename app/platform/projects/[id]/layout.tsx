"use client";

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useProjectActions } from '@/lib/stores/project-store';
import { ProjectSidebar } from './_components/ProjectSidebar';
import { toast } from 'sonner';

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const { setProject } = useProjectActions();
    const [activeTab, setActiveTab] = React.useState<'overview' | 'users' | 'settings'>('overview');

    useEffect(() => {
        const fetchProject = async () => {
            const token = localStorage.getItem("platform_token");
            if (!token) return;

            try {
                const data = await api.projects.get(id, token);
                // Also ensure we handle the case where data might be nested or have different structure
                // But api.projects.get uses handleResponse which returns data.data.
                // Assuming data is ProjectDetails based on API_DOCUMENTATION
                if (data) {
                    setProject(data);
                }
            } catch (error) {
                console.error("Failed to fetch project for layout", error);
                // toast.error("Failed to load project context"); 
                // Don't toast here to avoid duplicates if pages also fetch
            }
        };

        if (id) {
            fetchProject();
        }
    }, [id, setProject]);

    // Handle Tab Sync based on path
    // We already have logic in ProjectSidebar, but we can improve it

    return (
        <>
            {children}
        </>
    );
}
