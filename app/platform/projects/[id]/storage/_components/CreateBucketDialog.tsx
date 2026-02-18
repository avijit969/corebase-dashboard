"use client";

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface CreateBucketDialogProps {
    apiKey: string;
    onSuccess?: () => void;
    children?: React.ReactNode;
}

export function CreateBucketDialog({ apiKey, onSuccess, children }: CreateBucketDialogProps) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const queryClient = useQueryClient();

    const { mutate: createBucket, isPending } = useMutation({
        mutationFn: async (data: { name: string; public: boolean }) => {
            return api.storage.createBucket(apiKey, data);
        },
        onSuccess: () => {
            toast.success(`Bucket '${name}' created successfully`);
            queryClient.invalidateQueries({ queryKey: ['storage-buckets', apiKey] });
            setOpen(false);
            setName('');
            setIsPublic(false);
            if (onSuccess) onSuccess();
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(error.message || "Failed to create bucket");
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("Bucket name is required");
            return;
        }

        // Basic validation for bucket names (alphanumeric + dashes/underscores)
        if (!/^[a-zA-Z0-9-_]+$/.test(name)) {
            toast.error("Bucket name can only contain letters, numbers, dashes, and underscores");
            return;
        }

        createBucket({ name, public: isPublic });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="bg-neutral-900 border-white/10 text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create New Bucket</DialogTitle>
                    <DialogDescription>
                        Create a new logical bucket to organize your files.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="space-y-2">
                        <Label>Bucket Name</Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. avatars, documents"
                            className="bg-black/50 border-white/10"
                            autoFocus
                        />
                        <p className="text-xs text-neutral-400">
                            Unique identifier for this bucket.
                        </p>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5">
                        <div className="space-y-0.5">
                            <Label className="text-base text-white">Public Access</Label>
                            <p className="text-xs text-neutral-400">
                                Files can be accessed without a signed URL.
                            </p>
                        </div>
                        <Switch
                            checked={isPublic}
                            onCheckedChange={setIsPublic}
                            className="data-[state=checked]:bg-primary-600"
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setOpen(false)}
                            className="hover:bg-white/5 text-neutral-300"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="bg-primary-600 hover:bg-primary-700 text-white"
                        >
                            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Bucket"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
