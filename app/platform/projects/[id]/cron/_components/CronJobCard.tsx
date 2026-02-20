"use client";

import React from "react";
import { Trash2, Activity, Settings, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CronJob } from "./types";

interface CronJobCardProps {
    job: CronJob;
    onDelete: (id: string) => void;
    onViewExecutions: (id: string) => void;
}

export function CronJobCard({ job, onDelete, onViewExecutions }: CronJobCardProps) {
    return (
        <Card className="bg-neutral-900/40 border-white/5 hover:border-white/10 hover:bg-neutral-900/60 transition-all duration-300 flex flex-col group overflow-hidden">
            <CardHeader className="pb-4 border-b border-white/5">
                <div className="flex items-start justify-between">
                    <div className="min-w-0 pr-4">
                        <CardTitle className="text-lg font-semibold text-white truncate flex items-center gap-2">
                            {job.name}
                            {job.is_active ?
                                <Badge variant="outline" className="text-[10px] text-green-400 border-green-400/20 bg-green-400/10 px-1.5 py-0 hover:bg-green-400/20">Active</Badge> :
                                <Badge variant="outline" className="text-[10px] text-neutral-400 border-neutral-400/20 bg-white/5 px-1.5 py-0">Paused</Badge>
                            }
                        </CardTitle>
                        <CardDescription className="text-neutral-400 text-sm mt-1.5 truncate">
                            {job.description || "No description provided."}
                        </CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 shrink-0 transition-colors" onClick={() => onDelete(job.id)}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="mt-auto pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-y-4 gap-x-4 bg-black/30 p-3.5 rounded-xl border border-white/5">
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Schedule</span>
                        <span className="text-xs font-mono text-purple-400 bg-purple-400/10 px-2 py-1 rounded-md w-fit border border-purple-400/20">{job.cron_expression}</span>
                    </div>
                    <div className="flex flex-col gap-1.5 min-w-0">
                        <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Method</span>
                        <span className={`text-xs font-mono px-2 py-1 rounded-md w-fit border ${job.method === 'GET' ? 'text-blue-400 bg-blue-400/10 border-blue-400/20' : 'text-green-400 bg-green-400/10 border-green-400/20'}`}>
                            {job.method}
                        </span>
                    </div>
                    <div className="flex flex-col gap-1.5 col-span-2 min-w-0">
                        <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Destination</span>
                        <div className="flex items-center gap-2 text-sm text-neutral-300 bg-white/5 px-2 py-1.5 rounded-md border border-white/5 overflow-hidden">
                            <Globe className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                            <span className="truncate" title={job.url}>{job.url}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                    <Button variant="outline" size="sm" className="w-full bg-transparent border-white/10 text-neutral-300 hover:text-white hover:bg-white/10 h-10 transition-colors" onClick={() => onViewExecutions(job.id)}>
                        <Activity className="w-4 h-4 mr-2 text-neutral-400" />
                        Executions
                    </Button>
                    <Button variant="outline" size="sm" className="w-full bg-transparent border-primary-500/20 text-primary-400 hover:text-primary-300 hover:bg-primary-500/10 h-10 transition-colors">
                        <Settings className="w-4 h-4 mr-2" />
                        Configure
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
