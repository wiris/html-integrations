import IntegrationModel, { integrationModelAttributes } from './core/src/integrationmodel';
import Parser from './core/src/parser';
import Util from './core/src/util';

/**
 * Inits MathType creating an object with all properties that the IntegrationModel class
 * needs to initialize the plugin and create an instance of IntegrationModel child.
 * @param {HTMLElement} target - DOM target, in this integration the editable iframe.
 * @param {HTMLElement} toolbar - DOM element where icons will be inserted.
 */
window.wrs_int_init = function(target,toolbar) {
    var callbackMethodArguments = {};
    callbackMethodArguments.target = target
    callbackMethodArguments.toolbar = toolbar;

    /**
     * @type {integrationModelAttributes}
     */
    var integrationModelProperties = {};
    integrationModelProperties.target = target;
    integrationModelProperties.configurationService = '@param.js.configuration.path@';
    integrationModelProperties.version = '@plugin.version@';
    integrationModelProperties.scriptName = "wirisplugin-generic.js";
    integrationModelProperties.environment = {};
    integrationModelProperties.environment.editor = "GenericHTML";
    integrationModelProperties.callbackMethodArguments = callbackMethodArguments;

    // GenericIntegration instance.
    var genericIntegrationInstance = new GenericIntegration(integrationModelProperties);
    genericIntegrationInstance.init();
    genericIntegrationInstance.listeners.fire('onTargetReady', {});
}

/**
 * IntegrationModel constructor. This method sets the dependant
 * integration properties needed by the IntegrationModel class to init the plugin.
 */
export class GenericIntegration extends IntegrationModel {
    /**
     * Returns the demo language, stored in _wrs_int_langCode variable. If the language
     * is no set set, calls parent getLanguage() method.
     * @returns {string} demo language.
     */
    getLanguage() {
        if (typeof _wrs_int_langCode !== 'undefined') {
            return  _wrs_int_langCode;
        } else {
            return super.getLanguage();
        }
    }

    /**@inheritdoc */
    callbackFunction() {
        // Call parent callbackFunction in order to addEvents to integration target.
        super.callbackFunction();
        /* Parsing input text */
        this.target.contentWindow.document.body.innerHTML = Parser.initParse(this.target.contentWindow.document.body.innerHTML);

        /* Creating toolbar buttons */
        var editorIcon = '/icons/formula.png';
        var formulaButton = document.createElement('img');
        formulaButton.id = "editorIcon";
        formulaButton.src = this.getPath() + editorIcon;
        formulaButton.style.cursor = 'pointer';

        Util.addEvent(formulaButton, 'click', function () {
            this.core.getCustomEditors().disable();
            this.openNewFormulaEditor();
        }.bind(this));

        this.callbackMethodArguments.toolbar.appendChild(formulaButton);

        // Dynamic customEditors buttons.
        var customEditors = this.getCore().getCustomEditors();
        // Iterate from all custom editors.
        for (var customEditor in customEditors.editors) {
            if (customEditors.editors[customEditor].confVariable) {
                var customEditorButton = document.createElement('img');
                customEditorButton.src = this.getPath() + '/icons/' + customEditors.editors[customEditor].icon;
                customEditorButton.id = customEditor + "Icon";
                customEditorButton.style.cursor = 'pointer';

                Util.addEvent(customEditorButton, 'click', function () {
                    customEditors.enable(customEditor);
                    this.openNewFormulaEditor();
                }.bind(this));

                this.callbackMethodArguments.toolbar.appendChild(customEditorButton);
            }
        }
    }
}