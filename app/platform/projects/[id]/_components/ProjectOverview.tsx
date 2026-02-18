import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Copy,
    Calendar,
    Table as TableIcon,
    Database,
    FileJson,
    Settings2,
    ArrowRight
} from 'lucide-react';
import { ProjectDetails } from '../types';
import { CreateTableDrawer } from './CreateTableDrawer';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface ProjectOverviewProps {
    project: ProjectDetails;
    copyToClipboard: (text: string) => void;
    refreshProject: () => void;
}

export function ProjectOverview({ project, copyToClipboard, refreshProject }: ProjectOverviewProps) {
    const createdDate = project?.meta?.created_at ? new Date(project.meta.created_at).toLocaleDateString() : 'N/A';

    const handleCopy = (text: string) => {
        copyToClipboard(text);
        toast.success("Copied to clipboard");
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Stats / Details Row */}
            <Card className="bg-neutral-900/50 border-white/10 text-white backdrop-blur-sm overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/5">
                    <div className="p-6 flex flex-col justify-center gap-1">
                        <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Project ID</h3>
                        <div className="flex items-center gap-2 group">
                            <code className="text-sm font-mono text-white/90 bg-white/5 px-2 py-1.5 rounded truncate max-w-[200px] border border-white/5">
                                {project.id}
                            </code>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-white hover:bg-white/10" onClick={() => handleCopy(project.id)}>
                                <Copy className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                    </div>

                    <div className="p-6 flex flex-col justify-center gap-1">
                        <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Total Tables</h3>
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-md bg-primary-500/10 border border-primary-500/20">
                                <TableIcon className="w-4 h-4 text-primary-500" />
                            </div>
                            <span className="text-2xl font-bold text-white tracking-tight leading-none">{project.tables ? project.tables.length : 0}</span>
                        </div>
                    </div>

                    <div className="p-6 flex flex-col justify-center gap-1">
                        <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Created At</h3>
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-md bg-blue-500/10 border border-blue-500/20">
                                <Calendar className="w-4 h-4 text-blue-500" />
                            </div>
                            <span className="text-lg font-medium text-white/90 leading-none">{createdDate}</span>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Tables Section */}
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <div className="p-2 bg-primary-500/10 rounded-lg border border-primary-500/20">
                                <Database className="w-5 h-5 text-primary-500" />
                            </div>
                            Database Tables
                        </h2>
                        <p className="text-neutral-400 mt-2 text-sm max-w-lg">
                            Manage your database schema and content.
                        </p>
                    </div>
                    <CreateTableDrawer project={project} onTableCreated={refreshProject}>
                        <Button className="bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-900/20 active:scale-95 transition-all w-full sm:w-auto">
                            <TableIcon className="w-4 h-4 mr-2" />
                            Create Table
                        </Button>
                    </CreateTableDrawer>
                </div>

                {project.tables && project.tables.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                        {project.tables.map((table: any, i: number) => (
                            <Card key={i} className="bg-neutral-900/40 border-white/5 hover:border-primary-500/30 hover:bg-neutral-900/60 transition-all duration-300 group flex flex-col">
                                <CardHeader className="pb-3 card-header-padding-fix">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="p-2 rounded-lg bg-white/5 group-hover:bg-primary-500/10 transition-colors shrink-0">
                                                <TableIcon className="w-4 h-4 text-neutral-400 group-hover:text-primary-500" />
                                            </div>
                                            <CardTitle className="text-base font-semibold text-white group-hover:text-primary-100 transition-colors truncate">
                                                {table.name}
                                            </CardTitle>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="mt-auto pt-0">
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <Link href={`/platform/projects/${project.id}/tables/${table.name}?view=schema`} className="w-full">
                                            <Button variant="outline" size="sm" className="w-full justify-start bg-transparent border-white/10 text-neutral-400 hover:text-blue-400 hover:bg-blue-500/5 hover:border-blue-500/20 h-9">
                                                <Settings2 className="w-3.5 h-3.5 mr-2" />
                                                Schema
                                            </Button>
                                        </Link>
                                        <Link href={`/platform/projects/${project.id}/tables/${table.name}?view=data`} className="w-full">
                                            <Button variant="outline" size="sm" className="w-full justify-start bg-transparent border-white/10 text-neutral-400 hover:text-green-400 hover:bg-green-500/5 hover:border-green-500/20 h-9">
                                                <FileJson className="w-3.5 h-3.5 mr-2" />
                                                Data
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-xl bg-white/2 hover:bg-white/4 transition-colors">
                        <div className="p-4 rounded-full bg-neutral-900 border border-white/5 mb-4 shadow-xl">
                            <Database className="w-8 h-8 text-neutral-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">No tables yet</h3>
                        <p className="text-neutral-500 max-w-sm text-center mb-8 text-sm leading-relaxed">
                            Your database is empty. Create your first table to start defining your data architecture.
                        </p>
                        <CreateTableDrawer project={project} onTableCreated={refreshProject}>
                            <Button variant="outline" className="border-primary-500/20 text-primary-500 hover:bg-primary-500/10 hover:text-primary-400 hover:border-primary-500/30">
                                <TableIcon className="w-4 h-4 mr-2" />
                                Create New Table
                            </Button>
                        </CreateTableDrawer>
                    </div>
                )}
            </div>
        </div>
    );
}

