"use client";

import React, { useState, useEffect } from 'react';
import { useProjectStore } from '@/lib/stores/project-store';
import { BucketSidebar } from './_components/BucketSidebar';
import { FileBrowser } from './_components/FileBrowser';

export default function StoragePage({ params }: { params: { id: string } }) {
    const { currentApiKey } = useProjectStore();
    const [selectedBucket, setSelectedBucket] = useState<string | null>(null);

    const apiKey = currentApiKey;

    if (!apiKey) {
        return <div className="p-8 text-neutral-400">Loading project context...</div>;
    }

    return (
        <div className="flex h-[calc(100vh-4rem)] bg-neutral-950 text-white overflow-hidden">
            {/* Sidebar for Buckets */}
            <BucketSidebar
                apiKey={apiKey}
                selectedBucket={selectedBucket}
                onSelectBucket={setSelectedBucket}
            />

            {/* Main Content for Files */}
            <div className="flex-1 flex flex-col min-w-0 bg-neutral-900/50">
                <FileBrowser
                    apiKey={apiKey}
                    bucketName={selectedBucket}
                    onRefreshNeeded={() => {
                        // Optional: Refresh any global stats if needed
                    }}
                />
            </div>
        </div>
    );
}
