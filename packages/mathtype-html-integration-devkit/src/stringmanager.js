import Listeners from './listeners';
/**
 * This class represents a string manager. It's used to load localized strings.
 */
export default class StringManager {

    constructor() {
        /**
         * key/value object containing the key of each string an it's translation.
         */
        this.strings = {};
        /**
         * Indicates if all strings are loaded.
         */
        this.stringsLoaded = false;
        /**
         * StringManager listeners.
         */
        this.listeners = new Listeners();
    }

    /**
     * Adds a listener object.
     * @param {Object} listener - listener object.
     */
    addListener(listener) {
        this.listeners.add(listener);
    }

    /**
     * Returns the associated value of certain string key. If the associated value
     * doesn't exits returns the original key.
     * @param {string} key - string key
     * @returns {string} correspondent value. If doesn't exists original key.
     */
   getString(key) {
        // Wait 200ms and recall this method if strings aren't load.
        if (!this.stringsLoaded) {
            setTimeout(this.getString.bind(this, key), 100);
            return;
        }
        if (key in this.strings) {
            return this.strings[key];
        }
        return key;
    }

    /**
     * Loads all strings to the manager and unset it for prevent bad usage.
     * @param {Object[]} langStrings - array of key/value pairs of strings.
     */
   loadStrings(langStrings) {
        if (!this.stringsLoaded) {
            this.strings = langStrings;
            // Activate variable to unlock getStrings
            this.stringsLoaded = true;
            // Once the strings are loaded fire 'onLoad' event.
            this.listeners.fire('onLoad', {});
        }
    }
}