import XmlDataProcessor from '@ckeditor/ckeditor5-engine/src/dataprocessor/xmldataprocessor';
import { BR_FILLER } from '@ckeditor/ckeditor5-engine/src/view/filler';
import DomConverter from '@ckeditor/ckeditor5-engine/src/view/domconverter';

import MathML from '../core/src/mathml.js';

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

        // Cleaned HTML containing MathML
        // 'abc<math>123</math>def<math>456</math>ghi'
        let html = container.innerHTML.replace( /&amp;/g, '&' );

        const mathPattern = /<math.*?<\/math.*?>/g;

        // HTML broken down into pieces like so:
        let htmlPieces = html.split( mathPattern ); // 'abc', 'def', 'ghi'
        let mathmlPieces = html.match( mathPattern ); // '<math>123</math>', '<math>456</math>'

        // Variables used in the loop
        let open, inner, close; // '<math>', '123', '</math>'
        let innerStartIndex, closeStartIndex; // Index of inner and close

        // Iterate only through the <math>...</math> blocks
        for ( let i = 0; i < mathmlPieces.length; i++ ) {

            innerStartIndex = mathmlPieces[ i ].indexOf( '>' ) + 1;
            closeStartIndex = mathmlPieces[ i ].indexOf( '</math', innerStartIndex );

            open = mathmlPieces[ i ].substring( 0, innerStartIndex );
            inner = mathmlPieces[ i ].substring( innerStartIndex, closeStartIndex );
            close = mathmlPieces[ i ].substring( closeStartIndex );

            // Remove the annotation tags introduced by "Hand"
            inner = MathML.removeAnnotation( inner, 'application/json' );

            mathmlPieces[ i ] = open + inner + close;

        }

        // Return joined pieces
        return htmlPieces // [ 'abc', 'def', 'ghi' ]
            .map( ( piece, index ) => [ piece, mathmlPieces[ index ] ] ) // [ [ 'abc', '<math>123</math>' ], [ 'def', '<math>456</math>' ], [ 'ghi', undefined ] ]
            .flat() // [ 'abc', '<math>123</math>', 'def', '<math>456</math>', 'ghi', undefined ]
            .filter( piece => typeof piece !== 'undefined' ) // [ 'abc', '<math>123</math>', 'def', '<math>456</math>', 'ghi' ]
            .reduce( ( acc, cur ) => acc + cur ); // 'abc<math>123</math>def<math>456</math>ghi'

    }

}