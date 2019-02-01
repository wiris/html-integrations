import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import { downcastElementToElement } from '@ckeditor/ckeditor5-engine/src/conversion/downcast-converters';
import { upcastElementToElement } from '@ckeditor/ckeditor5-engine/src/conversion/upcast-converters';

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

        // If the MathType plugin is loaded, we don't create editingDowncasts
        let editingDowncast = true;//!editor.config.get( 'plugins' ).some( plugin => plugin.name == 'Wiris' );

        /*** Extend model ***/
        
        // For every element of MathML...
        for ( const { realName, modelName, definition, needsCasting } of mathmlSchema ) {

            // Register the element with its definition
            schema.register( modelName, definition );

            // Add casting?
            if ( needsCasting ) {

                if ( editingDowncast ) {

                    editor.conversion.elementToElement( {
                        model: modelName,
                        view: realName
                    } );

                } else {

                    editor.conversion.for( 'upcast' ).add( upcastElementToElement( {
                        model: modelName,
                        view: realName
                    } ) );

                    editor.conversion.for( 'dataDowncast' ).add( downcastElementToElement( {
                        model: modelName,
                        view: realName
                    } ) );

                }

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

        // Data processor to output proper MathML
        editor.data.processor = new MathmlDataProcessor();

    }

}