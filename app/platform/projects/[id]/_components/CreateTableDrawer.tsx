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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    Plus,
    Trash2,
    Link as LinkIcon,
    Loader2,
    KeyRound,
    Type,
    Settings2,
    Database,
    TableProperties
} from "lucide-react";
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

            <DrawerContent className="bg-neutral-950 text-white h-[95vh] rounded-t-2xl border-t border-white/10 outline-none">
                <div className="mx-auto w-full max-w-5xl h-full flex flex-col">
                    <DrawerHeader className="border-b border-white/5 pb-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-orange-500/10 rounded-lg">
                                <TableProperties className="w-5 h-5 text-orange-500" />
                            </div>
                            <DrawerTitle className="text-2xl font-semibold tracking-tight">Create New Table</DrawerTitle>
                        </div>
                        <DrawerDescription className="text-neutral-400 text-base">
                            Design your data structure by defining columns, types, and relationships.
                        </DrawerDescription>
                    </DrawerHeader>

                    <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        <form id="create-table-form" onSubmit={handleSubmit} className="space-y-8">
                            {/* General Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-sm font-medium text-neutral-300">
                                    <Database className="w-4 h-4 text-orange-500" />
                                    <span className="uppercase tracking-wider text-xs">Table Configuration</span>
                                </div>
                                <div className="bg-neutral-900/50 border border-white/10 rounded-xl p-1.5 focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500/50 transition-all">
                                    <Input
                                        value={tableName}
                                        onChange={(e) => setTableName(e.target.value)}
                                        placeholder="e.g. users_profiles"
                                        className="bg-transparent border-0 text-lg h-12 focus-visible:ring-0 placeholder:text-neutral-600 font-medium"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {/* Columns Section */}
                            <div className="space-y-5">
                                <div className="flex items-center justify-between sticky top-0 z-10 bg-neutral-950/80 backdrop-blur-sm py-2">
                                    <div className="flex items-center gap-2 text-sm font-medium text-neutral-300">
                                        <Settings2 className="w-4 h-4 text-orange-500" />
                                        <span className="uppercase tracking-wider text-xs">Schema Definition</span>
                                        <span className="bg-white/10 text-xs px-2 py-0.5 rounded-full text-neutral-400">{columns.length} columns</span>
                                    </div>
                                    <Button
                                        type="button"
                                        onClick={addColumn}
                                        variant="outline"
                                        size="sm"
                                        className="h-8 border-orange-500/20 text-orange-500 hover:text-orange-400 hover:bg-orange-500/10 hover:border-orange-500/30 transition-all"
                                    >
                                        <Plus className="w-3.5 h-3.5 mr-1.5" />
                                        Add Column
                                    </Button>
                                </div>

                                <div className="grid gap-4">
                                    {columns.map((c, i) => (
                                        <div
                                            key={i}
                                            className="group relative p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-200 hover:border-white/10 hover:shadow-lg hover:shadow-black/20"
                                        >
                                            <div className="flex flex-col md:flex-row items-start gap-4">
                                                {/* Counter */}
                                                <div className="hidden md:flex items-center justify-center w-6 h-6 rounded-full bg-white/5 text-xs text-neutral-500 font-mono mt-1.5">
                                                    {i + 1}
                                                </div>

                                                <div className="flex-1 w-full space-y-4">
                                                    {/* Top Row: Name, Type, Default */}
                                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                                                        <div className="md:col-span-5 space-y-1.5">
                                                            <div className="relative">
                                                                <Type className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
                                                                <Input
                                                                    placeholder="Column Name"
                                                                    value={c.name}
                                                                    onChange={(e) => updateColumn(i, "name", e.target.value)}
                                                                    className="pl-9 bg-black/20 border-white/5 h-10 focus-visible:ring-1 focus-visible:ring-orange-500/50 hover:bg-black/30 transition-colors placeholder:text-neutral-600"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="md:col-span-3 space-y-1.5">
                                                            <Select
                                                                value={c.type}
                                                                onValueChange={(v) => updateColumn(i, "type", v)}
                                                            >
                                                                <SelectTrigger className="bg-black/20 border-white/5 h-10 text-neutral-300 hover:bg-black/30 hover:text-white transition-colors">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent className="bg-neutral-900 border-white/10">
                                                                    {[
                                                                        "text",
                                                                        "integer",
                                                                        "boolean",
                                                                        "float",
                                                                        "uuid",
                                                                        "json",
                                                                        "datetime",
                                                                    ].map((t) => (
                                                                        <SelectItem key={t} value={t} className="text-neutral-300 focus:bg-orange-500/10 focus:text-orange-500 cursor-pointer">
                                                                            {t}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                        <div className="md:col-span-4 space-y-1.5">
                                                            <Input
                                                                placeholder="Default Value (Optional)"
                                                                value={c.defaultValue}
                                                                onChange={(e) => updateColumn(i, "defaultValue", e.target.value)}
                                                                className="bg-black/20 border-white/5 h-10 text-neutral-400 focus:text-white hover:bg-black/30 transition-colors placeholder:text-neutral-600"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Bottom Row: Constraints & FK */}
                                                    <div className="flex flex-col md:flex-row md:items-center gap-4 pt-2 border-t border-white/5 mt-2">
                                                        <div className="flex flex-wrap items-center gap-6">
                                                            <div className="flex items-center space-x-2">
                                                                <Checkbox
                                                                    id={`primary-${i}`}
                                                                    checked={c.primary}
                                                                    onCheckedChange={(checked) => updateColumn(i, "primary", checked === true)}
                                                                    className="border-white/20 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                                                                />
                                                                <Label
                                                                    htmlFor={`primary-${i}`}
                                                                    className="text-xs font-medium text-neutral-400 cursor-pointer hover:text-white flex items-center gap-1.5"
                                                                >
                                                                    <KeyRound className="w-3 h-3" /> Primary Key
                                                                </Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <Checkbox
                                                                    id={`notNull-${i}`}
                                                                    checked={c.notNull}
                                                                    onCheckedChange={(checked) => updateColumn(i, "notNull", checked === true)}
                                                                    className="border-white/20 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                                                                />
                                                                <Label
                                                                    htmlFor={`notNull-${i}`}
                                                                    className="text-xs font-medium text-neutral-400 cursor-pointer hover:text-white flex items-center gap-1.5"
                                                                >
                                                                    Not Null
                                                                </Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <Checkbox
                                                                    id={`fk-${i}`}
                                                                    checked={c.isForeignKey}
                                                                    onCheckedChange={(checked) => updateColumn(i, "isForeignKey", checked === true)}
                                                                    className="border-white/20 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                                                                />
                                                                <Label
                                                                    htmlFor={`fk-${i}`}
                                                                    className="text-xs font-medium text-neutral-400 cursor-pointer hover:text-white flex items-center gap-1.5"
                                                                >
                                                                    <LinkIcon className="w-3 h-3" /> Foreign Key
                                                                </Label>
                                                            </div>
                                                        </div>

                                                        {c.isForeignKey && (
                                                            <div className="flex-1 grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
                                                                <Select
                                                                    value={c.fkTargetTable}
                                                                    onValueChange={(v) => handleTargetTableChange(i, v)}
                                                                >
                                                                    <SelectTrigger className="bg-blue-500/10 border-blue-500/20 h-9 text-xs text-blue-200">
                                                                        <SelectValue placeholder="Target Table" />
                                                                    </SelectTrigger>
                                                                    <SelectContent className="bg-neutral-900 border-white/10">
                                                                        {refTables.map((t) => (
                                                                            <SelectItem key={t} value={t} className="text-neutral-300 cursor-pointer focus:bg-blue-500/20">
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
                                                                    <SelectTrigger className="bg-blue-500/10 border-blue-500/20 h-9 text-xs text-blue-200">
                                                                        <SelectValue
                                                                            placeholder={fetchingTable === c.fkTargetTable ? "Loading..." : "Target Column"}
                                                                        />
                                                                    </SelectTrigger>
                                                                    <SelectContent className="bg-neutral-900 border-white/10">
                                                                        {availableColumns[c.fkTargetTable!]?.map((col) => (
                                                                            <SelectItem key={col} value={col} className="text-neutral-300 cursor-pointer focus:bg-blue-500/20">
                                                                                {col}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Delete Button */}
                                                {columns.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => removeColumn(i)}
                                                        className="md:opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-neutral-600 hover:text-red-400 hover:bg-red-500/10 absolute right-2 top-2 md:static md:mt-1.5"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </form>
                    </div>

                    <DrawerFooter className="border-t border-white/5 pt-6 pb-8 bg-neutral-950/80 backdrop-blur-sm">
                        <div className="flex items-center justify-end gap-3 w-full max-w-5xl mx-auto">
                            <DrawerClose asChild>
                                <Button variant="ghost" className="text-neutral-400 hover:text-white hover:bg-white/5">Cancel</Button>
                            </DrawerClose>
                            <Button
                                type="submit"
                                form="create-table-form"
                                disabled={loading}
                                className="bg-orange-600 hover:bg-orange-500 text-white min-w-[140px]"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin w-4 h-4 mr-2" />
                                ) : (
                                    <Plus className="w-4 h-4 mr-2" />
                                )}
                                {loading ? "Creating..." : "Create Table"}
                            </Button>
                        </div>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
