"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { ProjectUsers } from '../_components/ProjectUsers';
import { ProjectUser } from '../types';
import { Loader2 } from 'lucide-react';

export default function ProjectUsersPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [users, setUsers] = useState<ProjectUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("platform_token");
        if (!token) {
            router.push("/platform/login");
            return;
        }

        if (id) {
            fetchUsers(id, token);
        }
    }, [id, router]);

    const fetchUsers = async (projectId: string, token: string) => {
        try {
            setLoading(true);
            const data = await api.projects.getUsers(projectId, token);
            setUsers(data.users || []);
        } catch (error: any) {
            console.error("Failed to fetch project users", error);
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4">
            <h2 className="text-2xl font-bold text-white">Users</h2>
            <ProjectUsers users={users} />
        </div>
    );
}
