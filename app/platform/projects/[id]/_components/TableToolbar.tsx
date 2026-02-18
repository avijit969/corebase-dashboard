import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";

interface TableToolbarProps {
    total: number;
    isLoading: boolean;
    onRefresh: () => void;
    onInsert: () => void;
}

export const TableToolbar = ({ total, isLoading, onRefresh, onInsert }: TableToolbarProps) => {
    return (
        <div className="flex items-center justify-between bg-neutral-900/50 p-4 rounded-lg border border-white/5 backdrop-blur-sm sticky top-0 z-20">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={onRefresh} disabled={isLoading} className="text-gray-400 hover:text-white border border-transparent hover:border-white/10">
                    <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
                <span className="hidden sm:inline-block text-sm text-gray-500 border-l border-white/10 pl-3">
                    {total} records
                </span>
            </div>
            <div className="flex items-center gap-2">
                <Button size="sm" onClick={onInsert} className="bg-primary-600 hover:bg-primary-500 shadow-lg shadow-primary-900/20 active:scale-95 transition-all">
                    <Plus className="w-4 h-4 mr-2" />
                    Insert Row
                </Button>
            </div>
        </div>
    );
};
