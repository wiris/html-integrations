import DomConverter from '@ckeditor/ckeditor5-engine/src/view/domconverter';

export default class CustomDomConverter extends DomConverter {

    /** @inheritdoc */
    viewToDom( viewNode, domDocument, options = {} ) {
        if ( viewNode.is( 'text' ) ) {
            const textData = this._processDataFromViewText( viewNode );

            return domDocument.createTextNode( textData );
        } else {
            if ( this.mapViewToDom( viewNode ) ) {
                return this.mapViewToDom( viewNode );
            }

            let domElement;

            if ( viewNode.is( 'documentFragment' ) ) {
                // Create DOM document fragment.
                domElement = domDocument.createDocumentFragment();

                if ( options.bind ) {
                    this.bindDocumentFragments( domElement, viewNode );
                }
            } else if ( viewNode.is( 'uiElement' ) ) {
                // UIElement has its own render() method (see #799).
                domElement = viewNode.render( domDocument );

                if ( options.bind ) {
                    this.bindElements( domElement, viewNode );
                }

                return domElement;
            } else {
                // Create DOM element.
                domElement = domDocument.createElement( viewNode.name );

                if ( options.bind ) {
                    this.bindElements( domElement, viewNode );
                }

                let attr;

                // Copy element's attributes.
                for ( const key of viewNode.getAttributeKeys() ) {
                    // Alteration to the original DomConverter's viewToDom: convert < and > to entities
                    // If I don't replace these, the browser DOM module leaves them as-is, but if I do convert them, it adds &amp;
                    // < => <
                    // &lt; => &amp;lt;
                    domElement.setAttribute( key, viewNode.getAttribute( key )
                    //    .replace( /</g, '&lt;' )
                    //    .replace( />/g, '&gt;' )
                    );

                }
            }

            if ( options.withChildren || options.withChildren === undefined ) {
                for ( const child of this.viewChildrenToDom( viewNode, domDocument, options ) ) {
                    domElement.appendChild( child );
                }
            }

            return domElement;
        }
    }

}