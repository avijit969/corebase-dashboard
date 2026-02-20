"use client";

import React from "react";
import { Activity, RefreshCw, History, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CronExecution } from "./types";

interface CronExecutionsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    executions: CronExecution[];
    loading: boolean;
    onRefresh: () => void;
}

export function CronExecutionsDialog({ open, onOpenChange, executions, loading, onRefresh }: CronExecutionsDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-neutral-900 border-white/10 text-white sm:max-w-[800px] h-[85vh] flex flex-col p-0 overflow-hidden shadow-2xl">
                <DialogHeader className="shrink-0 p-6 border-b border-white/10 bg-black/20">
                    <DialogTitle className="text-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary-500/10 rounded-lg">
                                <Activity className="w-5 h-5 text-primary-500" />
                            </div>
                            Execution History
                        </div>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-neutral-400 hover:text-white hover:bg-white/10 rounded-full transition-colors" onClick={onRefresh}>
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto w-full p-6">
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Skeleton key={i} className="h-20 w-full bg-white/5 rounded-xl border border-white/10" />
                            ))}
                        </div>
                    ) : executions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center h-full max-w-sm mx-auto">
                            <div className="p-4 bg-white/5 rounded-full mb-6 ring-1 ring-inset ring-white/10">
                                <History className="w-10 h-10 text-neutral-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">No Executions Yet</h3>
                            <p className="text-neutral-400 text-sm">This cron job hasn't run yet or its history logs have been cleared. Executions will appear here automatically.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {executions.map((exec) => (
                                <div key={exec.id} className="p-5 rounded-xl bg-black/40 border border-white/5 hover:border-white/10 transition-colors flex flex-col md:flex-row md:items-start justify-between gap-4 group">
                                    <div className="flex items-start gap-4">
                                        <div className={`p-2 rounded-lg mt-0.5 shrink-0 ${exec.status === "success" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                                            {exec.status === "success" ? (
                                                <CheckCircle2 className="w-5 h-5" />
                                            ) : (
                                                <XCircle className="w-5 h-5" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1.5">
                                                <span className="font-semibold text-white capitalize text-base">{exec.status}</span>
                                                <span className={`text-[11px] font-mono px-2 py-0.5 rounded-md border ${exec.http_status_code >= 200 && exec.http_status_code < 300 ? 'text-green-400 border-green-400/20 bg-green-400/10' : 'text-red-400 border-red-400/20 bg-red-400/10'}`}>
                                                    {exec.http_status_code || "ERR"}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-neutral-500">
                                                <span>{new Date(exec.created_at).toLocaleString()}</span>
                                                <span className="w-1 h-1 rounded-full bg-neutral-600"></span>
                                                <span className="flex items-center"><Activity className="w-3 h-3 mr-1" /> {exec.execution_time}ms</span>
                                                <span className="w-1 h-1 rounded-full bg-neutral-600"></span>
                                                <span>Attempt #{exec.attempt || 1}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {(exec.response_body || exec.error_message) && (
                                        <div className="md:max-w-[40%] w-full bg-black/40 border border-white/5 rounded-lg p-3 overflow-hidden">
                                            <span className="text-xs font-mono text-neutral-400 block break-all line-clamp-3" title={exec.error_message || exec.response_body}>
                                                {exec.error_message || exec.response_body}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
