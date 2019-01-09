import XmlDataProcessor from '@ckeditor/ckeditor5-engine/src/dataprocessor/xmldataprocessor';
import { BR_FILLER } from '@ckeditor/ckeditor5-engine/src/view/filler';

import CustomDomConverter from './customdomconverter';

export default class MathmlDataProcessor extends XmlDataProcessor {

    /**
     * Creates a new instance of the MathML data processor class.
     *
     * @param {Object} options Configuration options.
     * @param {Array<String>} [options.namespaces=[]] A list of namespaces allowed to use in the XML input.
     */
    constructor( options = {} ) {

        // Call XmlDataProcessor's constructor
        super( options );

        // Use our custom DomConverter to fix "<" and ">" being allowed in attributes
        this._domConverter = new CustomDomConverter( { blockFiller: BR_FILLER } );

    }

}