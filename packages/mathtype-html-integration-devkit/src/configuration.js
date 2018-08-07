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
            return false;
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

    /**
     * Updates a property with new values. Used to object properties with new values
     * @param {string} key - Key of the property to be updated.
     * @param {Object} propertyValue - Values to update the property.
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
 * @type {Object}
 */
Configuration.properties ={};
