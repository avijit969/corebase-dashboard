"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { ProjectSettings } from '../_components/ProjectSettings';
import { ProjectDetails } from '../types';
import { Loader2 } from 'lucide-react';

export default function ProjectSettingsPage() {
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
            console.error("Failed to fetch project", error);
            toast.error("Failed to load project settings");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProject = async () => {
        if (!project || !id) return;

        if (!confirm(`Are you sure you want to delete ${project.meta.name}? This action cannot be undone.`)) {
            return;
        }

        try {
            const token = localStorage.getItem("platform_token");
            if (!token) return;

            await api.projects.delete(id, token);
            toast.success("Project deleted successfully");
            router.push('/platform');
        } catch (error: any) {
            toast.error("Failed to delete project");
        }
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    if (!project) return <div>Project not found</div>;

    return (
        <div className="space-y-6 p-4">
            <h2 className="text-2xl font-bold text-white">Settings</h2>
            <ProjectSettings handleDeleteProject={handleDeleteProject} />
        </div>
    );
}
