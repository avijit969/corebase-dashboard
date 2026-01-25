"use client";

import React from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import {
    Box,
    Plus,
    MoreVertical,
    Trash2,
    Globe,
    Lock,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { CreateBucketDialog } from './CreateBucketDialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Bucket {
    id: string;
    name: string;
    public: boolean;
    created_at: string;
}

interface BucketSidebarProps {
    apiKey: string;
    selectedBucket: string | null;
    onSelectBucket: (name: string | null) => void;
    className?: string;
}

export function BucketSidebar({ apiKey, selectedBucket, onSelectBucket, className }: BucketSidebarProps) {
    const queryClient = useQueryClient();

    const { data: buckets = [], isLoading } = useQuery({
        queryKey: ['storage-buckets', apiKey],
        queryFn: async () => {
            if (!apiKey) return [];
            const res = await api.storage.listBuckets(apiKey);
            return res.buckets || [];
        },
        enabled: !!apiKey
    });

    const { mutate: deleteBucket } = useMutation({
        mutationFn: async (name: string) => {
            await api.storage.deleteBucket(apiKey, name);
            return name;
        },
        onSuccess: (name) => {
            toast.success(`Bucket '${name}' deleted`);
            queryClient.invalidateQueries({ queryKey: ['storage-buckets', apiKey] });
            if (selectedBucket === name) {
                onSelectBucket(null);
            }
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete bucket");
        }
    });

    const { mutate: emptyBucket } = useMutation({
        mutationFn: async (name: string) => {
            await api.storage.emptyBucket(apiKey, name);
            return name;
        },
        onSuccess: (name) => {
            toast.success(`Bucket '${name}' emptied`);
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to empty bucket");
        }
    });

    const handleDeleteBucket = (name: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm(`Are you sure you want to delete bucket '${name}'? It must be empty.`)) return;
        deleteBucket(name);
    };

    const handleEmptyBucket = (name: string) => {
        if (!confirm(`Are you sure you want to empty bucket '${name}'? This will delete all files.`)) return;
        emptyBucket(name);
    };

    return (
        <div className={cn("w-64 border-r border-white/10 flex flex-col h-full bg-black/20", className)}>
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <span className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">Buckets</span>
                <CreateBucketDialog apiKey={apiKey}>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-neutral-400 hover:text-white">
                        <Plus className="w-4 h-4" />
                    </Button>
                </CreateBucketDialog>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {isLoading && (
                    <div className="flex justify-center p-4">
                        <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />
                    </div>
                )}

                {!isLoading && buckets.map((bucket: Bucket) => (
                    <div
                        key={bucket.name}
                        onClick={() => onSelectBucket(bucket.name)}
                        className={cn(
                            "flex items-center justify-between p-2 rounded-lg cursor-pointer group transition-colors",
                            selectedBucket === bucket.name
                                ? "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                                : "text-neutral-400 hover:bg-white/5 hover:text-white border border-transparent"
                        )}
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <Box className="w-4 h-4 shrink-0" />
                            <div className="truncate text-sm font-medium">
                                {bucket.name}
                            </div>
                            {bucket.public ? (
                                <Globe className="w-3 h-3 text-green-500/70" />
                            ) : (
                                <Lock className="w-3 h-3 text-neutral-600" />
                            )}
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 lg:opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <MoreVertical className="w-3 h-3" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-neutral-900 border-white/10 text-white">
                                <DropdownMenuItem onClick={() => handleEmptyBucket(bucket.name)}>
                                    Empty Bucket
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={(e) => handleDeleteBucket(bucket.name, e as any)}
                                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                ))}

                {!isLoading && buckets.length === 0 && (
                    <div className="p-4 text-center text-xs text-neutral-600">
                        No buckets found. Create one to get started.
                    </div>
                )}
            </div>
        </div>
    );
}
