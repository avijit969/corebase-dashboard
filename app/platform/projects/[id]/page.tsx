"use client";

import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { ProjectOverview } from './_components/ProjectOverview';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';

export default function ProjectOverviewPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const fetchProject = async () => {
        const token = localStorage.getItem("platform_token");
        if (!token) {
            router.push("/platform/login");
            return null;
        }
        return await api.projects.get(id, token);
    };

    const { data: project, isLoading, isError, refetch } = useQuery({
        queryKey: ['project', id],
        queryFn: fetchProject,
        enabled: !!id,
    });

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    if (isLoading) {
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

    if (isError || !project) return <div className="p-4 text-white">Project not found</div>;

    return (
        <div className="space-y-6 p-4">
            <h2 className="text-2xl font-bold text-white">Database Overview</h2>
            <ProjectOverview
                project={project || {}}
                copyToClipboard={copyToClipboard}
                refreshProject={() => refetch()}
            />
        </div>
    );
}
