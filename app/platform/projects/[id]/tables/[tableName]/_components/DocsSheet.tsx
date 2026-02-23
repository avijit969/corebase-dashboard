"use client";

import React, { useState } from 'react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Terminal, Database, Server, LogIn } from 'lucide-react';
import { CodeView } from '@/components/ui/code-view';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProjectStore } from '@/lib/stores/project-store';

interface DocsSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tableName?: string;
    columns?: any[];
}



export function DocsSheet({ open, onOpenChange, tableName = 'your_table', columns = [] }: DocsSheetProps) {
    const currentApiKey = useProjectStore(state => state.currentApiKey);
    const apiKeyDisplay = currentApiKey || 'YOUR_API_KEY';

    const insertDataTemplate = React.useMemo(() => {
        const filteredCols = columns.filter(c => !c.primary && c.name !== 'id');
        if (filteredCols.length === 0) return `{\n    column_name: 'value',\n    // Add more fields\n  }`;

        const lines = filteredCols.slice(0, 3).map(col => {
            let val = "'value'";
            const t = (col.type || '').toLowerCase();
            if (t.includes('int') || t.includes('number') || t.includes('float') || t.includes('decimal')) val = '123';
            else if (t.includes('bool')) val = 'true';
            else if (t.includes('json')) val = '{ "key": "value" }';
            return `    ${col.name}: ${val}`;
        });

        let extra = filteredCols.length > 3 ? `\n    // ... ${filteredCols.length - 3} more fields` : '';
        return `{\n${lines.join(',')}${extra}  }`;
    }, [columns]);

    const updateDataTemplate = React.useMemo(() => {
        const col = columns.find(c => !c.primary && c.name !== 'id');
        if (col) {
            let val = "'new_value'";
            const t = (col.type || '').toLowerCase();
            if (t.includes('int') || t.includes('number')) val = '456';
            else if (t.includes('bool')) val = 'false';
            return `{ ${col.name}: ${val} }`;
        }
        return `{ column_name: 'new_value' }`;
    }, [columns]);

    const filterCol = React.useMemo(() => {
        return columns.find(c => !c.primary && c.name !== 'id')?.name || 'status';
    }, [columns]);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[90vw] sm:max-w-xl md:max-w-2xl bg-neutral-950 border-l border-white/10 p-0 text-white flex flex-col shadow-2xl">
                <div className="px-6 py-6 border-b border-white/10 bg-black/20">
                    <SheetHeader>
                        <SheetTitle className="text-2xl flex items-center gap-2 text-white font-bold">
                            <Terminal className="w-6 h-6 text-primary-500" />
                            API Reference
                        </SheetTitle>
                        <SheetDescription className="text-neutral-400 mt-2">
                            Integrate the CoreBase JS SDK directly with your <strong className="text-primary-400 font-mono bg-primary-500/10 px-1.5 py-0.5 rounded">{tableName}</strong> table.
                        </SheetDescription>
                    </SheetHeader>
                </div>

                <Tabs defaultValue="setup" className="flex-1 flex flex-col overflow-hidden">
                    <div className="px-6 pt-4 border-b border-white/5 bg-neutral-900/30">
                        <TabsList className="bg-neutral-900 border border-white/10 p-1 w-full justify-start overflow-x-auto gap-1">
                            <TabsTrigger value="setup" className="data-[state=active]:bg-primary-600 data-[state=active]:text-white rounded-md text-sm">
                                <Server className="w-4 h-4 mr-2" /> Setup
                            </TabsTrigger>
                            <TabsTrigger value="crud" className="data-[state=active]:bg-primary-600 data-[state=active]:text-white rounded-md text-sm">
                                <Database className="w-4 h-4 mr-2" /> Data Operations
                            </TabsTrigger>
                            <TabsTrigger value="auth" className="data-[state=active]:bg-primary-600 data-[state=active]:text-white rounded-md text-sm">
                                <LogIn className="w-4 h-4 mr-2" /> Authentication
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="flex-1 overflow-y-auto px-6 pb-6 pt-4 custom-scrollbar">
                        <TabsContent value="setup" className="space-y-8 focus-visible:outline-none mt-2">
                            <div className="space-y-4">
                                <div className="group">
                                    <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-2">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-xs text-neutral-300 group-hover:bg-primary-500 group-hover:text-white transition-colors">1</span>
                                        Installation
                                    </h3>
                                    <p className="text-sm text-neutral-400 ml-8">Install the official CoreBase JavaScript client into your project.</p>
                                    <div className="ml-8 mt-2">
                                        <CodeView code={`npm install corebase-js`} language="npm" />
                                    </div>
                                </div>

                                <div className="group pt-4">
                                    <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-2">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-xs text-neutral-300 group-hover:bg-primary-500 group-hover:text-white transition-colors">2</span>
                                        Initialization
                                    </h3>
                                    <p className="text-sm text-neutral-400 ml-8">Set up the client in your app using your unique API Key.</p>
                                    <div className="ml-8 mt-2">
                                        <CodeView
                                            code={`import { createClient } from 'corebase-js';\n\n// CoreBase API Endpoint\nconst CLIENT_URL = 'https://corebase.avijit.site';\n// Project API Key\nconst API_KEY = '${apiKeyDisplay}';\n\nexport const corebase = createClient(CLIENT_URL, API_KEY);`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="crud" className="space-y-10 focus-visible:outline-none mt-2">
                            {/* Read */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-white flex items-center">
                                    Read Data
                                </h3>

                                <div>
                                    <p className="text-sm text-neutral-300 font-medium mb-2">Fetch all records</p>
                                    <CodeView code={`const { data, error, count } = await corebase\n  .from('${tableName}')\n  .select('*');`} />
                                </div>

                                <div className="pt-2">
                                    <p className="text-sm text-neutral-300 font-medium mb-2">Filtering & Pagination</p>
                                    <CodeView code={`const { data, count } = await corebase\n  .from('${tableName}')\n  .select('*')\n  .eq('${filterCol}', 'active')\n  .order('created_at', { ascending: false })\n  .limit(10)\n  .page(1);`} />
                                </div>

                                <div className="pt-2">
                                    <p className="text-sm text-neutral-300 font-medium mb-2">Get a Single Record</p>
                                    <CodeView code={`const { data: record, error } = await corebase\n  .from('${tableName}')\n  .select('*')\n  .eq('id', 1)\n  .single();`} />
                                </div>
                            </div>

                            <div className="h-px bg-white/10 w-full" />

                            {/* Create */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-white flex items-center">
                                    Create Data
                                </h3>

                                <div>
                                    <p className="text-sm text-neutral-300 font-medium mb-2">Single Insert</p>
                                    <CodeView code={`const { data, error } = await corebase\n  .from('${tableName}')\n  .insert(${insertDataTemplate});`} />
                                </div>

                                <div className="pt-2">
                                    <p className="text-sm text-neutral-300 font-medium mb-2">Bulk Insert</p>
                                    <CodeView code={`const { data, error } = await corebase\n  .from('${tableName}')\n  .insert([\n  ${insertDataTemplate.replace(/\n(.*)/g, '\n  $1')},\n  ${insertDataTemplate.replace(/\n(.*)/g, '\n  $1')}\n  ]);`} />
                                </div>
                            </div>

                            <div className="h-px bg-white/10 w-full" />

                            {/* Update */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-white flex items-center">
                                    Update Data
                                </h3>

                                <div>
                                    <p className="text-sm text-neutral-400 mb-2">Modify existing rows that match your query.</p>
                                    <CodeView code={`const { data, error } = await corebase\n  .from('${tableName}')\n  .update(${updateDataTemplate})\n  .eq('id', 123);`} />
                                </div>
                            </div>

                            <div className="h-px bg-white/10 w-full" />

                            {/* Delete */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold flex items-center text-red-400">
                                    Delete Data
                                </h3>

                                <div>
                                    <p className="text-sm text-neutral-400 mb-2">Permanently remove records from the table.</p>
                                    <CodeView code={`const { data, error } = await corebase\n  .from('${tableName}')\n  .delete()\n  .eq('id', 123);`} />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="auth" className="space-y-8 focus-visible:outline-none mt-2">
                            <div className="bg-primary-950/30 border border-primary-500/20 rounded-xl p-5 mb-4 shadow-inner">
                                <h4 className="text-primary-300 font-semibold mb-1">Global Authentication API</h4>
                                <p className="text-sm text-primary-200/80 leading-relaxed">
                                    Authentication methods are exposed via the global <code className="bg-black/50 px-1.5 py-0.5 rounded font-mono text-primary-300 border border-primary-500/20">corebase.auth</code> object. These functions automatically manage session tokens for your end-users.
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
                        </TabsContent>
                    </div>
                </Tabs>
            </SheetContent>
        </Sheet>
    );
}
