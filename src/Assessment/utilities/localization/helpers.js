import { locale, dictionaries } from './globals';
/* eslint import/prefer-default-export: 0 */

/**
 * getObjProp
 * desc: recursive function to access nested objects
 * @param  {object} obj    Data object
 * @param  {array}  props  Object prop(s)
 * @return {*}             Property value
 */
function getObjProp(obj, props) {
  // loop over props
  for (let i = 0, l = props.length; i < l; i++) {
    // if prop value is an object, dig deeper
    if (typeof obj[props[i]] === 'object') {
      return getObjProp(obj[props[i]], props.slice(i + 1));
    }

    return obj[props[i]];
  }
}

/**
 * formatString
 * desc: utility function for string interpolation
 * note: needed because JSON doesn't support ES6 template syntax
 * @param  {string} text  translation text
 * @param  {object} data  data object (optional)
 * @return {string}       interpolated text || regEx match
 */
const formatString = (text, data) => {
  // regEx matches ES6 template syntax and submatches inner text
  // e.g. match = ${name}, submatch = name
  const regEx = /\${([A-Za-z0-9]+)}/g;

  return text.replace(regEx, (match, submatch) => {
    let newText;

    // if data and props exist, then try to access values
    // note: submatch.split checks for nested objects (e.g. address.city)
    const props = submatch.split('.');
    if (data && props.length) {
      newText = getObjProp(data, props);
    }

    // normalize data as string
    // note: this allows specified falsey values to be returned below and used by presentation layer
    if (newText === 0 || newText === false) {
      newText = String(newText);
    }

    return newText || match;
  });
};

/**
 * translate
 * desc: utility function to access translated string
 * note: uses the global dictionaries object
 * @param  {string} key   translation key
 * @param  {object} data  data object (optional)
 * @return {string}       translated string || error
 */
export const translate = (key, data = null) => {
  // TODO: get from locale
  const dictionary = dictionaries['en-us'] || {};
  // const dictionary = dictionaries[locale] || {};

  // if dictionary key exists, return translated text
  if (dictionary && dictionary[key]) {
    return formatString(dictionary[key], data);
  }

  return `[TRANSLATE ERR]: cannot find "${key}" key in "${locale}" locale`;
};
