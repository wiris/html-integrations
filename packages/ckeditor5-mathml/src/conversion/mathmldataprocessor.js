import XmlDataProcessor from '@ckeditor/ckeditor5-engine/src/dataprocessor/xmldataprocessor';

export default class MathmlDataProcessor extends XmlDataProcessor {

	toData( viewFragment ) {
        // Convert view DocumentFragment to DOM DocumentFragment.
        const domFragment = this._domConverter.viewToDom( viewFragment, document );

        let frontier = [ ...domFragment.children ];
        let current;
        while ( current = frontier.pop() ) {

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
        data = data.replace( /[\u00A0-\u9999]/gim, i => '&#' + i.charCodeAt( 0 ) + ';' );

        // Convert input XML data to DOM DocumentFragment.
        const domFragment = this._toDom( data );

        // Convert DOM DocumentFragment to view DocumentFragment.
        return this._domConverter.domToView( domFragment, { keepOriginalCase: true } );

    }

}