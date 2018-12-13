/**
 * This class represents the configuration class.
 * Usually used to retrieve configuration properties generated in the backend into the frontend.
 */
export default class Configuration {
    /**
     * Adds a properties object to {@link Configuration.properties}.
     * @param {Object} properties - properties to append to current properties.
     */
    static addConfiguration(properties) {
        Object.assign(Configuration.properties, properties);
    }

    /**
    * The configuration properties object.
    * @private
    * @type {Object}
    */
    static get properties() {
        return Configuration._properties;
    }

    /**
     * @ignore
     */
    static set properties(value) {
        Configuration._properties = value;
    }

    /**
     * Returns the value of a property key.
     * @param {String} key - Property key
     * @returns {String} Property value
     */
    static get(key) {
        //TODO: '_wrs_conf' should be removed from the backend service.
        if (!Configuration.properties.hasOwnProperty('_wrs_conf_' + key)) {
            return false;
        }
        return Configuration.properties['_wrs_conf_' + key];
    }

    /**
     * Adds a new property to Configuration class.
     * @param {String} key - Property key.
     * @param {Object} value - Property value.
     */
    static set(key, value) {
        Configuration.properties[key] = value;
    }

    /**
     * Updates a property object value with new values.
     * @param {String} key - The property key to be updated.
     * @param {Object} propertyValue - Object containing the new values.
     */
    static update(key, propertyValue) {
        if (!Configuration.get(key)) {
            Configuration.set(key, propertyValue);
        } else {
            var updateProperty = Object.assign(Configuration.get(key), propertyValue);
            Configuration.set(key, updateProperty);
        }
    }
}

/**
 * Static properties object. Stores all configuration properties.
 * Needed to attribute accessors.
 * @private
 * @type {Object}
 */
Configuration._properties = {};
