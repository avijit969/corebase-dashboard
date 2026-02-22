"use client";

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Mail } from 'lucide-react';
import EmailManager from './_components/EmailManager';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useProjectStore } from '@/lib/stores/project-store';

export default function CustomEmailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const { currentApiKey, currentProjectName, setApiKey, setProjectId, setProjectName } = useProjectStore();
    console.log("current api key", currentApiKey);
    console.log("current project name", currentProjectName);
    useEffect(() => {
        if (!localStorage.getItem("platform_token")) {
            router.push("/platform/login");
            return;
        }
    }, [router]);

    // Ensure we have project details if directly loaded

    if (!currentApiKey) {
        return (
            <div className="flex items-center justify-center min-h-[500px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pt-4 px-4 pb-12 w-full max-w-7xl mx-auto animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <div className="p-2 bg-primary-500/10 rounded-lg border border-primary-500/20">
                            <Mail className="w-6 h-6 text-primary-500" />
                        </div>
                        Custom Emails
                    </h1>
                    <p className="text-neutral-400 mt-2 text-sm max-w-lg">
                        Manage all your custom email templates and send emails to your users.
                    </p>
                </div>
            </div>

            <EmailManager apiKey={currentApiKey} projectId={id} projectName={currentProjectName || "App"} />
        </div>
    );
}
