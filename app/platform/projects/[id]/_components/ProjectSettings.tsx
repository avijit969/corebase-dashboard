import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Shield } from 'lucide-react';

interface ProjectSettingsProps {
    handleDeleteProject: () => void;
}

export function ProjectSettings({ handleDeleteProject }: ProjectSettingsProps) {
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
                    <Button variant="destructive" className="bg-red-600 hover:bg-red-700" onClick={handleDeleteProject}>Delete Project</Button>
                </div>
            </CardContent>
        </Card>
    );
}
