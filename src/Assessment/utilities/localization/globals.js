import { createDictionaries } from './dictionaries';

// globals
const dictionaries = createDictionaries();
const browserLocale = navigator.language || navigator.browserLanguage || (navigator.languages || ['en-us'])[0];
const locale = browserLocale.toLowerCase();

export { locale, dictionaries };
