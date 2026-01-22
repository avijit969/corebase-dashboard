"use client";

import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
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
import { toast } from "sonner";
import { api } from "@/lib/api";

interface AddForeignKeyDialogProps {
    apiKey: string;
    tableName: string;
    existingColumns: string[];
    onSuccess: () => void;
    children?: React.ReactNode;
}

export function AddForeignKeyDialog({
    apiKey,
    tableName,
    existingColumns,
    onSuccess,
    children,
}: AddForeignKeyDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [column, setColumn] = useState(existingColumns[0] || "");
    const [refTable, setRefTable] = useState("");
    const [refColumn, setRefColumn] = useState("id");
    const [onDelete, setOnDelete] = useState("cascade");

    const [refTables, setRefTables] = useState<string[]>([]);
    const [refColumns, setRefColumns] = useState<string[]>([]);

    /** Fetch all tables */
    useEffect(() => {
        const fetchTables = async () => {
            try {
                const res = await api.db.listTables(apiKey);

                if (!Array.isArray(res?.tables)) {
                    console.error("Invalid tables response", res);
                    return;
                }

                setRefTables(
                    res.tables
                        .map((t: any) => t.name)
                        .filter((name: string) => name !== tableName)
                );
            } catch (error) {
                console.error(error);
            }
        };

        fetchTables();
    }, [apiKey, tableName]);

    /** Fetch columns when refTable changes */
    useEffect(() => {
        if (!refTable) return;

        const fetchColumns = async () => {
            try {
                const table = await api.db.getTable(apiKey, refTable);
                setRefColumns(table.columns.map((c: any) => c.name));
                setRefColumn("id");
            } catch (err) {
                console.error(err);
            }
        };

        fetchColumns();
    }, [apiKey, refTable]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!column || !refTable || !refColumn) {
            toast.error("All fields are required");
            return;
        }

        try {
            setLoading(true);

            await api.db.addForeignKey(apiKey, tableName, {
                column,
                references: {
                    table: refTable,
                    column: refColumn,
                    onDelete,
                },
            });

            toast.success("Foreign key added successfully");
            setOpen(false);
            onSuccess();

            setRefTable("");
            setRefColumn("id");
        } catch (err: any) {
            toast.error(err.message || "Failed to add foreign key");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>

            <DialogContent className="bg-neutral-900 border-white/10 text-white max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Foreign Key</DialogTitle>
                    <DialogDescription>
                        Link a column in <strong>{tableName}</strong> to another table
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 w-full">
                    {/* Column */}
                    <div className="w-full">
                        <Label>Column</Label>
                        <Select value={column} onValueChange={setColumn}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {existingColumns.map((c) => (
                                    <SelectItem key={c} value={c}>
                                        {c}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Ref Table */}
                    <div className="w-full">
                        <Label>Referenced Table</Label>
                        <Select value={refTable} onValueChange={setRefTable}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select table" />
                            </SelectTrigger>
                            <SelectContent>
                                {refTables.map((t) => (
                                    <SelectItem key={t} value={t}>
                                        {t}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Ref Column */}
                    <div>
                        <Label>Referenced Column</Label>
                        <Select value={refColumn} onValueChange={setRefColumn}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {refColumns.map((c) => (
                                    <SelectItem key={c} value={c}>
                                        {c}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* On Delete */}
                    <div>
                        <Label>On Delete</Label>
                        <Select value={onDelete} onValueChange={setOnDelete}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cascade">Cascade</SelectItem>
                                <SelectItem value="set null">Set Null</SelectItem>
                                <SelectItem value="restrict">Restrict</SelectItem>
                                <SelectItem value="no action">No Action</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Adding..." : "Add Relation"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
