import HtmlDataProcessor from '@ckeditor/ckeditor5-engine/src/dataprocessor/htmldataprocessor';
import ViewPosition from '@ckeditor/ckeditor5-engine/src/view/position';

import Parser from '../core/src/parser.js';

import MathmlParser from './mathmlparser'

export function downcast( editor ) {
    return ( dispatcher ) => {
        dispatcher.on( 'insert:math-math', ( evt, data, conversionApi ) => {

            const math = data.item;

            // Check whether the change has not been consumed yet and consume it.
            if ( !conversionApi.consumable.consume( math, 'insert' ) ) {
                return;
            }

            const htmlDataProcessor = new HtmlDataProcessor();
            const mathmlParser = new MathmlParser();
            const mathString = mathmlParser
                                .toString( math )
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

                viewElement = conversionApi.writer.createContainerElement( 'img', imgAttributes );

            // If not a <math> element, create a fake empty element so that
            // the model can be binded to it, otherwise it gets angry
            } else {

                viewElement = conversionApi.writer.createContainerElement( '' );

            }

            // Bind the newly created view element to model element so positions will map accordingly in future.
            conversionApi.mapper.bindElements( data.item, viewElement );

            // Translate position in model to position in view.
            const viewPosition = conversionApi.mapper.toViewPosition( data.range.start );

            // Add the newly created view element to the view.
            conversionApi.writer.insert( viewPosition, viewElement );

            // Add a custom mapper callback so any position inside the <math-math>
            // model returns the position right before the corresponding <img>
            conversionApi.mapper.on( 'modelToViewPosition', ( evt, data ) => {

                return; // TODO debugging

                if ( data.isPhantom ) {
                    return;
                }

                const modelPosition = data.modelPosition; 

                let element = modelPosition;
                while ( element.name != 'math-math' && element.parent ) {
                    element = element.parent;
                }

                if ( element.name != 'math-math' ) {
                    // The position we're trying to convert is not inside any <math>
                    return;
                }

                // This position (the one for <math-math>) has been bound above
                const viewElement = data.mapper.toViewElement( element );

                //data.viewPosition = conversionApi.writer.createPositionAt( viewElement, 0 );

                // In case we are entering from the left, <math-math>^...</math-math> -> ^<img/>
                if ( modelPosition.parent.name === 'math-math' && modelPosition.index === 0 ) {
                    data.viewPosition = conversionApi.writer.createPositionAfter( viewElement );

                // Otherwise, <math-math>...^...</math-math> -> <img/>^
                } else {
                    data.viewPosition = conversionApi.writer.createPositionBefore( viewElement );
                }

                evt.stop();

            } );

            // Stop the event propagation.
            evt.stop();

        }, { priority: 'high' } );
    };
}