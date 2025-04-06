export interface Thumbnail {
  id: string;
  file: File;
  preview: string;
  title: string;
  ctr: number;
  brightness: number;
}

export interface ThumbnailStore {
  thumbnails: Thumbnail[];
  currentLanguage: keyof typeof import('./translations').translations.languageName;
  addThumbnail: (file: File) => void;
  removeThumbnail: (id: string) => void;
  updateTitle: (id: string, title: string) => void;
  setLanguage: (lang: keyof typeof import('./translations').translations.languageName) => void;
}

export interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}