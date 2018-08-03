/**
 * This class represents the JavaScript configuration properties.
 * Usually used to manage configuration properties generated in the backend.
 */
export default class Configuration {
    /**
     * Appends a properties object to Configuration.properties.
     * @param {Object} configurationObject -
     */
    static addConfiguration(configurationObject) {
        Object.assign(Configuration.properties, configurationObject);
    }

    /**
     * Returns the value of one property.
     * @param {string} key - property key
     * @returns {string} property value
     */
    static get(key) {
        //TODO: '_wrs_conf' should be removed from the backend service.
        if (!Configuration.properties.hasOwnProperty('_wrs_conf_' + key)) {
            throw new Error('Configuration key ' + key + ' not found.');
        }
        return Configuration.properties['_wrs_conf_' + key];
    }

    /**
     * Sets a new property.
     * @param {string} key - property key.
     * @param {object} value - property value.
     */
    static set(key, value) {
        Configuration.properties[key] = value;
    }
}


/**
 * Static properties object. Stores all configuration properties.
 * @type {Object}
 */
Configuration.properties ={};
