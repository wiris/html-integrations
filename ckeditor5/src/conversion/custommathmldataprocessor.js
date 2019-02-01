import MathmlDataProcessor from './mathmldataprocessor';

import MathML from '../../core/src/mathml.js';

export default class CustomMathmlDataProcessor extends MathmlDataProcessor {

    toData( viewFragment ) {

        // Get the processed html from MathmlDataProcessor to remove hand traces
        let html = super.toData( viewFragment );

        const mathPattern = /<math.*?<\/math.*?>/g;

        // HTML broken down into pieces like so:
        let htmlPieces = html.split( mathPattern ); // 'abc', 'def', 'ghi'
        let mathmlPieces = html.match( mathPattern ) || []; // '<math>123</math>', '<math>456</math>'

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
            // Use reduce + concat instead of flat because Edge doesn't support flat
            .reduce( ( acc, cur ) => acc.concat( cur ), [] ) // [ 'abc', '<math>123</math>', 'def', '<math>456</math>', 'ghi', undefined ]
            .filter( piece => typeof piece !== 'undefined' ) // [ 'abc', '<math>123</math>', 'def', '<math>456</math>', 'ghi' ]
            .reduce( ( acc, cur ) => acc + cur ); // 'abc<math>123</math>def<math>456</math>ghi'

    }

}