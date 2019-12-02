import Command from '@ckeditor/ckeditor5-core/src/command';

import CKEditor5Integration from '../integration';

export default class MathType extends Command {

    constructor( editor ) {
        super( editor );
    }

    execute( options = {} ) {

        if ( !options.hasOwnProperty( 'integration' ) || !( options.integration instanceof CKEditor5Integration ) ) {
            throw 'Must pass a valid CKEditor5Integration instance as attribute "integration" of options';
        }

        const integration = options.integration;
        // Can be that previously custom editor was used. So is needed disable
        // all the editors to avoid wrong behaviours.
        integration.core.getCustomEditors().disable();
        integration.openNewFormulaEditor();

    }

}