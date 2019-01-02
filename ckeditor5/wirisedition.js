import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import ClickObserver from '@ckeditor/ckeditor5-engine/src/view/observer/clickobserver';
import { keyCodes } from '@ckeditor/ckeditor5-utils/src/keyboard';

import { integrationModelProperties } from './core/src/integrationmodel';

import MathML from './mathml';

import { downcast } from './converters/downcast';
import { postFixer } from './converters/post-fixer';
import OpenFormulaEditorCommand from './openformulaeditorcommand';
import OpenFormulaEditorChemistryCommand from './openformulaeditorchemistrycommand';
import CKEditor5Integration from './integration';

import mathIcon from './icons/formula.svg';
import chemIcon from './icons/chem.svg';

export default class WirisEdition extends Plugin {

    static get requires() {
        return [ MathML ];
    }

    static get pluginName() {
        return 'WirisEdition';
    }

    init() {
        
        const editor = this.editor;
        
        // Downcaster that converts MathML to Wirisformula <img>
        editor.conversion.for( 'editingDowncast' ).add( downcast );

        // Post-fix to remove the contents of <img> element
        // (which after downcast should be equal to the tree under <math>)
        editor.editing.view.document.registerPostFixer( postFixer( editor ) );

        // Add integration properties
        /**
         * Integration model constructor attributes.
         * @type {integrationModelProperties}
         */
        const integrationProperties = {};
        integrationProperties.editorObject = editor;
        integrationProperties.configurationService = 'https://www.wiris.net/demo/plugins/app/configurationjs'; //'integration/configurationjs.php';
        integrationProperties.target = editor.sourceElement;
        integrationProperties.scriptName = 'bundle.js';
        integrationProperties.managesLanguage = true;
        // etc

        // There are platforms like Drupal that initialize CKEditor but they hide or remove the container element.
        // To avoid a wrong behaviour, this integration only starts if the workspace container exists.
        let integration;
        if ( integrationProperties.target ) {
            // Instance of the integration associated to this editor instance
            integration = new CKEditor5Integration( integrationProperties );
            integration.init();
            integration.listeners.fire( 'onTargetReady', {} );

            integration.checkElement();

            this.listenTo( editor.editing.view.document, 'click', ( evt, data ) => {
                // Is double click
                if ( data.domEvent.detail == 2 ) {
                    integration.doubleClickHandler( data.domTarget, data.domEvent );
                    evt.stop();
                }
            }, { priority: 'highest' } );

        }

        // Add command to open the formula editor
        editor.commands.add( 'ckeditor_wiris_openFormulaEditor', new OpenFormulaEditorCommand( editor ) );

        // Add command to open the chemistry formula editor
        editor.commands.add( 'ckeditor_wiris_openFormulaEditorChemistry', new OpenFormulaEditorChemistryCommand( editor ) );

        // Add button for the formula editor
        editor.ui.componentFactory.add( 'ckeditor_wiris_openFormulaEditor', locale => {
            const view = new ButtonView( locale );

            view.set( {
                label: 'Insert a math equation - MathType',
                icon: mathIcon, // TODO CKEditor5 requires SVG icons
                tooltip: true
            } );

            // Callback executed once the image is clicked.
            view.on( 'execute', () => {
                editor.execute( 'ckeditor_wiris_openFormulaEditor', {
                    'integration': integration, // Pass integration as parameter
                } );
            } );

            return view;
        } );

        // Add button for the chemistry formula editor
        editor.ui.componentFactory.add( 'ckeditor_wiris_openFormulaEditorChemistry', locale => {
            const view = new ButtonView( locale );

            view.set( {
                label: 'Insert a chemistry formula - ChemType',
                icon: chemIcon, // TODO CKEditor5 requires SVG icons
                tooltip: true
            } );

            // Callback executed once the image is clicked.
            view.on( 'execute', () => {
                editor.execute( 'ckeditor_wiris_openFormulaEditorChemistry', {
                    'integration': integration, // Pass integration as parameter
                } );
            } );

            return view;
        } );

        editor.editing.view.addObserver( ClickObserver );

        editor.editing.view.document.on( 'keydown', jumpOverMath );
        
        // Move cursor from the end of the inline filler to the beginning of it when, so the filler does not break navigation.
        function jumpOverMath( evt, data ) {
            if ( data.keyCode == keyCodes.arrowleft ) {
                const domSelection = data.domTarget.ownerDocument.defaultView.getSelection();

                if ( domSelection.rangeCount == 1 && domSelection.getRangeAt( 0 ).collapsed ) {
                    const domParent = domSelection.getRangeAt( 0 ).startContainer;

                    if ( domParent.nodeName == 'img' && domParent.classList.contains( 'Wirisformula' ) ) {
                        domSelection.collapse( domParent.parentNode, Array.from( domParent.parentNode.children ).indexOf( domParent ) );
                    }

                }

            } else if ( data.keyCode == keyCodes.arrowright ) {
                const domSelection = data.domTarget.ownerDocument.defaultView.getSelection();

                if ( domSelection.rangeCount == 1 && domSelection.getRangeAt( 0 ).collapsed ) {
                    const domParent = domSelection.getRangeAt( 0 ).startContainer;

                    if ( domParent.nodeName == 'img' && domParent.classList.contains( 'Wirisformula' ) ) {
                        domSelection.collapse( domParent.parentNode, Array.from( domParent.parentNode.children ).indexOf( domParent ) + 1 );
                    }

                }

            }
        }

    }

}