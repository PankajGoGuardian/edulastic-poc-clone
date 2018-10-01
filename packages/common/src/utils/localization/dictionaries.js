import settings from './locale-settings';

/**
 * createDictionaries
 * desc: builds a dictionary for every supported locale
 * notes: uses app-settings.json as the source of truth
 * @return {object}  dictionaries
 */
// eslint-disable-next-line
export function createDictionaries() {
  const dictionaries = {};

  // check if supported locales exist
  if (settings && settings.SUPPORTED) {
    // iterate over supported locales
    settings.SUPPORTED.forEach((locale) => {
      const localeSplit = locale.split('-');

      // determine locale files
      const languageFile = localeSplit[0];
      const countryFile = `${localeSplit[0]}-${localeSplit[1]}`;
      const dialectFile = localeSplit.length === 3 ? locale : null;

      // require locale files
      let language = {};
      let country = {};
      let dialect = {};
      try {
        // eslint-disable-next-line
        language = require(`../../locales/${languageFile}.json`);
      } catch (err) {
        console.error(err);
      }
      try {
        // eslint-disable-next-line
        country = require(`../../locales/${countryFile}.json`);
      } catch (err) {
        console.error(err);
      }
      if (dialectFile) {
        try {
          // eslint-disable-next-line
          dialect = require(`../../locales/${dialectFile}.json`);
        } catch (err) {
          console.error(err);
        }
      }

      // create locale dictionary
      dictionaries[locale] = Object.assign({}, language, country, dialect);
    });
  }

  return dictionaries;
}
