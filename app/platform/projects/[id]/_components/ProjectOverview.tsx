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
    Settings2
} from 'lucide-react';
import { ProjectDetails } from '../types';
import { CreateTableDrawer } from './CreateTableDrawer';
import { toast } from 'sonner';

interface ProjectOverviewProps {
    project: ProjectDetails;
    copyToClipboard: (text: string) => void;
    refreshProject: () => void;
}

export function ProjectOverview({ project, copyToClipboard, refreshProject }: ProjectOverviewProps) {
    const createdDate = project.meta.created_at ? new Date(project.meta.created_at).toLocaleDateString() : 'N/A';

    const handleCopy = (text: string) => {
        copyToClipboard(text);
        toast.success("Copied to clipboard");
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Stats / Details Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-neutral-900/50 border-white/10 text-white backdrop-blur-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Project ID</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between gap-2 group">
                            <code className="text-lg font-mono text-white truncate">{project.id}</code>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-white" onClick={() => handleCopy(project.id)}>
                                <Copy className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-neutral-900/50 border-white/10 text-white backdrop-blur-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Total Tables</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <TableIcon className="w-5 h-5 text-primary-500" />
                            <span className="text-2xl font-bold text-white">{project.tables ? project.tables.length : 0}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-neutral-900/50 border-white/10 text-white backdrop-blur-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Created At</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-500" />
                            <span className="text-lg text-white">{createdDate}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tables Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Database className="w-6 h-6 text-primary-500" />
                            Database Tables
                        </h2>
                        <p className="text-neutral-400 mt-1">Manage your schema and data content.</p>
                    </div>
                    <CreateTableDrawer project={project} onTableCreated={refreshProject}>
                        <Button className="bg-primary-600 hover:bg-primary-500 text-white">
                            <TableIcon className="w-4 h-4 mr-2" />
                            Create Table
                        </Button>
                    </CreateTableDrawer>
                </div>

                {project.tables && project.tables.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {project.tables.map((table: any, i: number) => (
                            <Card key={i} className="bg-neutral-900/40 border-white/5 hover:border-primary-500/30 transition-all duration-300 group">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-white/5 group-hover:bg-primary-500/10 transition-colors">
                                                <TableIcon className="w-5 h-5 text-neutral-400 group-hover:text-primary-500" />
                                            </div>
                                            <CardTitle className="text-lg font-medium text-white group-hover:text-primary-100 transition-colors">
                                                {table.name}
                                            </CardTitle>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link href={`/platform/projects/${project.id}/tables/${table.name}?view=schema`} className="w-full">
                                            <Button variant="outline" className="w-full justify-start bg-transparent border-white/10 text-neutral-300 hover:text-white hover:bg-white/5 hover:border-white/20">
                                                <Settings2 className="w-4 h-4 mr-2 text-blue-400" />
                                                Schema
                                            </Button>
                                        </Link>
                                        <Link href={`/platform/projects/${project.id}/tables/${table.name}?view=data`} className="w-full">
                                            <Button variant="outline" className="w-full justify-start bg-transparent border-white/10 text-neutral-300 hover:text-white hover:bg-white/5 hover:border-white/20">
                                                <FileJson className="w-4 h-4 mr-2 text-green-400" />
                                                Data
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 border border-dashed border-white/10 rounded-xl bg-white/2">
                        <div className="p-4 rounded-full bg-neutral-800 mb-4">
                            <Database className="w-8 h-8 text-neutral-500" />
                        </div>
                        <h3 className="text-lg font-medium text-white mb-1">No tables found</h3>
                        <p className="text-neutral-500 max-w-sm text-center mb-6">Create your first table to start defining your data model.</p>
                        <CreateTableDrawer project={project} onTableCreated={refreshProject}>
                            <Button variant="outline" className="border-primary-500/20 text-primary-500 hover:bg-primary-500/10 hover:text-primary-400">
                                Create New Table
                            </Button>
                        </CreateTableDrawer>
                    </div>
                )}
            </div>
        </div>
    );
}

