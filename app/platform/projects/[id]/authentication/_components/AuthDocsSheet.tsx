"use client";

import React from 'react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Terminal, LogIn } from 'lucide-react';
import { CodeView } from '@/components/ui/code-view';

interface AuthDocsSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AuthDocsSheet({ open, onOpenChange }: AuthDocsSheetProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[90vw] sm:max-w-xl md:max-w-2xl bg-neutral-950 border-l border-white/10 p-0 text-white flex flex-col shadow-2xl">
                <div className="px-6 py-6 border-b border-white/10 bg-black/20">
                    <SheetHeader>
                        <SheetTitle className="text-2xl flex items-center gap-2 text-white font-bold">
                            <Terminal className="w-6 h-6 text-primary-500" />
                            Authentication API Reference
                        </SheetTitle>
                        <SheetDescription className="text-neutral-400 mt-2">
                            Integrate the CoreBase JS SDK to manage users and secure sessions.
                        </SheetDescription>
                    </SheetHeader>
                </div>

                <div className="flex-1 overflow-y-auto px-6 pb-6 pt-6 custom-scrollbar space-y-8">
                    <div className="bg-primary-950/30 border border-primary-500/20 rounded-xl p-5 mb-4 shadow-inner">
                        <h4 className="text-primary-300 font-semibold mb-1">Global Authentication API</h4>
                        <p className="text-sm text-primary-200/80 leading-relaxed">
                            Authentication methods are exposed via the global <code className="bg-black/50 px-1.5 py-0.5 rounded font-mono text-primary-300 border border-primary-500/20">corebase.auth</code> object.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-white">Sign Up</h3>
                        <CodeView code={`const { data, error } = await corebase.auth.signUp({\n  email: 'user@example.com',\n  password: 'securePassword123',\n  name: 'John Doe'\n});`} />
                    </div>

                    <div className="space-y-3 pt-2">
                        <h3 className="text-lg font-semibold text-white">Sign In</h3>
                        <CodeView code={`const { data, error } = await corebase.auth.signIn({\n  email: 'user@example.com',\n  password: 'securePassword123'\n});`} />
                    </div>

                    <div className="space-y-3 pt-2">
                        <h3 className="text-lg font-semibold text-white">Get Current Session</h3>
                        <CodeView code={`const { data, error } = await corebase.auth.getUser();\n\nif (data) {\n  console.log('Logged in as:', data.user.email);\n}`} />
                    </div>

                    <div className="space-y-3 pt-2">
                        <h3 className="text-lg font-semibold text-white">Sign Out</h3>
                        <CodeView code={`await corebase.auth.signOut();`} />
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
