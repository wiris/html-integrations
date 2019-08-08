import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import { schema as mathmlSchema, attributes as mathmlAttributes } from './mathmlschema';
import MathmlDataProcessor from './conversion/mathmldataprocessor';

export default class MathML extends Plugin {

    static get requires() {
        return [];
    }

    static get pluginName() {
        return 'MathML';
    }

    init() {

        const editor = this.editor;
        const schema = editor.model.schema;

        /*** Extend model ***/

        // For every element of MathML...
        for ( const { realName, modelName, definition, needsCasting } of mathmlSchema ) {

            // Register the element with its definition
            schema.register( modelName, definition );

            // Add casting?
            if ( needsCasting ) {

                editor.conversion.elementToElement( {
                    model: modelName,
                    view: realName
                } );

                /* Add hardcoded converters for href attribute only, as a
                preventive measure so as to avoid a similar behavior to PLUGINS-1228*/
                editor.conversion.attributeToAttribute( {
                    model: {
                        name: modelName,
                        key: 'href',
                    },
                    view: {
                        name: realName,
                        key: 'href',
                    }
                } );

            }

        }

        // Apparently it is needed to register every attribute to be converted.
        // FIXME this adds global converters for attributes on *any* element.
        // Ideally, these should work on a per-element basis, but adding all
        // MathML attributes to all MathML elements is too costly.
        for ( const attribute of mathmlAttributes ) {
            editor.conversion.attributeToAttribute( {
                model: attribute,
                view: attribute,
            } );
        }

        // Allow text in some elements
        schema.extend( '$text', {
            allowIn: mathmlSchema
                        .filter( element => element.allowsText )
                        .map( element => element.modelName )
        } );

        // Disallow text attributes (bold, italics, etc.) on text nodes
        schema.addAttributeCheck( context => {
            const contextArray = Array.from( context.getNames() );
            if ( contextArray[ contextArray.length - 1 ] == '$text' && contextArray.some( name => name.startsWith( 'math-' ) ) ) {
                return false;
            }
        } );

        // Data processor to output proper MathML
        editor.data.processor = new MathmlDataProcessor();

    }

}
