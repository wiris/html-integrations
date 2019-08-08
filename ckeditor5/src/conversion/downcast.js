import HtmlDataProcessor from '@ckeditor/ckeditor5-engine/src/dataprocessor/htmldataprocessor';

import Parser from '../integration-js/src/parser.js';

import CustomMathmlDataProcessor from './custommathmldataprocessor'

export function downcast( editor ) {
    return ( dispatcher ) => {
        dispatcher.on( 'insert:math-math', ( evt, data, conversionApi ) => {

            const math = data.item;

            // Check whether the change has not been consumed yet and consume it.
            if ( !conversionApi.consumable.consume( math, 'insert' ) ) {
                return;
            }

            // Consume all the children now so they won't get converted later.
            for ( const child of editor.model.createRangeIn( math ).getItems() ) {
                conversionApi.consumable.consume( child, 'insert' );
                for ( const attributeKey of child.getAttributeKeys() ) {
                    conversionApi.consumable.consume( child, 'attribute:' + attributeKey );
                }
            }

            const htmlDataProcessor = new HtmlDataProcessor();
            const mathmlDP = new CustomMathmlDataProcessor();
            const mathString = mathmlDP
                                .toData( math )
                                .replace( /<math-/g , '<' )
                                .replace( /<\/math-/g , '</' );

            let viewElement;

            // If <math> element, parse it and embed it into the model
            if ( mathString.match( /<math[\s|>]/g ) ) {

                // Create <img> element that will be inserted in view at `viewPosition`.
                let imgHtml = Parser.initParse( mathString, editor.config.get( 'language' ) );
                let imgElement = htmlDataProcessor.toView( imgHtml ).getChild( 0 );

                // If the MathML was correct and the service worked, getAttributes
                // should be defined, otherwise use empty <math> element
                if ( !imgElement.getAttributes ) {
                    console.log( 'No attrs!' );
                    imgHtml = Parser.initParse( '<math></math>' );
                    imgElement = htmlDataProcessor.toView( imgHtml ).getChild( 0 );
                }

                let imgAttributes = {};

                for ( const [ key, value ] of imgElement.getAttributes() ) {
                    imgAttributes[ key ] = value;
                }

                viewElement = conversionApi.writer.createEmptyElement( 'img', imgAttributes );

                // Remove filler offset
                viewElement.getFillerOffset = () => null;

                // Bind the newly created view element to model element so positions will map accordingly in future.
                conversionApi.mapper.bindElements( data.item, viewElement );

                // Translate position in model to position in view.
                const viewPosition = conversionApi.mapper.toViewPosition( data.range.start );

                // Add the newly created view element to the view.
                conversionApi.writer.insert( viewPosition, viewElement );

                // Stop the event propagation.
                evt.stop();

            }

        }, { priority: 'high' } );
    };
}