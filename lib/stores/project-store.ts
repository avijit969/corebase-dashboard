import { create } from 'zustand';
import { createJSONStorage, persist } from "zustand/middleware"
interface ProjectState {
    currentProjectId: string | null;
    currentApiKey: string | null;
    setProjectId: (projectId: string) => void;
    setApiKey: (key: string) => void;
    clearProject: () => void;
}

export const useProjectStore = create<ProjectState>()(
    persist(
        (set) => ({
            currentProjectId: null,
            currentApiKey: null,
            setProjectId: (projectId: string) => set({ currentProjectId: projectId }),
            setApiKey: (key: string) => set({ currentApiKey: key }),
            clearProject: () => set({ currentProjectId: null, currentApiKey: null }),
        }),
        {
            name: "project",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export const useProjectId = () => useProjectStore((state) => state.currentProjectId);
export const useApiKey = () => useProjectStore((state) => state.currentApiKey);
