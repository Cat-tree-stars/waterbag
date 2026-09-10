import { create } from 'zustand';

export interface Section {
  subtitle?: string;
  items: string[];
}

export interface Chapter {
  id: string;
  title: string;
  sections: Section[];
}

interface GuideState {
  chapters: Chapter[];
  expandedId: string | null;
  toggleChapter: (id: string) => void;
}

export const useGuideStore = create<GuideState>((set) => ({
  chapters: window.App?.store?.chapters ?? [],
  expandedId: null,
  toggleChapter: (id: string) => 
    set((state) => ({ 
      expandedId: state.expandedId === id ? null : id 
    })),
}));
