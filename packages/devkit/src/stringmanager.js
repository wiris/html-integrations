import translations from '../lang/strings.json';
/**
 * This class represents a string manager. It's used to load localized strings.
 */
export default class StringManager {
  constructor() {
    throw new Error('Static class StringManager can not be instantiated.');
  }

  /**
   * Returns the associated value of certain string key. If the associated value
   * doesn't exits returns the original key.
   * @param {string} key - string key
   * @param {string} lang - DEFAULT = null. Specify the language to translate the string
   * @returns {string} correspondent value. If doesn't exists original key.
   */
  static get(key, lang) {

    // Default language definition
    let {language} = this;

    // If parameter language, use it
    if (lang) {
      language = lang;
    }

    // Cut down on strings. e.g. en_US -> en
    if (language && language.length > 2) {
      language = language.slice(0, 2);
    }

    // Check if we support the language
    if (!this.strings.hasOwnProperty(language)) { // eslint-disable-line no-prototype-builtins
      console.warn(`Unknown language ${language} set in StringManager.`);
      language = 'en';
    }

    // Check if the key is supported in the given language
    if (!this.strings[language].hasOwnProperty(key)) { // eslint-disable-line no-prototype-builtins
      console.warn(`Unknown key ${key} for language ${language} in StringManager.`);
      return key;
    }

    return this.strings[language][key];
  }
}

/**
 * Dictionary of dictionaries:
 * Key: language code
 * Value: Key: id of the string
 *        Value: translation of the string
 */
StringManager.strings = translations;

/**
 * Language of the translations; English by default
 */
StringManager.language = 'en';
