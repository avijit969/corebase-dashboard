"use client";

import React, { useEffect, useState } from "react";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Link as LinkIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { ProjectDetails } from "../types";
import { useProjectStore } from "@/lib/stores/project-store";

interface CreateTableDrawerProps {
    project: ProjectDetails;
    onTableCreated: () => void;
    children?: React.ReactNode;
}

interface ExtendedColumnDef {
    name: string;
    type: string;
    primary: boolean;
    notNull: boolean;
    defaultValue: string;
    isForeignKey: boolean;
    fkTargetTable?: string;
    fkTargetColumn?: string;
}

export function CreateTableDrawer({
    project,
    onTableCreated,
    children,
}: CreateTableDrawerProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [tableName, setTableName] = useState("");
    const [columns, setColumns] = useState<ExtendedColumnDef[]>([
        {
            name: "id",
            type: "integer",
            primary: true,
            notNull: true,
            defaultValue: "",
            isForeignKey: false,
        },
    ]);

    const { currentApiKey } = useProjectStore();

    const [refTables, setRefTables] = useState<string[]>([]);
    const [availableColumns, setAvailableColumns] = useState<
        Record<string, string[]>
    >({});
    const [fetchingTable, setFetchingTable] = useState<string | null>(null);

    const apiKey =
        currentApiKey ||
        project.api_key ||
        project.meta?.api_key ||
        project.meta?.apiKey;

    /* -------------------- Fetch tables when drawer opens -------------------- */
    useEffect(() => {
        if (!open || !apiKey) return;

        (async () => {
            try {
                const res = await api.db.listTables(apiKey);
                const tables =
                    Array.isArray(res) ? res : res?.tables || res?.data || [];
                setRefTables(tables.map((t: any) => t.name));
            } catch {
                toast.error("Failed to load tables");
            }
        })();
    }, [open, apiKey]);

    /* -------------------- Column helpers -------------------- */
    const addColumn = () => {
        setColumns((prev) => [
            ...prev,
            {
                name: "",
                type: "text",
                primary: false,
                notNull: false,
                defaultValue: "",
                isForeignKey: false,
            },
        ]);
    };

    const removeColumn = (index: number) => {
        if (columns.length <= 1) return;
        setColumns((prev) => prev.filter((_, i) => i !== index));
    };

    const updateColumn = (
        index: number,
        field: keyof ExtendedColumnDef,
        value: any
    ) => {
        setColumns((prev) => {
            const copy = [...prev];
            copy[index] = { ...copy[index], [field]: value };

            if (field === "isForeignKey" && value === false) {
                copy[index].fkTargetTable = undefined;
                copy[index].fkTargetColumn = undefined;
            }

            return copy;
        });
    };

    /* -------------------- FIXED FK HANDLER -------------------- */
    const handleTargetTableChange = async (
        index: number,
        table: string
    ) => {
        setColumns((prev) => {
            const copy = [...prev];
            copy[index] = {
                ...copy[index],
                fkTargetTable: table,
                fkTargetColumn: undefined,
            };
            return copy;
        });

        if (!apiKey) return;

        try {
            setFetchingTable(table);

            const tableData = await api.db.getTable(apiKey, table);
            const cols =
                tableData?.columns ||
                tableData?.data?.columns ||
                [];

            setAvailableColumns((prev) => ({
                ...prev,
                [table]: cols.map((c: any) => c.name),
            }));
        } catch {
            toast.error(`Failed to load columns for ${table}`);
        } finally {
            setFetchingTable(null);
        }
    };

    /* -------------------- Submit -------------------- */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!tableName.trim()) {
            toast.error("Table name is required");
            return;
        }

        if (columns.some((c) => !c.name.trim())) {
            toast.error("All columns must have a name");
            return;
        }

        for (const c of columns) {
            if (c.isForeignKey && (!c.fkTargetTable || !c.fkTargetColumn)) {
                toast.error(`FK config missing for ${c.name}`);
                return;
            }
        }

        try {
            setLoading(true);

            await api.db.createTable(apiKey!, {
                table: tableName,
                columns: columns.map((c) => ({
                    name: c.name,
                    type: c.type,
                    primary: c.primary,
                    notNull: c.notNull,
                    ...(c.defaultValue && { default: c.defaultValue }),
                    ...(c.isForeignKey && {
                        references: {
                            table: c.fkTargetTable,
                            column: c.fkTargetColumn,
                            onDelete: "cascade",
                        },
                    }),
                })),
                rls: { select: "true", insert: "true", update: "true", delete: "true" },
            });

            toast.success(`Table '${tableName}' created`);
            setOpen(false);
            onTableCreated();

            setTableName("");
            setColumns([
                {
                    name: "id",
                    type: "integer",
                    primary: true,
                    notNull: true,
                    defaultValue: "",
                    isForeignKey: false,
                },
            ]);
        } catch (e: any) {
            toast.error(e.message || "Create failed");
        } finally {
            setLoading(false);
        }
    };

    /* -------------------- UI -------------------- */
    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>{children}</DrawerTrigger>

            <DrawerContent className="bg-neutral-900 text-white h-[90vh]">
                <div className="mx-auto max-w-4xl h-full flex flex-col">
                    <DrawerHeader>
                        <DrawerTitle className="text-2xl">Create New Table</DrawerTitle>
                        <DrawerDescription>
                            Define schema & relationships
                        </DrawerDescription>
                    </DrawerHeader>

                    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                        <form id="create-table-form" onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">General</h3>
                                <div className="bg-neutral-900 border border-white/10 rounded-lg p-1">
                                    <Input
                                        value={tableName}
                                        onChange={(e) => setTableName(e.target.value)}
                                        placeholder="Table Name (e.g. users)"
                                        className="bg-transparent border-0 text-lg h-12 focus-visible:ring-0 placeholder:text-neutral-600"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Columns</h3>
                                    <Button type="button" onClick={addColumn} variant="ghost" size="sm" className="text-orange-500 hover:text-orange-400 hover:bg-orange-500/10 h-8">
                                        <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Column
                                    </Button>
                                </div>

                                <div className="space-y-3">
                                    {columns.map((c, i) => (
                                        <div
                                            key={i}
                                            className="p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors space-y-3 group"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="grid grid-cols-12 gap-3 flex-1">
                                                    <div className="col-span-5">
                                                        <Input
                                                            placeholder="Column Name"
                                                            value={c.name}
                                                            onChange={(e) => updateColumn(i, "name", e.target.value)}
                                                            className="bg-black/20 border-white/5 h-9 focus-visible:ring-1 focus-visible:ring-orange-500/50"
                                                        />
                                                    </div>

                                                    <div className="col-span-3">
                                                        <Select
                                                            value={c.type}
                                                            onValueChange={(v) => updateColumn(i, "type", v)}
                                                        >
                                                            <SelectTrigger className="bg-black/20 border-white/5 h-9 text-neutral-300">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-neutral-800 border-white/10">
                                                                {[
                                                                    "text",
                                                                    "integer",
                                                                    "boolean",
                                                                    "float",
                                                                    "uuid",
                                                                    "json",
                                                                    "datetime",
                                                                ].map((t) => (
                                                                    <SelectItem key={t} value={t} className="text-neutral-300 focus:bg-white/10 focus:text-white">
                                                                        {t}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className="col-span-4">
                                                        <Input
                                                            placeholder="Default Value (Optional)"
                                                            value={c.defaultValue}
                                                            onChange={(e) => updateColumn(i, "defaultValue", e.target.value)}
                                                            className="bg-black/20 border-white/5 h-9 text-neutral-400 focus:text-white"
                                                        />
                                                    </div>
                                                </div>

                                                {columns.length > 1 && (
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => removeColumn(i)}
                                                        className="h-9 w-9 text-neutral-600 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-6 px-1 pt-1">
                                                <div className="flex items-center gap-4 border-r border-white/5 pr-4">
                                                    <label className="flex items-center gap-2 text-xs font-medium text-neutral-400 cursor-pointer hover:text-white transition-colors select-none">
                                                        <input
                                                            type="checkbox"
                                                            checked={c.primary}
                                                            onChange={(e) => updateColumn(i, "primary", e.target.checked)}
                                                            className="rounded border-white/20 bg-white/5 text-orange-500 focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5"
                                                        />
                                                        Primary Key
                                                    </label>
                                                    <label className="flex items-center gap-2 text-xs font-medium text-neutral-400 cursor-pointer hover:text-white transition-colors select-none">
                                                        <input
                                                            type="checkbox"
                                                            checked={c.notNull}
                                                            onChange={(e) => updateColumn(i, "notNull", e.target.checked)}
                                                            className="rounded border-white/20 bg-white/5 text-orange-500 focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5"
                                                        />
                                                        Not Null
                                                    </label>
                                                </div>

                                                <label className="flex items-center gap-2 text-xs font-medium text-neutral-400 cursor-pointer hover:text-white transition-colors select-none">
                                                    <input
                                                        type="checkbox"
                                                        checked={c.isForeignKey}
                                                        onChange={(e) => updateColumn(i, "isForeignKey", e.target.checked)}
                                                        className="rounded border-white/20 bg-white/5 text-orange-500 focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5"
                                                    />
                                                    <LinkIcon className="w-3 h-3" /> Foreign Key
                                                </label>
                                            </div>

                                            {c.isForeignKey && (
                                                <div className="grid grid-cols-2 gap-3 pt-2 animate-in slide-in-from-top-1">
                                                    <Select
                                                        value={c.fkTargetTable}
                                                        onValueChange={(v) => handleTargetTableChange(i, v)}
                                                    >
                                                        <SelectTrigger className="bg-blue-500/10 border-blue-500/20 h-8 text-xs text-blue-300">
                                                            <SelectValue placeholder="Select Target Table" />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-neutral-800 border-white/10">
                                                            {refTables.map((t) => (
                                                                <SelectItem key={t} value={t} className="text-neutral-300">
                                                                    {t}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>

                                                    <Select
                                                        value={c.fkTargetColumn}
                                                        disabled={!c.fkTargetTable || fetchingTable === c.fkTargetTable}
                                                        onValueChange={(v) => updateColumn(i, "fkTargetColumn", v)}
                                                    >
                                                        <SelectTrigger className="bg-blue-500/10 border-blue-500/20 h-8 text-xs text-blue-300">
                                                            <SelectValue
                                                                placeholder={fetchingTable === c.fkTargetTable ? "Loading..." : "Select Target Column"}
                                                            />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-neutral-800 border-white/10">
                                                            {availableColumns[c.fkTargetTable!]?.map((col) => (
                                                                <SelectItem key={col} value={col} className="text-neutral-300">
                                                                    {col}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </form>
                    </div>

                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                        <Button
                            type="submit"
                            form="create-table-form"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                "Create Table"
                            )}
                        </Button>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
