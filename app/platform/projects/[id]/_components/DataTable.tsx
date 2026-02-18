import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Loader2, Trash2, Pencil, Copy } from "lucide-react";
import { TableSchema } from "../types";
import { toast } from "sonner";

interface DataTableProps {
    schema: TableSchema;
    data: any[];
    isLoading: boolean;
    isError: boolean;
    onEdit: (row: any) => void;
    onDelete: (row: any) => void;
}

export const DataTable = ({ schema, data, isLoading, isError, onEdit, onDelete }: DataTableProps) => {
    return (
        <div className="rounded-xl border border-white/10 overflow-hidden bg-neutral-900/30">
            <ScrollArea className="w-full whitespace-nowrap h-[600px]">
                <Table>
                    <TableHeader className="bg-white/5 sticky top-0 z-10 backdrop-blur-md">
                        <TableRow className="border-white/5 hover:bg-transparent">
                            {schema.columns.map((col) => (
                                <TableHead key={col.name} className="text-gray-300 font-medium whitespace-nowrap px-4 py-3 h-auto">
                                    <div className="flex items-center gap-2">
                                        {col.name}
                                        {col.primary && <span className="text-[10px] text-yellow-500 bg-yellow-500/10 px-1 rounded">PK</span>}
                                    </div>
                                </TableHead>
                            ))}
                            <TableHead className="text-right px-4 sticky right-0 bg-neutral-950/90 w-[100px] border-l border-white/5">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={schema.columns.length + 1} className="h-32 text-center text-gray-500">
                                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                                    Loading data...
                                </TableCell>
                            </TableRow>
                        ) : isError ? (
                            <TableRow>
                                <TableCell colSpan={schema.columns.length + 1} className="h-32 text-center text-red-500">
                                    Failed to load data
                                </TableCell>
                            </TableRow>
                        ) : data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={schema.columns.length + 1} className="h-32 text-center text-gray-500">
                                    No records found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((row: any, i: number) => (
                                <TableRow key={i} className="border-white/5 hover:bg-white/5 transition-colors group/row">
                                    {schema.columns.map((col) => {
                                        const cellValue = row[col.name];
                                        const displayValue = typeof cellValue === 'boolean' ? (
                                            cellValue ? 'true' : 'false'
                                        ) : typeof cellValue === 'object' ? (
                                            JSON.stringify(cellValue)
                                        ) : (
                                            String(cellValue ?? '')
                                        );

                                        return (
                                            <TableCell key={col.name} className="px-4 py-3 text-gray-300 relative group/cell">
                                                <div className="flex items-center justify-between gap-4 min-w-[100px] max-w-[300px]">
                                                    <span className="truncate block w-full" title={displayValue}>
                                                        {displayValue === '' ? <span className="text-white/20 italic">null</span> : displayValue}
                                                    </span>
                                                    {cellValue !== null && cellValue !== undefined && displayValue !== '' && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6 opacity-0 group-hover/cell:opacity-100 transition-all hover:bg-white/10 hover:text-white absolute right-2 top-1/2 -translate-y-1/2"
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(displayValue);
                                                                toast.success("Copied");
                                                            }}
                                                        >
                                                            <Copy className="h-3 w-3" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        );
                                    })}
                                    <TableCell className="text-right px-4 sticky right-0 bg-neutral-950/80 backdrop-blur border-l border-white/5">
                                        <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover/row:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-blue-400 hover:bg-blue-500/10" onClick={() => onEdit(row)}>
                                                <Pencil className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-red-400 hover:bg-red-500/10" onClick={() => onDelete(row)}>
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    );
};
