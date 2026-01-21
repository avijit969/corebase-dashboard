"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { api } from '@/lib/api';

interface AddColumnDialogProps {
    apiKey: string;
    tableName: string;
    onColumnAdded: () => void;
    children?: React.ReactNode;
}

export function AddColumnDialog({ apiKey, tableName, onColumnAdded, children }: AddColumnDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Column State
    const [name, setName] = useState('');
    const [type, setType] = useState('text');
    const [defaultValue, setDefaultValue] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("Column name is required");
            return;
        }

        try {
            setLoading(true);
            const columnDef = {
                name,
                type,
                ...(defaultValue ? { default: defaultValue } : {})
            };

            await api.db.addColumn(apiKey, tableName, columnDef);
            toast.success(`Column '${name}' added to '${tableName}'`);
            setOpen(false);
            onColumnAdded();

            // Reset
            setName('');
            setType('text');
            setDefaultValue('');
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to add column");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="bg-neutral-900 border-white/10 text-white max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Column</DialogTitle>
                    <DialogDescription>
                        Add a new column to <strong>{tableName}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                    <div className="space-y-2">
                        <Label>Column Name</Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., status, description"
                            className="bg-black/50 border-white/10 text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Type</Label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-white/10 bg-black/50 px-3 py-2 text-sm text-white focus:outline-hidden"
                        >
                            <option value="text">Text</option>
                            <option value="integer">Integer</option>
                            <option value="boolean">Boolean</option>
                            <option value="datetime">DateTime</option>
                            <option value="json">JSON</option>
                            <option value="float">Float</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label>Default Value (Optional)</Label>
                        <Input
                            value={defaultValue}
                            onChange={(e) => setDefaultValue(e.target.value)}
                            placeholder="e.g., 'active', 0"
                            className="bg-black/50 border-white/10 text-white"
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700 text-white">
                            {loading ? "Adding..." : "Add Column"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
