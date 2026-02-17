"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Github, Globe, Key } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

interface ProviderConfig {
    enabled: boolean;
    clientId: string;
    clientSecret: string;
    redirectUrl?: string;
}

interface ProvidersState {
    google: ProviderConfig;
    github: ProviderConfig;
}

export default function ProvidersPage() {
    const params = useParams();
    const id = params?.id as string;

    const [providers, setProviders] = useState<ProvidersState>({
        google: { enabled: false, clientId: '', clientSecret: '' },
        github: { enabled: false, clientId: '', clientSecret: '' },
    });

    const [loading, setLoading] = useState(false);
    const [projectLoading, setProjectLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            const token = localStorage.getItem("platform_token");
            if (!token || !id) return;
            try {
                const data = await api.projects.get(id, token);
                if (data?.meta) {
                    setProviders(prev => ({
                        ...prev,
                        google: {
                            ...prev.google,
                            enabled: !!data.meta.google_client_id,
                            clientId: data.meta.google_client_id || '',
                            clientSecret: data.meta.google_client_secret || ''
                        },
                        github: {
                            ...prev.github,
                            enabled: !!data.meta.github_client_id,
                            clientId: data.meta.github_client_id || '',
                            clientSecret: data.meta.github_client_secret || ''
                        }
                    }));
                }
            } catch (error) {
                console.error("Failed to fetch provider settings", error);
            } finally {
                setProjectLoading(false);
            }
        };
        fetchSettings();
    }, [id]);

    const handleToggle = (provider: keyof ProvidersState) => {
        setProviders(prev => ({
            ...prev,
            [provider]: { ...prev[provider], enabled: !prev[provider].enabled }
        }));
    };

    const handleChange = (provider: keyof ProvidersState, field: keyof ProviderConfig, value: string) => {
        setProviders(prev => ({
            ...prev,
            [provider]: { ...prev[provider], [field]: value }
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        const token = localStorage.getItem("platform_token");
        if (!token) {
            toast.error("Authentication error");
            setLoading(false);
            return;
        }

        try {
            await api.projects.updateAuthConfig(id, token, {
                google_client_id: providers.google.enabled ? providers.google.clientId : "",
                google_client_secret: providers.google.enabled ? providers.google.clientSecret : "",
                github_client_id: providers.github.enabled ? providers.github.clientId : "",
                github_client_secret: providers.github.enabled ? providers.github.clientSecret : ""
            });

            toast.success("Providers configuration saved successfully");
        } catch (error) {
            console.error("Failed to save providers", error);
            toast.error("Failed to save configuration");
        } finally {
            setLoading(false);
        }
    };

    if (projectLoading) {
        return (
            <div className="space-y-6 max-w-4xl">
                <div className="grid gap-6">
                    <Skeleton className="h-[200px] w-full rounded-xl bg-neutral-900/50" />
                    <Skeleton className="h-[200px] w-full rounded-xl bg-neutral-900/50" />
                </div>
                <div className="flex justify-end pt-4">
                    <Skeleton className="h-10 w-[150px] rounded-md bg-neutral-900/50" />
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="grid gap-6">
                {/* Google Provider */}
                <Card className="bg-neutral-900/50 border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="space-y-1">
                            <CardTitle className="text-xl text-white flex items-center gap-2">
                                <Globe className="w-5 h-5 text-blue-400" />
                                Google
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                                Allow users to sign in with their Google account.
                            </CardDescription>
                        </div>
                        <Switch
                            checked={providers.google.enabled}
                            onCheckedChange={() => handleToggle('google')}
                        />
                    </CardHeader>
                    {providers.google.enabled && (
                        <CardContent className="space-y-4 pt-4 animate-in slide-in-from-top-2 duration-200">
                            <div className="grid gap-2">
                                <Label htmlFor="google-client-id" className="text-gray-300">Client ID</Label>
                                <Input
                                    id="google-client-id"
                                    placeholder="Enter your Google Client ID"
                                    value={providers.google.clientId}
                                    onChange={(e) => handleChange('google', 'clientId', e.target.value)}
                                    className="bg-neutral-950 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500/50"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="google-client-secret" className="text-gray-300">Client Secret</Label>
                                <Input
                                    id="google-client-secret"
                                    type="password"
                                    placeholder="Enter your Google Client Secret"
                                    value={providers.google.clientSecret}
                                    onChange={(e) => handleChange('google', 'clientSecret', e.target.value)}
                                    className="bg-neutral-950 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500/50"
                                />
                            </div>
                            <div className="grid gap-2 pt-2">
                                <Label className="text-gray-300">Redirect URL</Label>
                                <div className="p-3 bg-neutral-950 rounded-md border border-white/10 text-sm text-gray-400 font-mono break-all">
                                    https://api.corebase.dev/v1/auth/callback/google
                                </div>
                                <p className="text-xs text-gray-500">Add this URL to your Google Cloud Console configuration.</p>
                            </div>
                        </CardContent>
                    )}
                </Card>

                {/* GitHub Provider */}
                <Card className="bg-neutral-900/50 border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="space-y-1">
                            <CardTitle className="text-xl text-white flex items-center gap-2">
                                <Github className="w-5 h-5 text-white" />
                                GitHub
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                                Allow users to sign in with their GitHub account.
                            </CardDescription>
                        </div>
                        <Switch
                            checked={providers.github.enabled}
                            onCheckedChange={() => handleToggle('github')}
                        />
                    </CardHeader>
                    {providers.github.enabled && (
                        <CardContent className="space-y-4 pt-4 animate-in slide-in-from-top-2 duration-200">
                            <div className="grid gap-2">
                                <Label htmlFor="github-client-id" className="text-gray-300">Client ID</Label>
                                <Input
                                    id="github-client-id"
                                    placeholder="Enter your GitHub Client ID"
                                    value={providers.github.clientId}
                                    onChange={(e) => handleChange('github', 'clientId', e.target.value)}
                                    className="bg-neutral-950 border-white/10 text-white placeholder:text-gray-600 focus:border-purple-500/50"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="github-client-secret" className="text-gray-300">Client Secret</Label>
                                <Input
                                    id="github-client-secret"
                                    type="password"
                                    placeholder="Enter your GitHub Client Secret"
                                    value={providers.github.clientSecret}
                                    onChange={(e) => handleChange('github', 'clientSecret', e.target.value)}
                                    className="bg-neutral-950 border-white/10 text-white placeholder:text-gray-600 focus:border-purple-500/50"
                                />
                            </div>
                            <div className="grid gap-2 pt-2">
                                <Label className="text-gray-300">Redirect URL</Label>
                                <div className="p-3 bg-neutral-950 rounded-md border border-white/10 text-sm text-gray-400 font-mono break-all">
                                    https://api.corebase.dev/v1/auth/callback/github
                                </div>
                                <p className="text-xs text-gray-500">Add this URL to your GitHub OAuth App configuration.</p>
                            </div>
                        </CardContent>
                    )}
                </Card>
            </div>

            <div className="flex justify-end pt-4">
                <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8"
                >
                    {loading ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </div>
    );
}
