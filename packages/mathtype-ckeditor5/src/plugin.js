/* globals window */

// CKEditor imports
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import ClickObserver from '@ckeditor/ckeditor5-engine/src/view/observer/clickobserver';
import ViewDocumentFragment from '@ckeditor/ckeditor5-engine/src/view/documentfragment';
import HtmlDataProcessor from '@ckeditor/ckeditor5-engine/src/dataprocessor/htmldataprocessor';
import XmlDataProcessor from '@ckeditor/ckeditor5-engine/src/dataprocessor/xmldataprocessor';
import { toWidget } from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';

// MathType API imports
import { integrationModelProperties } from '@wiris/mathtype-html-integration-devkit/src/integrationmodel';
import Core from '@wiris/mathtype-html-integration-devkit/src/core.src.js';
import Parser from '@wiris/mathtype-html-integration-devkit/src/parser.js';
import Util from '@wiris/mathtype-html-integration-devkit/src/util.js';
import Image from '@wiris/mathtype-html-integration-devkit/src/image.js';
import Configuration from '@wiris/mathtype-html-integration-devkit/src/configuration.js';
import Listeners from '@wiris/mathtype-html-integration-devkit/src/listeners';
import IntegrationModel from '@wiris/mathtype-html-integration-devkit/src/integrationmodel.js';
import CoreMathML from '@wiris/mathtype-html-integration-devkit/src/mathml.js';
import Latex from '@wiris/mathtype-html-integration-devkit/src/latex';

// Local imports
import MathTypeCommand from './commands/mathtypecommand';
import ChemTypeCommand from './commands/chemtypecommand';
import CKEditor5Integration from './integration';

import mathIcon from '../theme/icons/formula.svg';
import chemIcon from '../theme/icons/chem.svg';

export default class MathType extends Plugin {

    static get requires() {
        return [ Widget ];
    }

    static get pluginName() {
        return 'MathType';
    }

    init() {

        // Create the MathType API Integration object
        const integration = this._addIntegration();

        // Add the MathType and ChemType commands to the editor
        this._addCommands();

        // Add the buttons for MathType and ChemType
        this._addViews( integration );

        // Registers the <mathml> element in the schema
        this._addSchema();

        // Add the downcast and upcast converters
        this._addConverters();

        // Expose the WirisPlugin variable to the window
        this._exposeWiris();

    }

    /**
     * Create the MathType API Integration object
     * @returns {CKEditor5Integration} the integration object
     */
    _addIntegration() {

        const editor = this.editor;

        /**
         * Integration model constructor attributes.
         * @type {integrationModelProperties}
         */
        const integrationProperties = {};
        integrationProperties.environment = {};
        integrationProperties.environment.editor = 'CKEditor5';
        integrationProperties.editorObject = editor;
        integrationProperties.serviceProviderProperties = {};
        integrationProperties.serviceProviderProperties.URI = 'https://www.wiris.net/demo/plugins/app';
        integrationProperties.serviceProviderProperties.server = 'java';
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

        return integration;

    }

    /**
     * Add the MathType and ChemType commands to the editor
     */
    _addCommands() {

        const editor = this.editor;

        // Add command to open the formula editor
        editor.commands.add( 'MathType', new MathTypeCommand( editor ) );

        // Add command to open the chemistry formula editor
        editor.commands.add( 'ChemType', new ChemTypeCommand( editor ) );

    }

    /**
     * Add the buttons for MathType and ChemType
     * @param {CKEditor5Integration} integration the integration object
     */
    _addViews( integration ) {

        const editor = this.editor;

        // Add button for the formula editor
        editor.ui.componentFactory.add( 'MathType', locale => {
            const view = new ButtonView( locale );

            view.set( {
                label: 'Insert a math equation - MathType',
                icon: mathIcon,
                tooltip: true
            } );

            // Callback executed once the image is clicked.
            view.on( 'execute', () => {
                editor.execute( 'MathType', {
                    'integration': integration, // Pass integration as parameter
                } );
            } );

            return view;
        } );

        // Add button for the chemistry formula editor
        editor.ui.componentFactory.add( 'ChemType', locale => {
            const view = new ButtonView( locale );

            view.set( {
                label: 'Insert a chemistry formula - ChemType',
                icon: chemIcon,
                tooltip: true
            } );

            // Callback executed once the image is clicked.
            view.on( 'execute', () => {
                editor.execute( 'ChemType', {
                    'integration': integration, // Pass integration as parameter
                } );
            } );

            return view;
        } );

        // Observer for the double click event
        editor.editing.view.addObserver( ClickObserver );

    }

