"use client";

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import EmailSidebar from './EmailSidebar';
import EmailEditor from './EmailEditor';
import { Plus, Mail as MailIcon } from 'lucide-react';

export interface EmailManagerProps {
    apiKey: string;
    projectId: string;
    projectName: string;
}

export default function EmailManager({ apiKey, projectId, projectName }: EmailManagerProps) {
    const queryClient = useQueryClient();
    const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);

    const { data: emails, isLoading } = useQuery({
        queryKey: ['custom-emails', projectId],
        queryFn: () => api.customEmail.list(apiKey),
        enabled: !!apiKey,
    });
    console.log(emails);
    const emailConfigs = emails?.result || [];

    // Auto select first if none selected
    React.useEffect(() => {
        if (!selectedEmailId && emailConfigs.length > 0) {
            setSelectedEmailId(emailConfigs[0].id);
        }
    }, [emailConfigs.length, selectedEmailId, emailConfigs]);

    const selectedEmail = emailConfigs.find((e: any) => e.id === selectedEmailId) || null;

    const createMutation = useMutation({
        mutationFn: async (name: string) => {
            return await api.customEmail.create(apiKey, {
                name,
                subject: "New Email Template",
                body: "Hi {{user.name}}, here is your email!"
            });
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['custom-emails', projectId] });
            if (data?.data?.email?.id) {
                setSelectedEmailId(data.data.email.id);
            }
            toast.success("Template created!");
        },
        onError: (err: any) => {
            toast.error(err.message || "Failed to create template");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            return await api.customEmail.delete(apiKey, id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['custom-emails', projectId] });
            setSelectedEmailId(null);
            toast.success("Template deleted!");
        },
        onError: (err: any) => {
            toast.error(err.message || "Failed to delete template");
        }
    });

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)] min-h-[600px] border border-white/10 rounded-xl overflow-hidden bg-neutral-900/40">
            {/* Sidebar List */}
            <div className="w-full lg:w-72 bg-neutral-950/80 border-r border-white/5 flex flex-col pt-4">
                <EmailSidebar
                    emails={emailConfigs}
                    selectedEmailId={selectedEmailId}
                    onSelect={(id) => setSelectedEmailId(id)}
                    onCreate={(name) => createMutation.mutate(name)}
                    onDelete={(id) => deleteMutation.mutate(id)}
                    isLoading={isLoading}
                />
            </div>

            {/* Main Editor Area */}
            <div className="flex-1 flex flex-col bg-neutral-900/50 backdrop-blur-sm p-4 overflow-y-auto w-full relative">
                {selectedEmail ? (
                    <EmailEditor
                        key={selectedEmail.id}
                        email={selectedEmail}
                        apiKey={apiKey}
                        projectId={projectId}
                        projectName={projectName}
                    />
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60 pointer-events-none p-10">
                        <MailIcon className="w-16 h-16 text-white/20 mb-4" />
                        <h3 className="text-xl font-medium text-white mb-2">Select a Template</h3>
                        <p className="text-sm text-neutral-400 max-w-sm">Choose an email template from the sidebar or create a new one to begin editing.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
