import XmlDataProcessor from '@ckeditor/ckeditor5-engine/src/dataprocessor/xmldataprocessor';
import { BR_FILLER } from '@ckeditor/ckeditor5-engine/src/view/filler';
import DomConverter from '@ckeditor/ckeditor5-engine/src/view/domconverter';

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

        // Use BR_FILLER instead of NSBP_FILLER to identify <br/> and remove them when retrieving data
        this._domConverter = new DomConverter( { blockFiller: BR_FILLER } );

    }

	toData( viewFragment ) {
        // Convert view DocumentFragment to DOM DocumentFragment.
        const domFragment = this._domConverter.viewToDom( viewFragment, document );

        let frontier = [ ...domFragment.children ];
        let current;
        while ( current = frontier.pop() ) {

            // Removes any block fillers CKEditor might've added
            if ( current.nodeName.toLowerCase() == 'br' && current.hasAttribute( 'data-cke-filler' ) && current.closest( 'math' ) ) {
                current.parentNode.removeChild( current );
            }

            // Replaces < with &lt;, > with &gt;, & with &amp; in attributes
            for ( let attr of current.attributes ) {
                current.setAttribute( attr.name, attr.value
                    .replace( /&/g, '&amp;' )
                    .replace( /</g, '&lt;' )
                    .replace( />/g, '&gt;' )
                );
            }

            frontier.push( ...current.children );

        }

        // Convert DOM DocumentFragment to XML output.
        // There is no need to use dedicated for XML serializing method because BasicHtmlWriter works well in this case.
        //return this._htmlWriter.getHtml( domFragment );
        const doc = document.implementation.createHTMLDocument( '' );
        const container = doc.createElement( 'div' );
        container.appendChild( domFragment );

        return container.innerHTML.replace( /&amp;/g, '&' );
    }

}