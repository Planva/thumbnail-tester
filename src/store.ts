import { create } from 'zustand';
import { ThumbnailStore } from './types';
import { translations } from './translations';

type LanguageCode = keyof typeof translations.languageName;

export const useStore = create<ThumbnailStore>((set) => ({
  thumbnails: [],
  currentLanguage: 'en' as LanguageCode,
  
  addThumbnail: (file: File) => set((state) => {
    const newThumbnail = {
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file),
      title: '',
      ctr: Math.random() * 15 + 5,
      brightness: 0,
    };
    
    return {
      thumbnails: [...state.thumbnails, newThumbnail].slice(0, 5),
    };
  }),
  
  removeThumbnail: (id: string) => set((state) => ({
    thumbnails: state.thumbnails.filter((t) => t.id !== id),
  })),
  
  updateTitle: (id: string, title: string) => set((state) => ({
    thumbnails: state.thumbnails.map((t) =>
      t.id === id ? { ...t, title } : t
    ),
  })),
  
  setLanguage: (lang: LanguageCode) => set({ currentLanguage: lang }),
}));