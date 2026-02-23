"use client";

import React from 'react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Terminal, UploadCloud } from 'lucide-react';
import { CodeView } from '@/components/ui/code-view';
import { useProjectStore } from '@/lib/stores/project-store';

interface StorageDocsSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    bucketName?: string | null;
}

export function StorageDocsSheet({ open, onOpenChange, bucketName = 'your_bucket' }: StorageDocsSheetProps) {
    const currentApiKey = useProjectStore(state => state.currentApiKey);
    const displayBucket = bucketName || 'your_bucket';

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[90vw] sm:max-w-xl md:max-w-2xl bg-neutral-950 border-l border-white/10 p-0 text-white flex flex-col shadow-2xl">
                <div className="px-6 py-6 border-b border-white/10 bg-black/20">
                    <SheetHeader>
                        <SheetTitle className="text-2xl flex items-center gap-2 text-white font-bold">
                            <Terminal className="w-6 h-6 text-primary-500" />
                            Storage API Reference
                        </SheetTitle>
                        <SheetDescription className="text-neutral-400 mt-2">
                            Integrate the CoreBase JS SDK to upload files to the <strong className="text-primary-400 font-mono bg-primary-500/10 px-1.5 py-0.5 rounded">{displayBucket}</strong> bucket.
                        </SheetDescription>
                    </SheetHeader>
                </div>

                <div className="flex-1 overflow-y-auto px-6 pb-6 pt-6 custom-scrollbar space-y-8">
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white flex items-center">
                            <UploadCloud className="w-5 h-5 mr-2 text-primary-400" />
                            Upload a File
                        </h3>
                        <p className="text-sm text-neutral-400">
                            Upload a file directly from the browser (e.g., from an <code>&lt;input type="file" /&gt;</code>).
                        </p>

                        <div className="mt-4">
                            <CodeView
                                code={`// Assuming you have an input element: <input type="file" id="fileInput" />\nconst fileInput = document.getElementById('fileInput') as HTMLInputElement;\nconst file = fileInput.files?.[0];\n\nif (file) {\n  const { data, error } = await corebase.storage.upload(file, '${displayBucket}');\n\n  if (error) {\n    console.error('Upload failed:', error);\n  } else {\n    console.log('File uploaded successfully!');\n    console.log('File Key:', data.key);\n    console.log('Upload URL:', data.url);\n  }\n}`}
                                language="typescript"
                            />
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
