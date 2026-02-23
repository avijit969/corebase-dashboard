"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { ArrowLeft, Trash2, Key, Type, Database, Edit2, Link as LinkIcon, TableProperties, FileJson, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TableSchema } from '../../types';
import { useProjectStore } from '@/lib/stores/project-store';
import { AddColumnDialog } from '../../_components/AddColumnDialog';
import { AddForeignKeyDialog } from '../../_components/AddForeignKeyDialog';
import { TableDataViewer } from '../../_components/TableDataViewer';
import { DocsSheet } from './_components/DocsSheet';
import { Link2 } from 'lucide-react';

export default function TableDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const view = searchParams?.get('view');

    const projectId = params?.id as string;
    const tableName = params?.tableName as string;

    const currentApiKey = useProjectStore(state => state.currentApiKey);
    const [schema, setSchema] = useState<TableSchema | null>(null);
    const [loading, setLoading] = useState(true);

    // Tab State
    const [activeTab, setActiveTab] = useState("data");

    // Rename Column State
    const [renameDialogOpen, setRenameDialogOpen] = useState(false);
    const [columnToRename, setColumnToRename] = useState<string | null>(null);
    const [newColumnName, setNewColumnName] = useState('');
    const [openDocs, setOpenDocs] = useState(false);
    useEffect(() => {
        if (view === 'schema') setActiveTab('schema');
        else if (view === 'data') setActiveTab('data');
    }, [view]);

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

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        // Optional: update URL
        router.push(`/platform/projects/${projectId}/tables/${tableName}?view=${value}`, { scroll: false });
    };

    if (loading) {
        return (
            <div className="space-y-6 p-4">
                <Skeleton className="h-8 w-48 bg-white/10" />
                <Skeleton className="h-64 w-full bg-white/10 rounded-lg" />
            </div>
        );
    }

    if (!schema) return <div className="p-4 text-white">Table not found</div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500 p-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Link href={`/platform/projects/${projectId}`} className="text-sm text-gray-400 hover:text-white flex items-center gap-1 mb-2 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Database
                    </Link>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Database className="w-6 h-6 text-primary-500" />
                        {schema.table}
                    </h2>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="destructive" size="sm" onClick={handleDeleteTable}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Table
                    </Button>
                    {/* Docs  Icon To open docs sheet */}
                    <Button variant="outline" size="sm" onClick={() => {
                        setOpenDocs(true);
                    }}>
                        <BookOpen className="w-4 h-4 mr-2" />
                        Docs
                    </Button>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
                <TabsList className="bg-neutral-900 border border-white/10 p-1 rounded-lg">
                    <TabsTrigger value="data" className="data-[state=active]:bg-primary-600 data-[state=active]:text-white text-neutral-400 px-4">
                        <FileJson className="w-4 h-4 mr-2" />
                        Data
                    </TabsTrigger>
                    <TabsTrigger value="schema" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-neutral-400 px-4">
                        <TableProperties className="w-4 h-4 mr-2" />
                        Schema
                    </TabsTrigger>
                </TabsList>

                {/* Data View */}
                <TabsContent value="data" className="border-none p-0 outline-none">
                    <Card className="bg-transparent border-0 shadow-none">
                        <CardHeader className="px-0 pt-0 pb-6">
                            <CardTitle className="text-xl font-semibold text-white">Table Data</CardTitle>
                            <CardDescription className="text-neutral-400 mt-1">
                                View and manage the records in this table.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-0">
                            {currentApiKey && (
                                <TableDataViewer
                                    apiKey={currentApiKey}
                                    tableName={tableName}
                                    schema={schema}
                                />
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Schema View */}
                <TabsContent value="schema" className="border-none p-0 outline-none">
                    <Card className="bg-transparent border-0 shadow-none">
                        <CardHeader className="px-0 pt-0 pb-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-semibold text-white">Schema Definition</CardTitle>
                                    <CardDescription className="text-neutral-400 mt-1">
                                        {schema.columns.length} columns defined in this table.
                                    </CardDescription>
                                </div>
                                {currentApiKey && (
                                    <div className="flex items-center gap-3">
                                        <AddForeignKeyDialog
                                            apiKey={currentApiKey}
                                            tableName={tableName}
                                            existingColumns={schema.columns.map(c => c.name)}
                                            onSuccess={handleRefresh}
                                        >
                                            <Button size="sm" variant="secondary" className="bg-neutral-800 hover:bg-neutral-700 text-white border border-white/10">
                                                <Link2 className="w-4 h-4 mr-2 text-primary-500" />
                                                Add Relation
                                            </Button>
                                        </AddForeignKeyDialog>
                                        <AddColumnDialog apiKey={currentApiKey} tableName={tableName} onColumnAdded={handleRefresh}>
                                            <Button size="sm" className="bg-white text-black hover:bg-neutral-200">
                                                <Type className="w-4 h-4 mr-2" />
                                                Add Column
                                            </Button>
                                        </AddColumnDialog>
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="px-0">
                            <div className="rounded-xl border border-white/10 overflow-hidden bg-neutral-900/40 backdrop-blur-sm">
                                <table className="w-full text-sm">
                                    <thead className="bg-white/5 border-b border-white/5">
                                        <tr className="text-left text-neutral-400">
                                            <th className="p-4 font-medium w-1/4">Name</th>
                                            <th className="p-4 font-medium w-1/4">Type</th>
                                            <th className="p-4 font-medium w-1/3">Attributes</th>
                                            <th className="p-4 font-medium text-right"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {schema.columns.map((col, i) => (
                                            <tr key={i} className="hover:bg-white/5 transition-colors group">
                                                <td className="p-4 font-medium text-white">
                                                    <div className="flex items-center gap-2">
                                                        {col.primary && <Key className="w-3.5 h-3.5 text-yellow-500 shrink-0" />}
                                                        <span className={col.primary ? "text-yellow-500/90" : ""}>{col.name}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="font-mono text-xs bg-neutral-800 border border-white/5 px-2 py-1 rounded text-neutral-300">
                                                        {col.type}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-neutral-400">
                                                    <div className="flex flex-wrap gap-2">
                                                        {col.primary && <span className="bg-yellow-500/10 text-yellow-500 text-[10px] px-2 py-0.5 rounded font-medium border border-yellow-500/20">PK</span>}
                                                        {col.notNull && <span className="bg-red-500/10 text-red-400 text-[10px] px-2 py-0.5 rounded font-medium border border-red-500/20">NOT NULL</span>}
                                                        {col.default !== undefined && col.default !== '' && (
                                                            <span className="bg-neutral-800 text-neutral-400 text-[10px] px-2 py-0.5 rounded border border-white/5">
                                                                DEF: {String(col.default)}
                                                            </span>
                                                        )}
                                                        {col.references && (
                                                            <div className="flex items-center gap-1.5 bg-blue-500/10 text-blue-400 text-[10px] px-2 py-0.5 rounded border border-blue-500/20" title={`References ${col.references.table}.${col.references.column}`}>
                                                                <Link2 className="w-3 h-3" />
                                                                <span>{col.references.table}.{col.references.column}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-white" onClick={() => openRenameDialog(col.name)}>
                                                            <Edit2 className="w-4 h-4" />
                                                        </Button>
                                                        {!col.primary && (
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-red-400 hover:bg-red-950/30" onClick={() => handleDeleteColumn(col.name)}>
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
                </TabsContent>
            </Tabs>

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
                        <Button onClick={handleRenameColumn} className="bg-primary-600 hover:bg-primary-700">Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Docs Sheet */}
            <DocsSheet open={openDocs} onOpenChange={setOpenDocs} tableName={tableName} columns={schema?.columns || []} />
        </div>
    );
}
