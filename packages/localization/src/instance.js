/* eslint-disable global-require */
import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { reactI18nextModule } from 'react-i18next';

i18n
  .use(XHR)
  .use(LanguageDetector)
  .use(reactI18nextModule)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false, // not needed for react!!
    },
    ns: ['default', 'author', 'student', 'assessment'],
    defaultNS: 'default',
    react: {
      wait: false,
      bindI18n: 'languageChanged loaded',
      bindStore: 'added removed',
      nsMode: 'default',
    },
    resources: {
      en: {
        default: require('./locales/default/en'),
        author: require('./locales/author/en'),
        student: require('./locales/student/en'),
        assessment: require('./locales/assessment/en'),
      },
    },
  });

export default i18n;
