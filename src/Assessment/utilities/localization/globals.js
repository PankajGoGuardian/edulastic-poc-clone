import { createDictionaries } from './dictionaries';

// globals
const dictionaries = createDictionaries();
const browser_locale = navigator.language || navigator.browserLanguage || ( navigator.languages || [ "en-us" ] )[0];
const locale = browser_locale.toLowerCase();

export { locale, dictionaries };
