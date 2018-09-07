/**
 * Class representing a client cache class. This class contains pairs of
 * strings (key/value) which can be retrieved in any moment. Usually used
 * to store AJAX responses for text services like mathml2latex.
 */
export default class TextCache {
    constructor() {
        /**
         * Cache array object. Contains all cache entries.
         * @type {Object[]}
         */
        this.cache = [];
    }

    /**
     * This method populates a key/value pair into the cache property.
     * @param {string} key - The cache key, usually the service string parameter.
     * @param {string} value - The cache value, usually the service response.
     */
    populate(key, value) {
        this.cache[key] = value;
    }

    /**
     * This method retrieves a cache value. Usually called before call a text service.
     * @param {string} key - The cache key, usually the service string parameter.
     * @return {string} value - The cache value, if exists. False otherwise.
     */
    get(key) {
        if (this.cache.hasOwnProperty(key)) {
            return this.cache[key]
        }
        else {
            return false;
        }
    }
}