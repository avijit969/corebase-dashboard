"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { ProjectDetails } from '../types';
import { useProjectStore } from '@/lib/stores/project-store';

interface CreateTableDialogProps {
    project: ProjectDetails;
    onTableCreated: () => void;
    children?: React.ReactNode;
}

interface ColumnDef {
    name: string;
    type: string;
    primary: boolean;
    notNull: boolean;
    defaultValue: string;
}

export function CreateTableDialog({ project, onTableCreated, children }: CreateTableDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [tableName, setTableName] = useState('');
    const [columns, setColumns] = useState<ColumnDef[]>([
        { name: 'id', type: 'integer', primary: true, notNull: true, defaultValue: '' }
    ]);
    const { currentApiKey } = useProjectStore()
    const addColumn = () => {
        setColumns([...columns, { name: '', type: 'text', primary: false, notNull: false, defaultValue: '' }]);
    };

    const removeColumn = (index: number) => {
        if (columns.length <= 1) return;
        setColumns(columns.filter((_, i) => i !== index));
    };

    const updateColumn = (index: number, field: keyof ColumnDef, value: any) => {
        const newColumns = [...columns];
        newColumns[index] = { ...newColumns[index], [field]: value };
        setColumns(newColumns);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!tableName.trim()) {
            toast.error("Table name is required");
            return;
        }

        if (columns.some(c => !c.name.trim())) {
            toast.error("All columns must have a name");
            return;
        }

        try {
            setLoading(true);
            const apiKey = currentApiKey;

            if (!apiKey) {
                console.error("Project object missing API Key:", project);
                toast.error("Project API Key not found. Cannot create table.");
                return;
            }

            const schema = {
                table: tableName,
                columns: columns.map(c => ({
                    name: c.name,
                    type: c.type,
                    primary: c.primary,
                    notNull: c.notNull,
                    ...(c.defaultValue ? { default: c.defaultValue } : {})
                })),
                rls: {
                    select: "true",
                    insert: "true",
                    update: "true",
                    delete: "true"
                }
            };

            await api.db.createTable(apiKey, schema);
            toast.success(`Table '${tableName}' created successfully`);
            setOpen(false);
            onTableCreated();

            // Reset form
            setTableName('');
            setColumns([{ name: 'id', type: 'integer', primary: true, notNull: true, defaultValue: '' }]);
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to create table");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="bg-neutral-900 border-white/10 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Table</DialogTitle>
                    <DialogDescription>
                        Define the structure of your new database table.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    <div className="space-y-2">
                        <Label>Table Name</Label>
                        <Input
                            value={tableName}
                            onChange={(e) => setTableName(e.target.value)}
                            placeholder="e.g., users, posts, products"
                            className="bg-black/50 border-white/10 text-white"
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Columns</Label>
                            <Button type="button" variant="outline" size="sm" onClick={addColumn} className="h-8 border-white/10 hover:bg-white/5">
                                <Plus className="w-3 h-3 mr-1" /> Add Column
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {columns.map((column, index) => (
                                <div key={index} className="flex flex-col gap-3 p-3 bg-white/5 rounded-lg border border-white/5 relative group">
                                    <div className="grid grid-cols-12 gap-3 items-start">
                                        <div className="col-span-4">
                                            <Input
                                                value={column.name}
                                                onChange={(e) => updateColumn(index, 'name', e.target.value)}
                                                placeholder="Column Name"
                                                className="bg-black/50 border-white/10 h-8 text-xs"
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <Select
                                                value={column.type}
                                                onValueChange={(value) => updateColumn(index, 'type', value)}
                                            >
                                                <SelectTrigger className="h-8 w-full bg-black/50 border-white/10 text-xs text-white">
                                                    <SelectValue placeholder="Type" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-neutral-900 border-white/10 text-gray-300">
                                                    <SelectItem value="text">Text</SelectItem>
                                                    <SelectItem value="integer">Integer</SelectItem>
                                                    <SelectItem value="boolean">Boolean</SelectItem>
                                                    <SelectItem value="datetime">DateTime</SelectItem>
                                                    <SelectItem value="json">JSON</SelectItem>
                                                    <SelectItem value="float">Float</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="col-span-4">
                                            <Input
                                                value={column.defaultValue}
                                                onChange={(e) => updateColumn(index, 'defaultValue', e.target.value)}
                                                placeholder="Default (optional)"
                                                className="bg-black/50 border-white/10 h-8 text-xs"
                                            />
                                        </div>
                                        <div className="col-span-1 flex justify-end">
                                            {columns.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeColumn(index)}
                                                    className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 px-1">
                                        <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={column.primary}
                                                onChange={(e) => updateColumn(index, 'primary', e.target.checked)}
                                                className="rounded bg-black/50 border-white/10"
                                            />
                                            Primary Key
                                        </label>
                                        <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={column.notNull}
                                                onChange={(e) => updateColumn(index, 'notNull', e.target.checked)}
                                                className="rounded bg-black/50 border-white/10"
                                            />
                                            Not Null
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading} className="bg-primary-600 hover:bg-primary-700 text-white">
                            {loading ? "Creating..." : "Create Table"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
