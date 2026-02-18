import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useApiKey } from "@/lib/stores/project-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

interface ReferenceInputProps {
    col: any;
    value: any;
    onChange: (val: any) => void;
}

export const ReferenceInput = ({ col, value, onChange }: ReferenceInputProps) => {
    const apiKey = useApiKey();
    const [isOpen, setIsOpen] = useState(false);

    const { data, isLoading } = useQuery({
        queryKey: [col.references.table, 'reference-list'],
        queryFn: async () => {
            if (!apiKey) return null;
            const res = await api.tableOperations.select(apiKey, col.references.table!, {
                limit: 100,
            });
            return res;
        },
        enabled: isOpen && !!apiKey && !!col.references.table,
    });

    const items = data?.data || [];

    // Determine columns dynamically from first item options, defaulting if empty
    const firstItem = items[0] || {};
    // simple heuristic: show id and name if available, otherwise first 5 keys
    const allKeys = Object.keys(firstItem);
    const columns = allKeys.length > 0 ? allKeys.slice(0, 5) : ['id'];

    return (
        <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-gray-400">
                {col.name}
            </Label>
            <div className="col-span-3 flex gap-2">
                <Input
                    value={value || ''}
                    readOnly
                    placeholder={`Select ${col.name}`}
                    className="bg-neutral-800 border-white/10"
                />
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="shrink-0 bg-neutral-800 border-white/10 hover:bg-neutral-700 hover:text-white">
                            Select
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col bg-neutral-950 border-white/10 text-white">
                        <DialogHeader>
                            <DialogTitle>Select {col.references.table}</DialogTitle>
                        </DialogHeader>
                        <div className="flex-1 overflow-auto bg-neutral-900/50 rounded-md border border-white/5 mt-4">
                            <Table>
                                <TableHeader className="sticky top-0 bg-neutral-900 z-10 backdrop-blur-sm">
                                    <TableRow className="border-white/10 hover:bg-transparent">
                                        <TableHead className="w-[100px] text-white font-bold">Action</TableHead>
                                        {columns.map(key => (
                                            <TableHead key={key} className="text-gray-300 font-medium">{key}</TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={columns.length + 1} className="text-center h-32">
                                                <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary-500" />
                                                <span className="text-xs text-gray-500 mt-2 block">Loading records...</span>
                                            </TableCell>
                                        </TableRow>
                                    ) : items.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={columns.length + 1} className="text-center h-32 text-gray-500">
                                                No records found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        items.map((item: any, idx: number) => (
                                            <TableRow key={idx} className="border-white/5 hover:bg-white/5 transition-colors">
                                                <TableCell>
                                                    <Button
                                                        size="sm"
                                                        className="h-7 bg-primary-600 hover:bg-primary-500 text-white border-0"
                                                        onClick={() => {
                                                            onChange(item.id);
                                                            setIsOpen(false);
                                                        }}
                                                    >
                                                        Select
                                                    </Button>
                                                </TableCell>
                                                {columns.map(key => (
                                                    <TableCell key={key} className="text-gray-300 max-w-[200px] truncate">
                                                        {typeof item[key] === 'object' ? JSON.stringify(item[key]) : String(item[key])}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};
