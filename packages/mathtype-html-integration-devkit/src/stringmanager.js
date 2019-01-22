import translations from '../../lang/strings.json';
/**
 * This class represents a string manager. It's used to load localized strings.
 */
export default class StringManager {

    constructor() {
        throw new Exception('Static class StringManager can not be instantiated.');
    }

    /**
     * Returns the associated value of certain string key. If the associated value
     * doesn't exits returns the original key.
     * @param {string} key - string key
     * @returns {string} correspondent value. If doesn't exists original key.
     */
    static getString(key) {
        if (!(this.language in this.strings)) {
            throw new Exception(`Invalid language {this.language} set in StringManager.`);
        }
        if (key in this.strings[this.language]) {
            return this.strings[this.language][key];
        }
        return key;
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