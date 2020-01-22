import Command from '@ckeditor/ckeditor5-core/src/command';

import CKEditor5Integration from './integration';


/**
 * Command for opening the MathType editor
 */
export class MathTypeCommand extends Command {

    constructor( editor ) {
        super( editor );
    }

    execute( options = {} ) {

        // Check we get a valid integration
        if ( !options.hasOwnProperty( 'integration' ) || !( options.integration instanceof CKEditor5Integration ) ) {
            throw 'Must pass a valid CKEditor5Integration instance as attribute "integration" of options';
        }

        // Open the editor
        this._open( options.integration );

    }

    /**
     * Opens the editor on the given CKEditor 5 integration
     * @param {CKEditor5Integration} integration the integration
     */
    _open( integration ) {
        // It's possible that a custom editor was last used.
        // We need to disable it to avoid wrong behaviors.
        integration.core.getCustomEditors().disable();
        integration.openNewFormulaEditor();
    }

}

/**
 * Command for opening the ChemType editor
 */
export class ChemTypeCommand extends MathTypeCommand {
    _open( integration ) {
        integration.core.getCustomEditors().enable( 'chemistry' );
        integration.openNewFormulaEditor();
    }
}