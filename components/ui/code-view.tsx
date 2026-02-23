"use client";

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeViewProps {
    code: string;
    language?: string;
    title?: string;
}

export function CodeView({ code, language = 'typescript', title }: CodeViewProps) {
    const [copied, setCopied] = useState(false);

    const onCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group rounded-xl overflow-hidden bg-[#1e1e1e] border border-white/10 my-3 shadow-lg">
            <div className="flex items-center justify-between px-4 py-2 bg-neutral-900 border-b border-white/5">
                <span className="text-xs text-neutral-400 font-mono">
                    {title || language}
                </span>
                <button
                    onClick={onCopy}
                    className="text-neutral-500 hover:text-white transition-colors p-1.5 rounded-md hover:bg-white/10 focus:outline-none flex items-center gap-1.5"
                    title="Copy code"
                >
                    {copied ? (
                        <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-[10px] text-emerald-500 font-medium">Copied</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">Copy</span>
                        </>
                    )}
                </button>
            </div>
            <div className="text-[13px] relative max-h-[400px] overflow-auto custom-scrollbar">
                <SyntaxHighlighter
                    language={language}
                    style={vscDarkPlus}
                    customStyle={{
                        margin: 0,
                        padding: '1rem',
                        background: 'transparent',
                        fontSize: '13px',
                        lineHeight: '1.5',
                    }}
                    wrapLines={true}
                >
                    {code}
                </SyntaxHighlighter>
            </div>
        </div>
    );
}
