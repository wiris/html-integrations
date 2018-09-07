/**
 * This class represents the JavaScript configuration properties.
 * Usually used to retrieve configuration properties generated in the backend
 * into the frontend.
 */
export default class Configuration {
    /**
     * Appends a properties object to Configuration.properties.
     * @param {Object} properties - properties to append to current properties..
     */
    static addConfiguration(properties) {
        Object.assign(Configuration.properties, properties);
    }

    /**
     * Returns the value of one property key.
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
     * Updates a property object with new values.
     * @param {string} key - key of the property to be updated.
     * @param {Object} propertyValue - values to update the property.
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
