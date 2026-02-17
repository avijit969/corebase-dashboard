"use client";

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { ProjectUsers } from '../../_components/ProjectUsers';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';

export default function ProjectUsersPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    useEffect(() => {
        if (!localStorage.getItem("platform_token")) {
            router.push("/platform/login");
            return;
        }
    }, [router]);

    const fetchUsers = async (projectId: string) => {
        try {
            const data = await api.projects.getUsers(projectId);
            return data.users || [];
        } catch (error: any) {
            console.error("Failed to fetch project users", error);
            toast.error("Failed to load users");
            return [];
        }
    };
    const { refetch, data: users, isLoading } = useQuery({
        queryKey: ["project-users", id],
        queryFn: () => fetchUsers(id),
        enabled: !!id,
    })
    if (isLoading) {
        return (
            <div className="space-y-6 pt-4">
                <Skeleton className="h-8 w-32 bg-white/10" />
                <div className="border border-white/10 rounded-lg p-4 bg-neutral-900/50">
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-full bg-white/5" />
                        <Skeleton className="h-12 w-full bg-white/5" />
                        <Skeleton className="h-12 w-full bg-white/5" />
                        <Skeleton className="h-12 w-full bg-white/5" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pt-4">
            <ProjectUsers users={users || []} refetch={refetch} />
        </div>
    );
}
