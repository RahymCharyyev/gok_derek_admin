import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import tk from '@/locales/tk.json';

const resources = {
  tk: {
    translation: tk,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'tk',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
