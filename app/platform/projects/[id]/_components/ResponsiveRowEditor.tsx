import React, { useEffect, useState } from "react";
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
} from "@/components/ui/drawer";
import { TableSchema } from "../types";
import { DataForm } from "./DataForm";

const useMediaQuery = (query: string) => {
    const [value, setValue] = useState(false);

    useEffect(() => {
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

interface ResponsiveRowEditorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    schema: TableSchema;
    formData: Record<string, any>;
    setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    onSubmit: () => void;
    submitLabel: string;
    isSubmitting?: boolean;
}

export const ResponsiveRowEditor = ({
    open,
    onOpenChange,
    title,
    description,
    schema,
    formData,
    setFormData,
    onSubmit,
    submitLabel,
    isSubmitting
}: ResponsiveRowEditorProps) => {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    if (isDesktop) {
        return (
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent side="right" className="bg-neutral-950 border-white/10 text-white sm:max-w-xl w-full flex flex-col h-full">
                    <SheetHeader className="pb-4 border-b border-white/10">
                        <SheetTitle className="text-xl font-bold">{title}</SheetTitle>
                        {description && <SheetDescription>{description}</SheetDescription>}
                    </SheetHeader>
                    <div className="px-4 h-full overflow-hidden">
                        <DataForm
                            schema={schema}
                            formData={formData}
                            setFormData={setFormData}
                            onSubmit={onSubmit}
                            submitLabel={submitLabel}
                            isSubmitting={isSubmitting}
                            onCancel={() => onOpenChange(false)}
                        />
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
                    <DataForm
                        schema={schema}
                        formData={formData}
                        setFormData={setFormData}
                        onSubmit={onSubmit}
                        submitLabel={submitLabel}
                        isSubmitting={isSubmitting}
                        onCancel={() => onOpenChange(false)}
                    />
                </div>
            </DrawerContent>
        </Drawer>
    );
};
