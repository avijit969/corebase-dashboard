import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Shield, AlertTriangle } from 'lucide-react';

interface ProjectSettingsProps {
    projectName: string;
    handleDeleteProject: () => void;
}

export function ProjectSettings({ projectName, handleDeleteProject }: ProjectSettingsProps) {
    const [confirmName, setConfirmName] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const onDelete = async () => {
        setIsDeleting(true);
        await handleDeleteProject();
        setIsDeleting(false);
    };

    return (
        <Card className="bg-neutral-900/50 border-white/10 text-white backdrop-blur-sm animate-in fade-in duration-500">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-gray-400" />
                    Project Settings
                </CardTitle>
                <CardDescription className="text-gray-400">
                    Configure your project parameters.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="p-4 rounded-lg border border-red-500/20 bg-red-500/5">
                    <h3 className="text-red-400 font-medium mb-2 flex items-center gap-2">
                        <Shield className="w-4 h-4" /> Danger Zone
                    </h3>
                    <p className="text-sm text-red-300/70 mb-4">
                        Deleting a project is irreversible. All data, including users and tables, will be permanently lost.
                    </p>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="destructive" className="bg-red-600 hover:bg-red-700">Delete Project</Button>
                        </DialogTrigger>
                        <DialogContent className="bg-neutral-900 border-white/10 text-white sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 text-red-500">
                                    <AlertTriangle className="w-5 h-5" />
                                    Delete Project
                                </DialogTitle>
                                <DialogDescription className="text-gray-400">
                                    This action cannot be undone. This will permanently delete the project <span className="font-bold text-white">{projectName}</span> and remove all associated data.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col gap-4 py-4">
                                <Label htmlFor="confirm-name" className="text-gray-300">
                                    Type <span className="font-mono text-orange-400 bg-orange-400/10 px-1 rounded">{projectName}</span> to confirm.
                                </Label>
                                <Input
                                    id="confirm-name"
                                    value={confirmName}
                                    onChange={(e) => setConfirmName(e.target.value)}
                                    className="bg-black/50 border-white/10 text-white focus:ring-red-500/50"
                                    placeholder="Enter project name"
                                    autoComplete="off"
                                />
                            </div>
                            <DialogFooter className="gap-2 sm:justify-between">
                                <DialogClose asChild>
                                    <Button variant="ghost" className="hover:bg-white/10 text-gray-400 hover:text-white">Cancel</Button>
                                </DialogClose>
                                <Button
                                    variant="destructive"
                                    onClick={onDelete}
                                    disabled={confirmName !== projectName || isDeleting}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    {isDeleting ? "Deleting..." : "Delete Project"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
        </Card>
    );
}
