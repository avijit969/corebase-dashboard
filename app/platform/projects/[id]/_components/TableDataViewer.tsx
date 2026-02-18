"use client";

import React, { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { TableSchema } from "../types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TableToolbar } from "./TableToolbar";
import { DataTable } from "./DataTable";
import { ResponsiveRowEditor } from "./ResponsiveRowEditor";

interface TableDataViewerProps {
    apiKey: string;
    tableName: string;
    schema: TableSchema;
}

export function TableDataViewer({ apiKey, tableName, schema }: TableDataViewerProps) {
    const queryClient = useQueryClient();

    // Dialogs
    const [isInsertOpen, setIsInsertOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [editingId, setEditingId] = useState<any>(null);

    // 1. Query: Fetch Data
    const { data: queryData, isLoading, isError, refetch } = useQuery({
        queryKey: ['tableData', apiKey, tableName],
        queryFn: async () => {
            const res = await api.tableOperations.select(apiKey, tableName, {
                limit: 50,
            });
            return res;
        }
    });

    const data = queryData?.data || (Array.isArray(queryData) ? queryData : []) || [];
    const total = queryData?.meta?.total || data.length || 0;

    // 2. Mutations
    const insertMutation = useMutation({
        mutationFn: async (newData: any) => {
            return await api.tableOperations.insert(apiKey, tableName, newData);
        },
        onSuccess: () => {
            toast.success("Row inserted");
            setIsInsertOpen(false);
            setFormData({});
            queryClient.invalidateQueries({ queryKey: ['tableData', apiKey, tableName] });
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to insert");
        }
    });

    const updateMutation = useMutation({
        mutationFn: async ({ updates, where }: { updates: any, where: any }) => {
            return await api.tableOperations.update(apiKey, tableName, { updates, where });
        },
        onSuccess: () => {
            toast.success("Row updated");
            setIsEditOpen(false);
            setFormData({});
            setEditingId(null);
            queryClient.invalidateQueries({ queryKey: ['tableData', apiKey, tableName] });
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to update");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (where: any) => {
            return await api.tableOperations.delete(apiKey, tableName, where);
        },
        onSuccess: () => {
            toast.success("Row deleted");
            queryClient.invalidateQueries({ queryKey: ['tableData', apiKey, tableName] });
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete");
        }
    });


    // Handlers
    const handleInsert = () => {
        insertMutation.mutate(formData);
    };

    const handleUpdate = () => {
        if (!editingId) return;
        const pkCol = schema.columns.find(c => c.primary)?.name || "id";
        updateMutation.mutate({
            updates: formData,
            where: { [pkCol]: editingId }
        });
    };

    const handleDelete = (row: any) => {
        const pkCol = schema.columns.find(c => c.primary)?.name || "id";
        const pkValue = row[pkCol];

        if (!pkValue) {
            toast.error("Cannot delete row without Primary Key");
            return;
        }

        if (!confirm("Are you sure?")) return;

        deleteMutation.mutate({ [pkCol]: pkValue });
    };

    // Open Edit
    const openEdit = (row: any) => {
        const pkCol = schema.columns.find(c => c.primary)?.name || "id";
        setEditingId(row[pkCol]);
        setFormData({ ...row });
        setIsEditOpen(true);
    };

    return (
        <div className="space-y-4">
            <TableToolbar
                total={total}
                isLoading={isLoading}
                onRefresh={() => refetch()}
                onInsert={() => { setFormData({}); setIsInsertOpen(true); }}
            />

            <DataTable
                schema={schema}
                data={data}
                isLoading={isLoading}
                isError={isError}
                onEdit={openEdit}
                onDelete={handleDelete}
            />

            <ResponsiveRowEditor
                open={isInsertOpen}
                onOpenChange={setIsInsertOpen}
                title="Insert New Row"
                onSubmit={handleInsert}
                submitLabel="Insert Row"
                description="Add a new record to this table."
                isSubmitting={insertMutation.isPending}
                schema={schema}
                formData={formData}
                setFormData={setFormData}
            />

            <ResponsiveRowEditor
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                title="Update Row"
                onSubmit={handleUpdate}
                submitLabel="Save Changes"
                description="Modify existing data."
                isSubmitting={updateMutation.isPending}
                schema={schema}
                formData={formData}
                setFormData={setFormData}
            />
        </div>
    );
}
