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

        // Cleaned HTML containing MathML
        // 'abc<math>123</math>def<math>456</math>ghi'
        return container.innerHTML.replace( /&amp;/g, '&' );

    }

    toView( data ) {

        // Convert HTML entities (e.g. &nbsp;) to character entities (e.g. &#160;)
        let domParser = new DOMParser();
        data = data.replace( /&.*?;/g, i => {
            let out = domParser.parseFromString( i, 'text/html' ).body.childNodes[0].data;
            return out == '<' || out == '>' ? i : out;
        } );

        // Convert UTF-8 characters to entities
        data = data.replace( /[\u00A0-\u9999]/gm, i => '&#' + i.charCodeAt( 0 ) + ';' );

        // We need to find and close the dangling open tags like <img> that HTML5 allows but XML does not.
        data = data.replace( /<(?:area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)[\s\S]*?>/g, match => match.replace( /([^\/])>/, '$1/>' ) );

        // Convert input XML data to DOM DocumentFragment.
        const domFragment = this._toDom( data );

        // Convert DOM DocumentFragment to view DocumentFragment.
        return this._domConverter.domToView( domFragment, { keepOriginalCase: true } );

    }

}