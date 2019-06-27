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
        data = closeTags( data );

        // Convert input XML data to DOM DocumentFragment.
        const domFragment = this._toDom( data );

        // Convert DOM DocumentFragment to view DocumentFragment.
        return this._domConverter.domToView( domFragment, { keepOriginalCase: true } );

    }

}

/**
 * Closes the dangling open tags
 * @param {string} markup string containing the markup to be processed
 * @returns {string} the string with the dangling open tags actually closed
 */
function closeTags( markup ) {
    // markup = '<a>xxx<b>yyy<c>zzz</b>www</a>ttt'
    // [\s\S] acts like (.|\n), as there is no multiline matching flag in js
    const tags = markup.match( /<[\s\S]*?>/g ); // [ '<a>', '<b>', '<c>', '</b>', '</a>' ]
    const text = markup.split( /<[\s\S]*?>/g ); // [ '', 'xxx', 'yyy', 'zzz', 'www', 'ttt' ]

    // Now, we're going to close the dangling open tags.
    // First, for each tag we generate a triple [index : number, name : string, type : number]
    // type: 0 = open, 1 = close, 2 = self-closing
    let data = tags.map( ( tag, index ) => [
        index,
        tag.match( /[\w-]+/ )[ 0 ],
        /\/>/.test( tag )
            ? 2 // self-closing
            : /<\//.test( tag )
            ? 1 // close
            : 0 // open
    ] );

    data = data.filter( ( [ , , type ] ) => type != 2 ); // Remove self-closed tags as they don't affect others

    for ( const index of findDangling( data ) ) {
        tags[ index ] = tags[ index ].replace( '>', '/>' );
    }

    return text
        .map( ( piece, index ) => [ piece, tags[ index ] ] ) // [ [ '', '<a>' ], [ 'xxx', '<b>' ], [ 'yyy', '<c/>' ], [ 'zzz', '</b>' ], [ 'www', '</a>' ], [ 'ttt', undefined ] ]
        // Use reduce + concat instead of flat because Edge doesn't support flat
        .reduce( ( acc, cur ) => acc.concat( cur ), [] ) // [ '', '<a>', 'xxx', '<b>', 'yyy', '<c/>', 'zzz', '</b>', 'www', '</a>', 'ttt', undefined ]
        .filter( piece => typeof piece !== 'undefined' ) // [ '', '<a>', 'xxx', '<b>', 'yyy', '<c/>', 'zzz', '</b>', 'www', '</a>', 'ttt' ]
        .reduce( ( acc, cur ) => acc + cur ); // '<a>xxx<b>yyy<c/>zzz</b>www</a>ttt'
}

/**
 * Finds the dangling open tags in the indicated subarray of data
 * @param {string} data array consisting of [index, name, type] tuples
 * @param {number} start First index of the subarray
 * @param {number} end Index after the last element of the subarray
 * @param {number[]} dangling Indexes of the tags to fix; leave empty in first call
 */
function findDangling( data, start = 0, end = data.length, dangling = [] ) {
    let i = start;
    const endIndex = end != data.length ? data[ end ][ 0 ] : data[ data.length - 1 ][ 0 ] + 1;
    while ( i < end ) {
        let [ openIndex, openName, ] = data[ i ];
        if ( data[ i ][ 2 ] == 0 ) { // open tag, as it should be if the HTML is properly formed
            const j = data.findIndex( ( [ closeIndex, closeName, closeType ] ) => (
                openIndex < closeIndex &&
                closeIndex < endIndex &&
                closeName == openName &&
                closeType == 1
            ) ) || [];
            if ( j == -1 ) { // No closing tag, fix
                dangling.push( openIndex );
                i++;
            } else {
                dangling = findDangling( data, i + 1, j, dangling );
                i = j + 1;
            }
        }
    }
    return dangling;
}