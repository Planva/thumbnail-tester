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
  isDarkMode: boolean;
  isTestPageDarkMode: boolean;
  addThumbnail: (file: File) => void;
  removeThumbnail: (id: string) => void;
  updateTitle: (id: string, title: string) => void;
  toggleDarkMode: () => void;
  toggleTestPageDarkMode: () => void;
}

export interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}