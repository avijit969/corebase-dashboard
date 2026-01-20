"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { ProjectOverview } from './_components/ProjectOverview';
import { ProjectDetails } from './types';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProjectOverviewPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [project, setProject] = useState<ProjectDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("platform_token");
        if (!token) {
            router.push("/platform/login");
            return;
        }

        if (id) {
            fetchProject(id, token);
        }
    }, [id, router]);

    const fetchProject = async (projectId: string, token: string) => {
        try {
            setLoading(true);
            const data = await api.projects.get(projectId, token);
            setProject(data);
        } catch (error: any) {
            console.error("Failed to fetch project details", error);
            toast.error("Failed to load project details");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    if (loading) {
        return (
            <div className="space-y-6 p-4">
                <Skeleton className="h-8 w-48 bg-white/10" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Skeleton className="col-span-2 h-64 bg-white/10 rounded-lg" />
                    <Skeleton className="h-64 bg-white/10 rounded-lg" />
                </div>
            </div>
        );
    }

    if (!project) return <div>Project not found</div>;

    return (
        <div className="space-y-6 p-4">
            <h2 className="text-2xl font-bold text-white">Database Overview</h2>
            <ProjectOverview project={project} copyToClipboard={copyToClipboard} />
        </div>
    );
}
