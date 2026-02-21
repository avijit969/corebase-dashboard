"use client";

import React, { useState } from 'react';
import { Mail, Plus, Trash2, Search, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface EmailSidebarProps {
    emails: any[];
    selectedEmailId: string | null;
    isLoading: boolean;
    onSelect: (id: string) => void;
    onCreate: (name: string) => void;
    onDelete: (id: string) => void;
}

export default function EmailSidebar({
    emails,
    selectedEmailId,
    isLoading,
    onSelect,
    onCreate,
    onDelete
}: EmailSidebarProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [newEmailName, setNewEmailName] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    const filteredEmails = emails.filter(e =>
        e.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEmailName.trim()) return;
        onCreate(newEmailName);
        setNewEmailName("");
        setIsCreating(false);
    };

    return (
        <div className="flex flex-col h-full bg-neutral-950/80 border-r border-white/5 pt-4">
            <div className="px-4 mb-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Templates</h3>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsCreating(!isCreating)}
                        className="h-8 w-8 p-0 hover:bg-white/10 text-primary-400 hover:text-white"
                    >
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>

                <div className="relative">
                    <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                    <Input
                        placeholder="Search templates..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-9 pl-9 bg-black/40 border-white/10 text-sm focus-visible:ring-primary-500/50"
                    />
                </div>
            </div>

            {isCreating && (
                <div className="px-4 mb-4 animate-in slide-in-from-top-2 duration-200">
                    <form onSubmit={handleCreateSubmit} className="flex gap-2">
                        <Input
                            autoFocus
                            placeholder="Template Name"
                            value={newEmailName}
                            onChange={(e) => setNewEmailName(e.target.value)}
                            className="h-9 bg-black/50 border-white/20 text-white"
                        />
                        <Button type="submit" size="sm" className="h-9 bg-primary-600 hover:bg-primary-500 text-white px-3">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </form>
                </div>
            )}

            <ScrollArea className="flex-1 px-3">
                {isLoading ? (
                    <div className="space-y-2 p-1">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-14 bg-white/5 rounded-lg border border-white/5 animate-pulse" />
                        ))}
                    </div>
                ) : filteredEmails.length === 0 ? (
                    <div className="text-center py-10 px-4 text-neutral-500 text-sm">
                        {searchTerm ? "No matches found" : "No templates yet. Create your first one!"}
                    </div>
                ) : (
                    <div className="space-y-2 pb-6">
                        {filteredEmails.map((email) => (
                            <div
                                key={email.id}
                                className={`group relative flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${selectedEmailId === email.id
                                        ? 'bg-primary-500/10 border-primary-500/30 text-white'
                                        : 'bg-white/5 border-white/5 text-neutral-300 hover:bg-white/10 hover:border-white/10'
                                    }`}
                                onClick={() => onSelect(email.id)}
                            >
                                <div className="flex items-start gap-3 w-content overflow-hidden">
                                    <Mail className={`w-4 h-4 mt-0.5 shrink-0 ${selectedEmailId === email.id ? 'text-primary-400' : 'text-neutral-500'}`} />
                                    <div className="flex flex-col truncate pr-2">
                                        <span className="text-sm font-medium truncate">{email.name}</span>
                                        <span className="text-xs opacity-60 truncate">{email.subject || "No Subject"}</span>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(email.id);
                                    }}
                                    className={`opacity-0 group-hover:opacity-100 h-8 w-8 shrink-0 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-opacity ${selectedEmailId === email.id ? 'bg-primary-500/0 text-red-300' : ''}`}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    );
}
