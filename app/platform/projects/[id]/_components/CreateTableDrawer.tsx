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
import { Label } from "@/components/ui/label";
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

                    <form
                        id="create-table-form"
                        onSubmit={handleSubmit}
                        className="flex-1 overflow-y-auto px-4 space-y-6"
                    >
                        <Input
                            value={tableName}
                            onChange={(e) => setTableName(e.target.value)}
                            placeholder="table_name"
                            className="bg-black/50"
                        />

                        {columns.map((c, i) => (
                            <div
                                key={i}
                                className="p-4 rounded-lg border border-white/10 space-y-3"
                            >
                                <div className="grid grid-cols-12 gap-3">
                                    <Input
                                        className="col-span-4"
                                        placeholder="column"
                                        value={c.name}
                                        onChange={(e) =>
                                            updateColumn(i, "name", e.target.value)
                                        }
                                    />

                                    <Select
                                        value={c.type}
                                        onValueChange={(v) => updateColumn(i, "type", v)}
                                    >
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[
                                                "text",
                                                "integer",
                                                "boolean",
                                                "float",
                                                "uuid",
                                                "json",
                                                "datetime",
                                            ].map((t) => (
                                                <SelectItem key={t} value={t}>
                                                    {t}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Input
                                        className="col-span-4"
                                        placeholder="default"
                                        value={c.defaultValue}
                                        onChange={(e) =>
                                            updateColumn(i, "defaultValue", e.target.value)
                                        }
                                    />

                                    {columns.length > 1 && (
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => removeColumn(i)}
                                        >
                                            <Trash2 />
                                        </Button>
                                    )}
                                </div>

                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={c.isForeignKey}
                                        onChange={(e) =>
                                            updateColumn(i, "isForeignKey", e.target.checked)
                                        }
                                    />
                                    <LinkIcon className="w-3 h-3" /> Foreign Key
                                </label>

                                {c.isForeignKey && (
                                    <div className="grid grid-cols-2 gap-3">
                                        <Select
                                            value={c.fkTargetTable}
                                            onValueChange={(v) =>
                                                handleTargetTableChange(i, v)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Table" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {refTables.map((t) => (
                                                    <SelectItem key={t} value={t}>
                                                        {t}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <Select
                                            value={c.fkTargetColumn}
                                            disabled={
                                                !c.fkTargetTable ||
                                                fetchingTable === c.fkTargetTable
                                            }
                                            onValueChange={(v) =>
                                                updateColumn(i, "fkTargetColumn", v)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={
                                                        fetchingTable === c.fkTargetTable
                                                            ? "Loading..."
                                                            : "Column"
                                                    }
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableColumns[c.fkTargetTable!]?.map(
                                                    (col) => (
                                                        <SelectItem key={col} value={col}>
                                                            {col}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>
                        ))}

                        <Button type="button" onClick={addColumn} variant="outline">
                            <Plus className="w-4 h-4 mr-2" /> Add Column
                        </Button>
                    </form>

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
