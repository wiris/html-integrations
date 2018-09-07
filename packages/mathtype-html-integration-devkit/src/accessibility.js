import TextCache from './cache';
import Core from './core.src';
import ServiceProvider from './serviceprovider';
import MathML from './mathml.js';

/**
 * Class representing MathType accessible class. This class converts MathML into accessible text.
 */
export default class Accessibility {

    /**
     * Gets the accessible text of a given MathML calling mathml2accessible service.
     * @param {string} mathML - MathML to be converted to accessible text.
     * @param {string} language - language of the accessible text.
     * @param {Object[]} data - object containing parameters to send to textService service.
     * @return {string} Accessibility from mathml string on language string.
     */
    static mathMLToAccessible(mathML, language, data) {
        // Check MathML class. If the class is chemistry,
        // we add chemistry to data to force accessibility service
        // to load chemistry grammar.
        if (MathML.containClass(mathML, 'wrs_chemistry')) {
            data['mode'] = 'chemistry';
        }
        var accessibleText;

        if (Accessibility.cache.get(mathML)) {
            accessibleText = Accessibility.cache.get[mathML];
        }
        else {
            data['service'] = 'mathml2accessible';
            data['lang'] = language;
            var accessibleJsonResponse = JSON.parse(ServiceProvider.getService('service', data));
            if (accessibleJsonResponse.status != 'error') {
                accessibleText = accessibleJsonResponse.result.text;
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
 * Static property. This property contains an instance of TextCache class to manage the JavaScript accessible cache.
 * Each entry of the cache object contains the MathML and it's correspondent accessibility text.
 * @type {TextCache}
 */
Accessibility.cache = new TextCache();