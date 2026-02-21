import { create } from 'zustand';
import { createJSONStorage, persist } from "zustand/middleware"
interface ProjectState {
    currentProjectId: string | null;
    currentApiKey: string | null;
    currentProjectName: string | null;
    setProjectId: (projectId: string) => void;
    setApiKey: (key: string) => void;
    setProjectName: (name: string) => void;
    clearProject: () => void;
}

export const useProjectStore = create<ProjectState>()(
    persist(
        (set) => ({
            currentProjectId: null,
            currentApiKey: null,
            currentProjectName: null,
            setProjectId: (projectId: string) => set({ currentProjectId: projectId }),
            setApiKey: (key: string) => set({ currentApiKey: key }),
            setProjectName: (name: string) => set({ currentProjectName: name }),
            clearProject: () => set({ currentProjectId: null, currentApiKey: null, currentProjectName: null }),
        }),
        {
            name: "project",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export const useProjectId = () => useProjectStore((state) => state.currentProjectId);
export const useApiKey = () => useProjectStore((state) => state.currentApiKey);
export const useProjectName = () => useProjectStore((state) => state.currentProjectName);
