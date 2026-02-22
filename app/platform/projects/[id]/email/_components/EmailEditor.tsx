"use client";

import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Editor } from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Send, Eye, Code, FileText, SendHorizontal } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export interface EmailEditorProps {
    email: any;
    apiKey: string;
    projectId: string;
    projectName: string;
}

export default function EmailEditor({ email, apiKey, projectId, projectName }: EmailEditorProps) {
    const queryClient = useQueryClient();
    const [name, setName] = useState(email.name);
    const [subject, setSubject] = useState(email.subject || "");
    const [body, setBody] = useState(email.body || "");
    const [testEmail, setTestEmail] = useState("");

    // Reset local state when a different email is selected
    useEffect(() => {
        setName(email.name);
        setSubject(email.subject || "");
        setBody(email.body || "");
    }, [email.id]);

    const saveMutation = useMutation({
        mutationFn: async () => {
            return await api.customEmail.update(apiKey, email.id, {
                name,
                subject,
                body
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['custom-emails', projectId] });
            toast.success("Template saved!");
        },
        onError: (err: any) => {
            toast.error(err.message || "Failed to save template");
        }
    });

    const sendTestMutation = useMutation({
        mutationFn: async () => {
            if (!testEmail) throw new Error("Please enter a test email address");
            return await api.customEmail.send(apiKey, email.id, {
                to: testEmail,
                name: "John Doe",
                projectName: projectName || ""
            });
        },
        onSuccess: () => {
            toast.success("Test email sent!");
            setTestEmail("");
        },
        onError: (err: any) => {
            toast.error(err.message || "Failed to send test email");
        }
    });

    const handleSave = () => {
        if (!name.trim()) {
            toast.error("Template name cannot be empty");
            return;
        }
        saveMutation.mutate();
    };

    const handleSendTest = (e: React.FormEvent) => {
        e.preventDefault();
        sendTestMutation.mutate();
    };

    // Prepare preview HTML
    const previewHtml = body
        .replace(/\{\{user\.name\}\}/g, 'John Doe')
        .replace(/\{\{name\}\}/g, 'John Doe')
        .replace(/\{\{project\.name\}\}/g, projectName || "App");

    return (
        <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-300">
            {/* Header / Config */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-5 bg-neutral-950/50 rounded-xl border border-white/5">
                <div className="flex-1 space-y-4 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-gray-400 text-xs tracking-wide uppercase">Template Name</Label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-black/50 border-white/10 text-white h-10 focus:border-primary-500/50 focus:ring-primary-500/20"
                                placeholder="E.g., Welcome Email"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-gray-400 text-xs tracking-wide uppercase">Subject Line</Label>
                            <Input
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="bg-black/50 border-white/10 text-white h-10 focus:border-primary-500/50 focus:ring-primary-500/20"
                                placeholder="Welcome to our app!"
                            />
                        </div>
                    </div>
                </div>
                <div className="pt-6">
                    <Button
                        onClick={handleSave}
                        disabled={saveMutation.isPending}
                        className="bg-primary-600 hover:bg-primary-500 text-white shadow-lg w-full sm:w-auto"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {saveMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>

            {/* Main Tabs Area */}
            <Tabs defaultValue="editor" className="flex-1 flex flex-col min-h-0 w-full">
                <div className="flex items-center justify-between mb-2">
                    <TabsList className="bg-black/50 border border-white/10 p-1 w-fit rounded-lg">
                        <TabsTrigger value="editor" className="data-[state=active]:bg-primary-500/20 data-[state=active]:text-primary-400 text-neutral-400 h-8 text-xs font-medium px-4">
                            <Code className="w-3.5 h-3.5 mr-1.5" /> Editor
                        </TabsTrigger>
                        <TabsTrigger value="preview" className="data-[state=active]:bg-primary-500/20 data-[state=active]:text-primary-400 text-neutral-400 h-8 text-xs font-medium px-4">
                            <Eye className="w-3.5 h-3.5 mr-1.5" /> Preview
                        </TabsTrigger>
                        <TabsTrigger value="send" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 text-neutral-400 h-8 text-xs font-medium px-4">
                            <SendHorizontal className="w-3.5 h-3.5 mr-1.5" /> Send Test
                        </TabsTrigger>
                    </TabsList>

                    <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-500">
                        ✨ Valid variables: <code className="bg-white/5 px-1.5 py-0.5 rounded font-mono text-primary-400/80">{"{{user.name}}"}</code>, <code className="bg-white/5 px-1.5 py-0.5 rounded font-mono text-primary-400/80">{"{{project.name}}"}</code>
                    </div>
                </div>

                <div className="flex-1 bg-black/60 border border-white/10 rounded-xl overflow-hidden relative">
                    <TabsContent forceMount value="editor" className="m-0 h-full w-full outline-none data-[state=inactive]:hidden p-0 absolute inset-0">
                        <Editor
                            path={`email-${email.id || 'new'}.html`}
                            height="100%"
                            defaultLanguage="html"
                            theme="vs-dark"
                            value={body}
                            onChange={(val) => setBody(val || "")}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                padding: { top: 20 },
                                scrollBeyondLastLine: false,
                                smoothScrolling: true,
                                wordWrap: "on"
                            }}
                        />
                    </TabsContent>

                    <TabsContent forceMount value="preview" className="m-0 h-full w-full outline-none data-[state=inactive]:hidden absolute inset-0 bg-white">
                        <div className="w-full h-full p-4 overflow-y-auto bg-neutral-100 flex items-start justify-center">
                            <iframe
                                srcDoc={previewHtml}
                                className="w-full max-w-3xl min-h-[800px] h-full bg-white shadow-sm border border-neutral-200 rounded-lg"
                                title="Email Preview"
                            />
                        </div>
                    </TabsContent>

                    <TabsContent forceMount value="send" className="m-0 h-full w-full outline-none data-[state=inactive]:hidden absolute inset-0 p-8">
                        <div className="max-w-xl mx-auto h-full flex flex-col justify-center">
                            <div className="bg-neutral-900 border border-white/10 rounded-xl p-8 shadow-2xl space-y-6">
                                <div className="text-center space-y-2">
                                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                                        <SendHorizontal className="w-6 h-6 text-green-500" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white">Send a Test Email</h3>
                                    <p className="text-sm text-neutral-400">
                                        Verify your template looks perfect before integrating it. We'll populate variables with dummy data.
                                    </p>
                                </div>

                                <form onSubmit={handleSendTest} className="space-y-4 pt-4">
                                    <div className="space-y-2">
                                        <Label className="text-gray-300">Recipient Email</Label>
                                        <Input
                                            type="email"
                                            required
                                            value={testEmail}
                                            onChange={(e) => setTestEmail(e.target.value)}
                                            placeholder="you@company.com"
                                            className="bg-black/50 border-white/10 text-white h-11 focus:border-green-500/50 focus:ring-green-500/20"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={sendTestMutation.isPending || !testEmail}
                                        className="w-full h-11 bg-green-600 hover:bg-green-500 text-white transition-all shadow-lg"
                                    >
                                        {sendTestMutation.isPending ? "Sending..." : "Send Test Now"}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
