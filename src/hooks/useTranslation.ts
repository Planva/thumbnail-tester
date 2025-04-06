import { useStore } from '../store';
import { translations } from '../translations';

export function useTranslation() {
  const { currentLanguage } = useStore();

  const t = (key: keyof typeof translations) => {
    return translations[key]?.[currentLanguage] || translations[key]?.['en'] || '';
  };

  return { t, currentLanguage };
}