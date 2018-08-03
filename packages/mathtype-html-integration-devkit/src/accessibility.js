import TextCache from './cache.js';
import Core from './core.src.js';
import Util from './util.js';
import ServiceProvider from './serviceprovider.js';

/**
 * Class representing MathType accessible class. This class converts MathML into accessible text.
 */
export default class Accessibility {
    /**
     * Gets the accessible text of a given MathML calling mathml2accesible service.
     * @param {string} mathML MathML to get the accesibility.
     * @param {string} language Language of the accesibility.
     * @return {string} Accessibility from mathml string on language string.
     * @ignore
     */
    static mathMLToAccessible(mathML, language, data) {
        var accessibleText;

        if (Accessibility.cache.get(mathML)) {
            accessibleText = Accessibility.cache.get[mathML];
        }
        else {
            data['service'] = 'mathml2accessible';
            data['lang'] = language;
            var accesibleJsonResponse = JSON.parse(ServiceProvider.getService('service', data));
            if (accesibleJsonResponse.status != 'error') {
                accessibleText = accesibleJsonResponse.result.text;
                Accessibility.cache.populate(mathML, accessibleText);
            }
            else {
                accessibleText = Core.getStringManager().getString('error_convert_accessibility');
            }
        }

        return accessibleText;
    }

}

/**
 * Static property. This property contains a instance of Cache class in order to
 * manage the JavaScript accesible cache. Each entry of the cache object contains the
 * MathML and it's correspondent accessibility text.
 * @type {Cache}
 */
Accessibility.cache = new TextCache();