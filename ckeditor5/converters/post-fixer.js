import Position from '@ckeditor/ckeditor5-engine/src/view/position';

export function postFixer( editor ) {

    // This function walks throught the entire view tree looking for Wiris <img>
    // elements and replaces them with brand new ones so as to remove hanging
    // math tags that result from the downcast conversion.
    return viewWriter => {

        /* Range.createIn( editor.editing.view.document.getRoot() ) raises
        view-position-before-root error. We use manual iteration instead. */

        let hasChanged = false;
        const frontier = [ editor.editing.view.document.getRoot() ];
        let current;

        while ( current = frontier.pop() ) {
            if ( current.is( 'img' ) && current.hasClass( 'Wirisformula' ) ) {

                // The <img> we want removed.
                // This is just an alias for "current" to make the code readable
                const viewElementOld = current;

                // Copy properties from old <img> to new <img>
                const properties = {};
                for ( const [ key, value ] of viewElementOld.getAttributes() ) {
                    properties[ key ] = value;
                }

                // Make the new <img> to be inserted
                const viewElementNew = viewWriter.createEmptyElement( 'img', properties );

                // Where the old <img> is right now
                const position = Position._createBefore( viewElementOld );

                // Get the model element corresponding to the old <img>
                const modelElement = editor.editing.mapper.toModelElement( viewElementOld );

                // Remove the old <img> ...
                viewWriter.remove( viewElementOld );

                // ... and add the new one
                viewWriter.insert( position, viewElementNew );

                // Bind the new <img> to the old one's corresponding hanging model element
                editor.editing.mapper.bindElements( modelElement, viewElementNew );

            } else if ( current.getChildren ) {
                frontier.push( ...current.getChildren() );
            }
        }

        return hasChanged;

    }
}