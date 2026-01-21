import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Calendar, Table as TableIcon } from 'lucide-react';
import { ProjectDetails } from '../types';
import { CreateTableDialog } from './CreateTableDialog';

interface ProjectOverviewProps {
    project: ProjectDetails;
    copyToClipboard: (text: string) => void;
    refreshProject: () => void;
}

export function ProjectOverview({ project, copyToClipboard, refreshProject }: ProjectOverviewProps) {
    const createdDate = project.meta.created_at ? new Date(project.meta.created_at).toLocaleDateString() : 'N/A';

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
            {/* Tables Card */}
            <Card className="col-span-2 bg-neutral-900/50 border-white/10 text-white backdrop-blur-sm">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <TableIcon className="w-5 h-5 text-orange-400" />
                                Database Tables
                            </CardTitle>
                            <CardDescription className="text-gray-400 mt-1">
                                Manage your project's data schema and content.
                            </CardDescription>
                        </div>
                        <CreateTableDialog project={project} onTableCreated={refreshProject}>
                            <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white border-0">
                                <TableIcon className="w-4 h-4 mr-2" />
                                Create Table
                            </Button>
                        </CreateTableDialog>
                    </div>
                </CardHeader>
                <CardContent>
                    {project.tables && project.tables.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {project.tables.map((table: any, i: number) => (
                                <Link key={i} href={`/platform/projects/${project.id}/tables/${table.name}`}>
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-orange-500/30 transition-colors group cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-neutral-800 flex items-center justify-center">
                                                <TableIcon className="w-4 h-4 text-gray-400 group-hover:text-orange-400 transition-colors" />
                                            </div>
                                            <span className="font-medium text-gray-200 group-hover:text-white">{table.name}</span>
                                        </div>
                                        <span className="text-xs text-gray-500">View Schema →</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 border border-dashed border-white/10 rounded-lg">
                            <p className="text-gray-500">No tables created yet.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Details/Meta Card */}
            <Card className="bg-neutral-900/50 border-white/10 text-white backdrop-blur-sm h-fit">
                <CardHeader>
                    <CardTitle className="text-lg">Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-1">
                        <p className="text-xs text-gray-500 uppercase font-semibold">Project ID</p>
                        <div className="flex items-center gap-2 group">
                            <code className="bg-black/50 px-2 py-1 rounded text-sm text-gray-300 font-mono flex-1 truncate">{project.id}</code>
                            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => copyToClipboard(project.id)}>
                                <Copy className="w-3 h-3" />
                            </Button>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs text-gray-500 uppercase font-semibold">Owner ID</p>
                        <code className="bg-black/50 px-2 py-1 rounded text-sm text-gray-300 font-mono block truncate">{project.meta.owner_id}</code>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs text-gray-500 uppercase font-semibold">Created At</p>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            {createdDate}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
