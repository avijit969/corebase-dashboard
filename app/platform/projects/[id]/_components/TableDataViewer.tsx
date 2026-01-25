"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerFooter,
} from "@/components/ui/drawer";
import { Loader2, Plus, RefreshCw, Trash2, Pencil, Search, Filter, Copy } from "lucide-react";
import { TableSchema } from "../types";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


interface TableDataViewerProps {
    apiKey: string;
    tableName: string;
    schema: TableSchema;
}

export function TableDataViewer({ apiKey, tableName, schema }: TableDataViewerProps) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);

    // Dialogs
    const [isInsertOpen, setIsInsertOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [editingId, setEditingId] = useState<any>(null);

    // Fetch Data
    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.tableOperations.select(apiKey, tableName, {
                limit: 50,
                // order: "DESC" // API doesn't specify default sort column, maybe 'created_at' or PK?
            });

            if (res && res.data) {
                setData(res.data);
                setTotal(res.meta?.total || 0);
            } else if (Array.isArray(res)) {
                setData(res);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [apiKey, tableName]);

    // Handle Insert
    const handleInsert = async () => {
        try {
            // Filter out empty strings if column matches certain types? 
            // For now send as is.
            await api.tableOperations.insert(apiKey, tableName, formData);
            toast.success("Row inserted");
            setIsInsertOpen(false);
            setFormData({});
            fetchData();
        } catch (error: any) {
            toast.error(error.message || "Failed to insert");
        }
    };

    // Handle Update
    const handleUpdate = async () => {
        if (!editingId) return;

        // Find PK
        const pkCol = schema.columns.find(c => c.primary)?.name || "id";

        try {
            await api.tableOperations.update(apiKey, tableName, {
                updates: formData,
                where: { [pkCol]: editingId }
            });
            toast.success("Row updated");
            setIsEditOpen(false);
            setFormData({});
            setEditingId(null);
            fetchData();
        } catch (error: any) {
            toast.error(error.message || "Failed to update");
        }
    };

    // Handle Delete
    const handleDelete = async (row: any) => {
        const pkCol = schema.columns.find(c => c.primary)?.name || "id";
        const pkValue = row[pkCol];

        if (!pkValue) {
            toast.error("Cannot delete row without Primary Key");
            return;
        }

        if (!confirm("Are you sure?")) return;

        try {
            await api.tableOperations.delete(apiKey, tableName, { [pkCol]: pkValue });
            toast.success("Row deleted");
            fetchData();
        } catch (error: any) {
            toast.error(error.message || "Failed to delete");
        }
    };

    // Open Edit
    const openEdit = (row: any) => {
        const pkCol = schema.columns.find(c => c.primary)?.name || "id";
        setEditingId(row[pkCol]);
        setFormData({ ...row }); // detailed implementation would filter out non-editable
        setIsEditOpen(true);
    };

    const renderInput = (col: any) => {
        if (col.primary && col.type === 'integer') return null; // Assume auto-increment for integer PKs

        return (
            <div key={col.name} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={col.name} className="text-right text-gray-400 flex lg:flex-row flex-col">
                    {col.name} <span className="sm:text-xs opacity-50">({col.type})</span>
                </Label>
                <div className="col-span-3">
                    {col.type === 'boolean' ? (
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id={col.name}
                                checked={!!formData[col.name]}
                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, [col.name]: checked }))}
                            />
                        </div>
                    ) : (
                        <Input
                            id={col.name}
                            value={formData[col.name] || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, [col.name]: e.target.value }))}
                            className="bg-neutral-800 border-white/10"
                        />
                    )}
                </div>
            </div>
        )
    };

    // Responsive Hook
    const useMediaQuery = (query: string) => {
        const [value, setValue] = React.useState(false);

        React.useEffect(() => {
            function onChange(event: MediaQueryListEvent) {
                setValue(event.matches);
            }

            const result = matchMedia(query);
            result.addEventListener("change", onChange);
            setValue(result.matches);

            return () => result.removeEventListener("change", onChange);
        }, [query]);

        return value;
    };

    const isDesktop = useMediaQuery("(min-width: 768px)");

    // Define the content form separately to reuse
    const DataForm = ({ onSubmit, submitLabel, isSubmitting }: { onSubmit: () => void, submitLabel: string, isSubmitting?: boolean }) => (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto py-4 px-1 space-y-6">
                {schema.columns.map(renderInput)}
            </div>
            <div className="pt-6 mt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <Button
                    variant="ghost"
                    onClick={() => { setIsInsertOpen(false); setIsEditOpen(false); }}
                    className="hover:bg-white/5 active:scale-95 transition-all"
                >
                    Cancel
                </Button>
                <Button
                    onClick={onSubmit}
                    className="bg-orange-600 hover:bg-orange-500 active:scale-95 transition-all min-w-[100px]"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : submitLabel}
                </Button>
            </div>
        </div>
    );

    // Responsive Drawer/Sheet Component
    const ResponsiveRowEditor = ({
        open,
        onOpenChange,
        title,
        onSubmit,
        submitLabel,
        description
    }: {
        open: boolean,
        onOpenChange: (open: boolean) => void,
        title: string,
        onSubmit: () => void,
        submitLabel: string,
        description?: string
    }) => {
        if (isDesktop) {
            return (
                <Sheet open={open} onOpenChange={onOpenChange}>
                    <SheetContent side="right" className="bg-neutral-950 border-white/10 text-white sm:max-w-xl w-full flex flex-col h-full">
                        <SheetHeader className="pb-4 border-b border-white/10">
                            <SheetTitle className="text-xl font-bold">{title}</SheetTitle>
                            {description && <SheetDescription>{description}</SheetDescription>}
                        </SheetHeader>
                        <div className="px-4">
                            <DataForm onSubmit={onSubmit} submitLabel={submitLabel} />
                        </div>
                    </SheetContent>
                </Sheet>
            );
        }

        return (
            <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerContent className="bg-neutral-950 border-white/10 text-white max-h-[90vh] flex flex-col">
                    <DrawerHeader className="px-6 shrink-0">
                        <DrawerTitle className="text-xl font-bold">{title}</DrawerTitle>
                        {description && <DrawerDescription>{description}</DrawerDescription>}
                    </DrawerHeader>
                    <div className="px-6 flex-1 overflow-y-auto pb-6">
                        <DataForm onSubmit={onSubmit} submitLabel={submitLabel} />
                    </div>
                </DrawerContent>
            </Drawer>
        );
    };

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between bg-neutral-900/50 p-4 rounded-lg border border-white/5 backdrop-blur-sm sticky top-0 z-20">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={fetchData} disabled={loading} className="text-gray-400 hover:text-white border border-transparent hover:border-white/10">
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <span className="hidden sm:inline-block text-sm text-gray-500 border-l border-white/10 pl-3">
                        {total} records
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Button size="sm" onClick={() => { setFormData({}); setIsInsertOpen(true); }} className="bg-orange-600 hover:bg-orange-500 shadow-lg shadow-orange-900/20 active:scale-95 transition-all">
                        <Plus className="w-4 h-4 mr-2" />
                        Insert Row
                    </Button>
                </div>
            </div>

            {/* Data Table */}
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
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={schema.columns.length + 1} className="h-32 text-center text-gray-500">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                                        Loading data...
                                    </TableCell>
                                </TableRow>
                            ) : data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={schema.columns.length + 1} className="h-32 text-center text-gray-500">
                                        No records found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((row, i) => (
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
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-blue-400 hover:bg-blue-500/10" onClick={() => openEdit(row)}>
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-red-400 hover:bg-red-500/10" onClick={() => handleDelete(row)}>
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

            <ResponsiveRowEditor
                open={isInsertOpen}
                onOpenChange={setIsInsertOpen}
                title="Insert New Row"
                onSubmit={handleInsert}
                submitLabel="Insert Row"
                description="Add a new record to this table."
            />

            <ResponsiveRowEditor
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                title="Update Row"
                onSubmit={handleUpdate}
                submitLabel="Save Changes"
                description="Modify existing data."
            />
        </div>
    );
}

