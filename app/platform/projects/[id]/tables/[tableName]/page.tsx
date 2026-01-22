"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { ArrowLeft, Trash2, Key, Type, Calendar as CalendarIcon, Settings, Database, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ProjectDetails, TableSchema } from '../../types';
import { useProjectStore } from '@/lib/stores/project-store';
import { AddColumnDialog } from '../../_components/AddColumnDialog';
import { AddForeignKeyDialog } from '../../_components/AddForeignKeyDialog';
import { Link2 } from 'lucide-react';

export default function TableDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const projectId = params?.id as string;
    const tableName = params?.tableName as string;

    const currentApiKey = useProjectStore(state => state.currentApiKey);
    const [schema, setSchema] = useState<TableSchema | null>(null);
    const [loading, setLoading] = useState(true);

    // Rename Column State
    const [renameDialogOpen, setRenameDialogOpen] = useState(false);
    const [columnToRename, setColumnToRename] = useState<string | null>(null);
    const [newColumnName, setNewColumnName] = useState('');

    useEffect(() => {
        const token = localStorage.getItem("platform_token");
        if (!token) {
            router.push("/platform/login");
            return;
        }

        if (projectId && tableName) {
            fetchTableSchema(projectId, tableName, token);
        }
    }, [projectId, tableName, router, currentApiKey]);

    const fetchTableSchema = async (pid: string, tName: string, token: string) => {
        try {
            setLoading(true);
            let apiKey = useProjectStore.getState().currentApiKey;
            console.log("api key is", apiKey)
            if (!apiKey) {
                const projData = await api.projects.get(pid, token);
                if (projData) {
                    apiKey = projData.api_key || projData.apiKey || projData.meta?.api_key || projData.meta?.apiKey;
                    if (apiKey) {
                        useProjectStore.setState({ currentApiKey: apiKey });
                    }
                }
            }

            if (apiKey) {

                const tableData = await api.db.getTable(apiKey, tName);
                if (tableData && tableData.table) {
                    setSchema(tableData);
                } else {
                    setSchema(tableData.data || tableData);
                }
            } else {
                console.error("API Key missing");
            }
        } catch (error: any) {
            console.error("Failed to fetch table details", error);
            toast.error("Failed to load table details");
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        if (projectId && tableName) {
            const token = localStorage.getItem("platform_token");
            if (token) fetchTableSchema(projectId, tableName, token);
        }
    };

    const handleDeleteTable = async () => {
        if (!currentApiKey || !tableName) return;

        if (!confirm(`Are you sure you want to delete table '${tableName}'? This action cannot be undone.`)) return;

        try {
            await api.db.deleteTable(currentApiKey, tableName);
            toast.success("Table deleted successfully");
            router.push(`/platform/projects/${projectId}`);
        } catch (error: any) {
            toast.error("Failed to delete table");
        }
    };

    const handleDeleteColumn = async (columnName: string) => {
        if (!currentApiKey || !tableName) return;

        if (!confirm(`Are you sure you want to delete column '${columnName}'? Data in this column will be lost.`)) return;

        try {
            await api.db.deleteColumn(currentApiKey, tableName, columnName);
            toast.success("Column deleted successfully");
            handleRefresh();
        } catch (error: any) {
            toast.error("Failed to delete column");
        }
    };

    const openRenameDialog = (column: string) => {
        setColumnToRename(column);
        setNewColumnName(column);
        setRenameDialogOpen(true);
    };

    const handleRenameColumn = async () => {
        if (!currentApiKey || !tableName || !columnToRename) return;

        try {
            await api.db.updateColumn(currentApiKey, tableName, columnToRename, { name: newColumnName });
            toast.success("Column renamed");
            setRenameDialogOpen(false);
            handleRefresh();
        } catch (error: any) {
            toast.error("Failed to rename column");
        }
    };

    if (loading) {
        return (
            <div className="space-y-6 p-4">
                <Skeleton className="h-8 w-48 bg-white/10" />
                <Skeleton className="h-64 w-full bg-white/10 rounded-lg" />
            </div>
        );
    }

    if (!schema) return <div className="p-4">Table not found</div>;

    return (
        <div className="space-y-6 p-4 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Link href={`/platform/projects/${projectId}`} className="text-sm text-gray-400 hover:text-white flex items-center gap-1 mb-2 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Database
                    </Link>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Database className="w-6 h-6 text-orange-500" />
                        {schema.table}
                    </h2>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="destructive" size="sm" onClick={handleDeleteTable}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Table
                    </Button>
                </div>
            </div>

            {/* Config & RLS Summary (Placeholder for now) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-neutral-900/50 border-white/10 text-white backdrop-blur-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400 uppercase">RLS Enabled</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-400">Active</div>
                        {/* We could show details here later */}
                    </CardContent>
                </Card>
                <Card className="bg-neutral-900/50 border-white/10 text-white backdrop-blur-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400 uppercase">Indexes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{schema.indexes?.length || 0}</div>
                    </CardContent>
                </Card>
                <Card className="bg-neutral-900/50 border-white/10 text-white backdrop-blur-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400 uppercase">Total Columns</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{schema.columns.length}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Schema Table */}
            <Card className="bg-neutral-900/50 border-white/10 text-white backdrop-blur-sm">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Table Schema</CardTitle>
                        {currentApiKey && (
                            <div className="flex items-center gap-2">
                                <AddForeignKeyDialog
                                    apiKey={currentApiKey}
                                    tableName={tableName}
                                    existingColumns={schema.columns.map(c => c.name)}
                                    onSuccess={handleRefresh}
                                >
                                    <Button size="sm" variant="outline" className="border-white/10 hover:bg-white/5 text-white">
                                        <Link2 className="w-4 h-4 mr-2" />
                                        Add Relation
                                    </Button>
                                </AddForeignKeyDialog>
                                <AddColumnDialog apiKey={currentApiKey} tableName={tableName} onColumnAdded={handleRefresh}>
                                    <Button size="sm" variant="outline" className="border-white/10 hover:bg-white/5 text-white">
                                        <Type className="w-4 h-4 mr-2" />
                                        Add Column
                                    </Button>
                                </AddColumnDialog>
                            </div>
                        )}
                    </div>
                    <CardDescription className="text-gray-400">
                        View and manage columns for this table.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-white/10 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-white/5">
                                <tr className="text-left text-gray-400">
                                    <th className="p-3 font-medium">Name</th>
                                    <th className="p-3 font-medium">Type</th>
                                    <th className="p-3 font-medium">Attributes</th>
                                    <th className="p-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {schema.columns.map((col, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-colors">
                                        <td className="p-3 font-medium text-white flex items-center gap-2" title={col.primary ? "Primary Key" : ""}>
                                            {col.primary && <Key className="w-3 h-3 text-yellow-500" />}
                                            {col.name}
                                        </td>
                                        <td className="p-3 text-blue-300 font-mono">{col.type}</td>
                                        <td className="p-3 text-gray-400">
                                            <div className="flex gap-2">
                                                {col.primary && <span className="bg-yellow-500/10 text-yellow-500 text-xs px-2 py-0.5 rounded">PK</span>}
                                                {col.notNull && <span className="bg-red-500/10 text-red-400 text-xs px-2 py-0.5 rounded">NN</span>}
                                                {col.default !== undefined && col.default !== '' && <span className="bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded">Default: {String(col.default)}</span>}
                                                {col.references && (
                                                    <span className="bg-blue-500/10 text-blue-400 text-xs px-2 py-0.5 rounded flex items-center gap-1" title={`References ${col.references.table}.${col.references.column}`}>
                                                        <Link2 className="w-3 h-3" />
                                                        {col.references.table}.{col.references.column}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white" onClick={() => openRenameDialog(col.name)}>
                                                    <Edit2 className="w-4 h-4" />
                                                </Button>
                                                {!col.primary && (
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/20" onClick={() => handleDeleteColumn(col.name)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Rename Dialog */}
            <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
                <DialogContent className="bg-neutral-900 border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle>Rename Column</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Input
                            value={newColumnName}
                            onChange={(e) => setNewColumnName(e.target.value)}
                            placeholder="New Column Name"
                            className="bg-black/50 border-white/10 text-white"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setRenameDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleRenameColumn} className="bg-orange-600 hover:bg-orange-700">Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
