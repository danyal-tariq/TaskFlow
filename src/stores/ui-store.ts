import { create } from "zustand";

interface UIState{
    sidebarCollapsed: boolean;
    toggleSidebar: () => void;

    //Modal State
    isCreateIssueOpen: boolean;
    openCreateIssue: () => void;
    closeCreateIssue: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    sidebarCollapsed: false,
    toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    
    isCreateIssueOpen: false,
    openCreateIssue:()=>set((state)=>({isCreateIssueOpen:true})),
    closeCreateIssue:()=>set((state)=>({isCreateIssueOpen:false})),
}))