    /**
     * Registers the <mathml> element in the schema
     */
    _addSchema() {

        const schema = this.editor.model.schema;

        schema.register( 'mathml', {
            allowWhere: '$text',
            isObject: true,
            isInline: true,
            allowAttributes: [ 'formula' ]
        } );

    }

    /**
     * Add the downcast and upcast converters
     */
    _addConverters() {

        const editor = this.editor;

        // View -> Model
        editor.data.upcastDispatcher.on( 'element:math', ( evt, data, conversionApi ) => {
            const { consumable, writer } = conversionApi;
            const viewItem = data.viewItem;

            // When element was already consumed then skip it.
            if ( !consumable.test( viewItem, { name: true } ) ) {
                return;
            }

            // Get the formula of the <math> (which is all its children).
            const processor = new XmlDataProcessor();
            const viewDocumentFragment = new ViewDocumentFragment( viewItem.getChildren() );
            let formula = processor.toData( viewDocumentFragment ) || '';
            formula = `<math xmlns="http://www.w3.org/1998/Math/MathML">${ formula }</math>`;

            // Create the <mathml> model element.
            const modelElement = writer.createElement( 'mathml', { formula } );

            // Find allowed parent for element that we are going to insert.
            // If current parent does not allow to insert element but one of the ancestors does
            // then split nodes to allowed parent.
            const splitResult = conversionApi.splitToAllowedParent( modelElement, data.modelCursor );

            // When there is no split result it means that we can't insert element to model tree, so let's skip it.
            if ( !splitResult ) {
                return;
            }

            // Insert element on allowed position.
            conversionApi.writer.insert( modelElement, splitResult.position );

            // Consume appropriate value from consumable values list.
            consumable.consume( viewItem, { name: true } );

            const parts = conversionApi.getSplitParts( modelElement );

            // Set conversion result range.
            data.modelRange = writer.createRange(
                conversionApi.writer.createPositionBefore( modelElement ),
                conversionApi.writer.createPositionAfter( parts[ parts.length - 1 ] )
            );

            // Now we need to check where the `modelCursor` should be.
            if ( splitResult.cursorParent ) {
                // If we split parent to insert our element then we want to continue conversion in the new part of the split parent.
                //
                // before: <allowed><notAllowed>foo[]</notAllowed></allowed>
                // after:  <allowed><notAllowed>foo</notAllowed><converted></converted><notAllowed>[]</notAllowed></allowed>

                data.modelCursor = conversionApi.writer.createPositionAt( splitResult.cursorParent, 0 );
            } else {
                // Otherwise just continue after inserted element.
                data.modelCursor = data.modelRange.end;
            }
        } );

        // Model -> Editing view
        editor.conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'mathml',
            view: createMathMLWidget
        } );

        // Model -> Data view
        editor.conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'mathml',
            view: createMathElement
        } );

        function createMathMLWidget( modelItem, viewWriter ) {
            const widgetElement = viewWriter.createContainerElement( 'span', {
                class: 'ck-math-widget'
            } );

            const mathUIElement = createMathElement( modelItem, viewWriter );

            viewWriter.insert( viewWriter.createPositionAt( widgetElement, 0 ), mathUIElement );

            return toWidget( widgetElement, viewWriter );
        }

        function createMathElement( modelItem, viewWriter ) {

            const htmlDataProcessor = new HtmlDataProcessor();

            const mathString = modelItem.getAttribute( 'formula' );
            const imgHtml = Parser.initParse( mathString, editor.config.get( 'language' ) );
            const imgElement = htmlDataProcessor.toView( imgHtml ).getChild( 0 );

            /* Although we use the HtmlDataProcessor to obtain the attributes,
            we must create a new EmptyElement which is independent of the
            DataProcessor being used by this editor instance */ 
            return viewWriter.createEmptyElement( 'img', imgElement.getAttributes() );

        }

    }

    /**
     * Expose the WirisPlugin variable to the window
     */
    _exposeWiris() {

        window.WirisPlugin = {
            Core: Core,
            Parser: Parser,
            Image: Image,
            MathML: CoreMathML,
            Util: Util,
            Configuration: Configuration,
            Listeners: Listeners,
            IntegrationModel: IntegrationModel,
            Latex: Latex
        }

    }

}