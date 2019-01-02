import XmlDataProcessor from '@ckeditor/ckeditor5-engine/src/dataprocessor/xmldataprocessor';

export default class MathmlParser {
    constructor() {
        // Used to translate math trees to strings and vice versa
        this._xmlDP = new XmlDataProcessor();
    }

    toTree( string ) {
        return this._xmlDP.toView( string );
    }

    toString( tree ) {
        return this._xmlDP.toData( tree );
    }
}