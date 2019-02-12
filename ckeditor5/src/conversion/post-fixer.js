export function postFixer( editor ) {

    // This function walks through the entire view tree looking for Wiris <img>
    // elements and replaces them with brand new ones so as to remove hanging
    // math tags that result from the downcast conversion.
    return viewWriter => {

        let hasChanged = false;

        const range = viewWriter.createRangeIn( editor.editing.view.document.getRoot() );

        // Get all items from the range and cache them so removing them won’t cause problems.
        const items = Array.from( range.getItems() );

        for ( const current of items ) {
            if ( current.is( 'img' ) && current.hasClass( 'Wirisformula' ) && current.childCount > 0 ) {

                // Using this avoids having to insert a new img,
                // which is good because Position can't seem to properly find the correct position
                // Set hasChanged to true if viewWriter has removed nodes
                hasChanged = !!viewWriter.remove( viewWriter.createRangeIn( current ) );

             }
        }

        return hasChanged;

    }
}