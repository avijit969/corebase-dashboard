"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { api } from '@/lib/api';

interface AddForeignKeyDialogProps {
    apiKey: string;
    tableName: string;
    existingColumns: string[];
    onSuccess: () => void;
    children?: React.ReactNode;
}

export function AddForeignKeyDialog({ apiKey, tableName, existingColumns, onSuccess, children }: AddForeignKeyDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // FK State
    const [column, setColumn] = useState(existingColumns[0] || '');
    const [refTable, setRefTable] = useState('');
    const [refColumn, setRefColumn] = useState('id');
    const [onDelete, setOnDelete] = useState('cascade');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!column || !refTable || !refColumn) {
            toast.error("All fields are required");
            return;
        }

        try {
            setLoading(true);
            const fkDef = {
                column,
                references: {
                    table: refTable,
                    column: refColumn,
                    onDelete
                }
            };

            await api.db.addForeignKey(apiKey, tableName, fkDef);
            toast.success(`Foreign key added to '${tableName}'`);
            setOpen(false);
            onSuccess();

            // Reset
            setRefTable('');
            setRefColumn('id');
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to add foreign key");
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
                    <DialogTitle>Add Foreign Key</DialogTitle>
                    <DialogDescription>
                        Link a column in <strong>{tableName}</strong> to another table.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                    <div className="space-y-2">
                        <Label>Column in {tableName}</Label>
                        <select
                            value={column}
                            onChange={(e) => setColumn(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-white/10 bg-black/50 px-3 py-2 text-sm text-white focus:outline-hidden"
                        >
                            {existingColumns.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label>Referenced Table</Label>
                        <Input
                            value={refTable}
                            onChange={(e) => setRefTable(e.target.value)}
                            placeholder="e.g., users"
                            className="bg-black/50 border-white/10 text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Referenced Column</Label>
                        <Input
                            value={refColumn}
                            onChange={(e) => setRefColumn(e.target.value)}
                            placeholder="e.g., id"
                            className="bg-black/50 border-white/10 text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>On Delete</Label>
                        <select
                            value={onDelete}
                            onChange={(e) => setOnDelete(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-white/10 bg-black/50 px-3 py-2 text-sm text-white focus:outline-hidden"
                        >
                            <option value="cascade">Cascade</option>
                            <option value="set null">Set Null</option>
                            <option value="restrict">Restrict</option>
                            <option value="no action">No Action</option>
                        </select>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700 text-white">
                            {loading ? "Adding..." : "Add Relation"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
