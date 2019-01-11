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
            if ( current.is( 'img' ) && current.hasClass( 'Wirisformula' ) && current.childCount > 0 ) {

                // Using this avoids having to insert a new img,
                // which is good because Position can't seem to properly find the correct position
                viewWriter.remove( viewWriter.createRangeIn( current ) );

            } else if ( current.getChildren ) {
                frontier.push( ...current.getChildren() );
            }
        }

        return hasChanged;

    }
}