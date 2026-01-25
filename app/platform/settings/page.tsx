"use client";

import React from 'react';
import { useAuthStore } from '@/lib/store/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Lock, Trash2, LogOut, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function PlatformSettingsPage() {
    const { user, logout } = useAuthStore();

    const handleUpdateProfile = (e: React.FormEvent) => {
        e.preventDefault();
        toast.info("thoda time lagega bhai 😅..");
    };

    const handleChangePassword = (e: React.FormEvent) => {
        e.preventDefault();
        toast.info("Ek bar me sab kuch nahi ho sakta 😅...");
    };

    return (
        <div className="container max-w-4xl mx-auto p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Platform Settings</h1>
                <p className="text-neutral-400 mt-2">Manage your account and preferences.</p>
            </div>

            <Tabs defaultValue="account" className="space-y-6">
                <TabsList className="bg-neutral-900 border border-white/10 p-1">
                    <TabsTrigger value="account" className="data-[state=active]:bg-white/10 text-neutral-400 data-[state=active]:text-white">
                        <User className="w-4 h-4 mr-2" />
                        Account
                    </TabsTrigger>
                    <TabsTrigger value="security" className="data-[state=active]:bg-white/10 text-neutral-400 data-[state=active]:text-white">
                        <Shield className="w-4 h-4 mr-2" />
                        Security
                    </TabsTrigger>
                </TabsList>

                {/* Account Tab */}
                <TabsContent value="account" className="space-y-6">
                    <Card className="bg-neutral-900 border-white/10">
                        <CardHeader>
                            <CardTitle className="text-xl text-white">Personal Information</CardTitle>
                            <CardDescription>Update your personal details.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name" className="text-neutral-300">Display Name</Label>
                                    <Input
                                        id="name"
                                        defaultValue={user?.name || ''}
                                        className="bg-black/50 border-white/10 text-white"
                                        placeholder="Your name"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email" className="text-neutral-300">Email Address</Label>
                                    <Input
                                        id="email"
                                        defaultValue={user?.email || ''}
                                        className="bg-black/50 border-white/10 text-neutral-400"
                                        disabled
                                    />
                                    <p className="text-xs text-neutral-500">
                                        Email address cannot be changed.
                                    </p>
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="bg-neutral-900 border-red-900/20">
                        <CardHeader>
                            <CardTitle className="text-xl text-red-500">Danger Zone</CardTitle>
                            <CardDescription>Actions that cannot be undone.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 border border-red-900/20 rounded-lg bg-red-900/10">
                                <div>
                                    <h4 className="text-red-400 font-medium">Delete Account</h4>
                                    <p className="text-sm text-red-400/70">
                                        Permanently delete your account and all associated data.
                                    </p>
                                </div>
                                <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Account
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security" className="space-y-6">
                    <Card className="bg-neutral-900 border-white/10">
                        <CardHeader>
                            <CardTitle className="text-xl text-white">Change Password</CardTitle>
                            <CardDescription>Ensure your account is using a long, random password to stay secure.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleChangePassword} className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="current-password" className="text-neutral-300">Current Password</Label>
                                    <Input
                                        id="current-password"
                                        type="password"
                                        className="bg-black/50 border-white/10 text-white"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="new-password" className="text-neutral-300">New Password</Label>
                                    <Input
                                        id="new-password"
                                        type="password"
                                        className="bg-black/50 border-white/10 text-white"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="confirm-password" className="text-neutral-300">Confirm New Password</Label>
                                    <Input
                                        id="confirm-password"
                                        type="password"
                                        className="bg-black/50 border-white/10 text-white"
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit" className="bg-white text-black hover:bg-neutral-200">
                                        Update Password
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="bg-neutral-900 border-white/10">
                        <CardHeader>
                            <CardTitle className="text-xl text-white">Session Management</CardTitle>
                            <CardDescription>Manage your active sessions.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-white">Current Session</p>
                                    <p className="text-xs text-neutral-500">Active now</p>
                                </div>
                                <Button variant="outline" onClick={logout} className="border-white/10 hover:bg-white/5 hover:text-white">
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Sign out
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
