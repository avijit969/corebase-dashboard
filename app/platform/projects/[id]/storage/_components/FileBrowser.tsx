"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import {
    File,
    FileImage,
    FileText,
    MoreVertical,
    Trash2,
    Copy,
    UploadCloud,
    Loader2,
    FolderOpen,
    Menu
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose } from '@/components/ui/drawer';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface StorageFile {
    id: string;
    key: string;
    bucket: string;
    filename: string;
    mime_type: string;
    size: number;
    url?: string;
    created_at: string;
}

interface FileBrowserProps {
    apiKey: string;
    bucketName: string | null;
    onToggleSidebar?: () => void;
}

export function FileBrowser({ apiKey, bucketName, onToggleSidebar }: FileBrowserProps) {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState<StorageFile | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const queryClient = useQueryClient();

    const { data: files = [], isLoading } = useQuery({
        queryKey: ['storage-files', bucketName],
        queryFn: async () => {
            if (!bucketName || !apiKey) return [];
            const res = await api.storage.listFiles(apiKey, bucketName);
            return Array.isArray(res) ? res : (res.files || []);
        },
        enabled: !!bucketName && !!apiKey
    });

    const { mutate: uploadFiles, isPending: isUploading } = useMutation({
        mutationFn: async (fileList: FileList) => {
            if (!bucketName) return;
            let successCount = 0;
            for (let i = 0; i < fileList.length; i++) {
                const file = fileList[i];
                // 1. Get Signed URL
                const signRes = await api.storage.getUploadUrl(apiKey, {
                    bucketName,
                    filename: file.name,
                    contentType: file.type || 'application/octet-stream',
                    size: file.size
                });

                if (!signRes.uploadUrl) {
                    throw new Error(`Failed to get signed URL for ${file.name}`);
                }

                // 2. Upload to Signed URL
                const uploadRes = await fetch(signRes.uploadUrl, {
                    method: 'PUT',
                    headers: { 'Content-Type': file.type || 'application/octet-stream' },
                    body: file
                });

                if (!uploadRes.ok) {
                    throw new Error(`Failed to upload ${file.name}`);
                }
                successCount++;
            }
            return successCount;
        },
        onSuccess: (count) => {
            if (count && count > 0) {
                toast.success(`Uploaded ${count} files successfully`);
                queryClient.invalidateQueries({ queryKey: ['storage-files', bucketName] });
            }
        },
        onError: (error: any) => {
            console.error("Upload error:", error);
            toast.error(error.message || "Upload failed");
        }
    });

    const { mutate: deleteFile } = useMutation({
        mutationFn: async (fileId: string) => {
            await api.storage.deleteFile(apiKey, fileId);
            return fileId;
        },
        onSuccess: (fileId) => {
            toast.success("File deleted");
            queryClient.invalidateQueries({ queryKey: ['storage-files', bucketName] });
            if (selectedFile?.id === fileId) {
                setIsDrawerOpen(false);
                setSelectedFile(null);
            }
        },
        onError: (error: any) => {
            toast.error("Failed to delete file");
        }
    });

    const handleDrag = function (e: React.DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = async function (e: React.DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (!bucketName) {
            toast.error("Please select a bucket first");
            return;
        }

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            await handleUpload(e.dataTransfer.files);
        }
    };

    const handleUpload = (fileList: FileList) => {
        uploadFiles(fileList);
    };

    const handleDelete = (fileId: string) => {
        if (!confirm("Are you sure you want to delete this file?")) return;
        deleteFile(fileId);
    };

    const copyUrl = (url: string) => {
        navigator.clipboard.writeText(url);
        toast.success("File URL copied to clipboard");
    };

    const FileIcon = ({ type }: { type: string }) => {
        if (type.startsWith('image/')) return <FileImage className="w-8 h-8 text-purple-400" />;
        if (type.startsWith('text/')) return <FileText className="w-8 h-8 text-blue-400" />;
        return <File className="w-8 h-8 text-gray-400" />;
    };

    if (!bucketName) {
        return (
            <div className="flex-1 flex flex-col h-full relative">
                <div className="md:hidden flex items-center p-4 border-b border-white/5">
                    <Button variant="ghost" size="icon" className="mr-2 -ml-2 text-neutral-400" onClick={onToggleSidebar}>
                        <Menu className="w-5 h-5" />
                    </Button>
                    <span className="font-semibold">Storage</span>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center text-neutral-500 border-2 border-dashed border-white/5 rounded-xl bg-black/20 m-4">
                    <FolderOpen className="w-16 h-16 opacity-20 mb-4" />
                    <p className="text-lg">Select a bucket to view files</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="flex-1 p-6 h-full flex flex-col relative"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="md:hidden -ml-2 text-neutral-400" onClick={onToggleSidebar}>
                        <Menu className="w-5 h-5" />
                    </Button>
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                        <FolderOpen className="w-5 h-5 text-orange-500" />
                        /{bucketName}
                    </h2>
                </div>
                <div>
                    <label htmlFor="file-upload" className="cursor-pointer">
                        <Button variant="default" size="sm" className="bg-white text-black hover:bg-neutral-200 pointer-events-none">
                            <UploadCloud className="w-4 h-4 mr-2" />
                            Upload Files
                        </Button>
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => e.target.files && handleUpload(e.target.files)}
                        disabled={isUploading}
                    />
                </div>
            </div>

            {/* Drag Overlay */}
            {dragActive && (
                <div className="absolute inset-0 bg-orange-500/10 border-2 border-orange-500 border-dashed rounded-xl z-50 flex items-center justify-center backdrop-blur-sm transition-all duration-200 m-4">
                    <div className="text-orange-500 font-medium text-xl animate-pulse flex flex-col items-center gap-4">
                        <UploadCloud className="w-16 h-16" />
                        Drop files to upload
                    </div>
                </div>
            )}

            {isUploading && (
                <div className="absolute top-4 right-4 bg-orange-600 text-white px-4 py-2 rounded shadow-lg z-50 flex items-center gap-2 animate-in slide-in-from-top-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                </div>
            )}

            {/* Files Grid */}
            {isLoading ? (
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                </div>
            ) : files.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl bg-black/20 text-neutral-400">
                    <UploadCloud className="w-12 h-12 opacity-30 mb-4" />
                    <p>Bucket is empty</p>
                    <p className="text-sm opacity-50 mt-1">Drag and drop files here to upload</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 overflow-y-auto pb-20">
                    {files.map((file: any) => (
                        <div key={file.id} className="group relative bg-neutral-900 border border-white/5 hover:border-orange-500/50 rounded-xl p-4 transition-all duration-200 hover:shadow-lg hover:shadow-orange-900/10 flex flex-col gap-3"
                            onClick={() => {
                                setIsDrawerOpen(true);
                                setSelectedFile(file)
                            }}
                        >
                            <div className="aspect-square rounded-lg bg-black/40 flex items-center justify-center overflow-hidden relative">
                                <FileIcon type={file.mime_type || 'application/octet-stream'} />
                            </div>

                            <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-white truncate" title={file.filename}>
                                        {file.filename}
                                    </p>
                                    <p className="text-xs text-neutral-500 truncate">
                                        {(file.size / 1024).toFixed(1)} KB
                                    </p>
                                </div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 text-neutral-400 hover:text-white">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-40 bg-neutral-900 border-white/10 text-white">
                                        <DropdownMenuItem onClick={() => copyUrl(file?.url!)}>
                                            <Copy className="w-4 h-4 mr-2" />
                                            Copy URL
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="bg-white/10" />
                                        <DropdownMenuItem onClick={() => handleDelete(file.id)} className="text-red-400 hover:text-red-300 hover:bg-red-900/20">
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} direction="right" modal>
                <DrawerContent className="max-w-md mx-auto">
                    <DrawerHeader className="border-b border-neutral-800 pb-4">
                        <DrawerTitle>{selectedFile?.filename}</DrawerTitle>
                        <DrawerDescription className="flex flex-col gap-2">
                            <span>Size: {selectedFile ? (selectedFile.size / 1024).toFixed(1) : ''} KB</span>
                            <span>Type: {selectedFile?.mime_type}</span>
                            <span>Created: {selectedFile?.created_at ? new Date(selectedFile.created_at).toLocaleString() : ''}</span>
                            {selectedFile?.url && (
                                <img src={selectedFile.url} alt={selectedFile.filename} className="w-full h-auto rounded mt-2" />
                            )}
                            {selectedFile?.url && (
                                <Button variant="outline" size="sm" onClick={() => copyUrl(selectedFile.url!)} className="mt-2">
                                    Copy URL
                                </Button>
                            )}
                        </DrawerDescription>
                    </DrawerHeader>
                    <DrawerClose asChild>
                        <Button variant="ghost" className="absolute top-2 right-2">Close</Button>
                    </DrawerClose>
                </DrawerContent>
            </Drawer>
        </div>
    );
}
