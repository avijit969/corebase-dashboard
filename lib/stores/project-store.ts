import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProjectDetails } from '@/app/platform/projects/[id]/types';

interface ProjectState {
    currentProject: ProjectDetails | null;
    currentApiKey: string | null;
    actions: {
        setProject: (project: ProjectDetails) => void;
        setApiKey: (key: string) => void;
        clearProject: () => void;
    };
}

export const useProjectStore = create<ProjectState>()(
    persist(
        (set) => ({
            currentProject: null,
            currentApiKey: null,
            actions: {
                setProject: (project) => {
                    // Extract API Key from various possible locations
                    const apiKey = project.api_key || project.apiKey || project.meta?.api_key || project.meta?.apiKey || null;
                    set({ currentProject: project, currentApiKey: apiKey });
                },
                setApiKey: (key) => set({ currentApiKey: key }),
                clearProject: () => set({ currentProject: null, currentApiKey: null }),
            },
        }),
        {
            name: 'project-storage',
            partialize: (state) => ({ currentProject: state.currentProject, currentApiKey: state.currentApiKey }),
        }
    )
);

export const useProjectActions = () => useProjectStore((state) => state.actions);
export const useCurrentProject = () => useProjectStore((state) => state.currentProject);
export const useCurrentApiKey = () => useProjectStore((state) => state.currentApiKey);
