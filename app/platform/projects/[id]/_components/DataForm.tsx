import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { TableSchema } from "../types";
import { ReferenceInput } from "./ReferenceInput";

interface DataFormProps {
    schema: TableSchema;
    formData: Record<string, any>;
    setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    onSubmit: () => void;
    submitLabel: string;
    isSubmitting?: boolean;
    onCancel: () => void;
}

export const DataForm = ({ schema, formData, setFormData, onSubmit, submitLabel, isSubmitting, onCancel }: DataFormProps) => {

    const renderInput = (col: any) => {
        if (col.primary && (col.type === 'integer' || col.type === 'uuid')) return null;
        console.log(col);
        if (col.references) {
            return (
                <ReferenceInput
                    key={col.name}
                    col={col}
                    value={formData[col.name]}
                    onChange={(value) => setFormData(prev => ({ ...prev, [col.name]: value }))}
                />
            );
        }
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

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto py-4 px-1 space-y-6">
                {schema.columns.map(renderInput)}
            </div>
            <div className="pt-6 mt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <Button
                    variant="ghost"
                    onClick={onCancel}
                    className="hover:bg-white/5 active:scale-95 transition-all"
                >
                    Cancel
                </Button>
                <Button
                    onClick={onSubmit}
                    className="bg-primary-600 hover:bg-primary-500 active:scale-95 transition-all min-w-[100px]"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : submitLabel}
                </Button>
            </div>
        </div>
    );
}
