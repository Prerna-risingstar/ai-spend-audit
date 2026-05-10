import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ToolEntry = {
    id: string;
    tool: string;
    plan: string;
    monthlySpend: string;
    seats: string;
};

type FormState = {
    toolEntries: ToolEntry[];
    teamSize: string;
    useCase: string;
    setToolEntries: (entries: ToolEntry[]) => void;
    setTeamSize: (size: string) => void;
    setUseCase: (useCase: string) => void;
    addTool: () => void;
    removeTool: (id: string) => void;
    updateTool: (id: string, field: keyof ToolEntry, value: string) => void;
};

export const useFormStore = create<FormState>()(
    persist(
        (set) => ({
            toolEntries: [
                { id: '1', tool: 'ChatGPT', plan: 'Plus', monthlySpend: '', seats: '' }
            ],
            teamSize: '',
            useCase: 'Coding',
            
            setToolEntries: (entries) => set({ toolEntries: entries }),
            setTeamSize: (size) => set({ teamSize: size }),
            setUseCase: (useCase) => set({ useCase }),
            
            addTool: () => set((state) => ({
                toolEntries: [
                    ...state.toolEntries,
                    { id: Math.random().toString(36).substring(7), tool: 'ChatGPT', plan: 'Plus', monthlySpend: '', seats: '' }
                ]
            })),
            
            removeTool: (id) => set((state) => ({
                toolEntries: state.toolEntries.filter((t) => t.id !== id)
            })),
            
            updateTool: (id, field, value) => set((state) => ({
                toolEntries: state.toolEntries.map((t) => 
                    t.id === id ? { ...t, [field]: value } : t
                )
            }))
        }),
        {
            name: 'spend-audit-storage',
        }
    )
);
