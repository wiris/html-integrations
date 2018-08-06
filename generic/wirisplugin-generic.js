
(function() {
    /**
     * Auxiliary method. Returns the path of the script. Needed to load core.js relatively.
     * @returns {string} - Absolute path of generic integration JavaScript file.
     */
    function getPath() {
        var col = document.getElementsByTagName("script");
        var path = '';
        for (i = 0; i < col.length; i++) {
            j = col[i].src.lastIndexOf('wirisplugin-generic.js');
            if (j >= 0) {
                path = col[i].src.substr(0, j - 1);
            }
        }
        return path;
    }

    /**
     * Inits the MathType for this demo. Due to the demo structure this method should be global.
     * @param iframe editable iframe
     * @param toolbar HTML element where icons will be inserted
     */
    window.wrs_int_init = function(target,toolbar) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = getPath() + '/core/core.js?v=' +  '@plugin.version@';
        document.getElementsByTagName('head')[0].appendChild(script);
        script.onload = function() {
            createIntegrationModel(target, toolbar);
        }
    }

    /**
     * Creates the IntegrationModel class associated with the generic integration.
     * @param {object} target - DOM target.
     * @param {object} toolbar - DOM object for the toolbar.
     */
    function createIntegrationModel(target, toolbar) {

        var language;
        if (typeof _wrs_int_langCode !== 'undefined') {
            language = _wrs_int_langCode;
        }
        else {
            if (navigator.userLanguage) {
                language = navigator.userLanguage.substring(0, 2);
            }
            else if (navigator.language) {
                language = navigator.language.substring(0, 2);
            }
            else {
                language = 'en';
            }
        }


        var callBackMethodArguments = {};
        callBackMethodArguments.target = target
        callBackMethodArguments.toolbar = toolbar;

        /**
         * Integration model properties
         * @type {object}
         * @property {object} target - Integration DOM target.
         * @property {string} configurationService - Configuration integration service.
         * @property {string} version - Plugin version.
         * @property {string} scriptName - Integration script name.
         * @property {object} environment - Integration environment properties.
         * @property {string} editor - Editor name.
         */
        var integrationModelProperties = {};
        integrationModelProperties.target = target;
        integrationModelProperties.configurationService = '@param.js.configuration.path@';
        integrationModelProperties.version = '@plugin.version@';
        integrationModelProperties.scriptName = "wirisplugin-generic.js";
        integrationModelProperties.environment = {};
        integrationModelProperties.environment.editor = "GenericHTML";
        integrationModelProperties.callBackMethodArguments = callBackMethodArguments;
        integrationModelProperties.language = language;



        /**
         * IntegrationModel constructor. This method sets the dependant
         * integration properties needed by the IntegrationModel class to init the plugin.
         * @
         * @param {integrationModelProperties} integrationModelProperties.
         */
        var GenericIntegration = function(integrationModelProperties) {
            WirisPlugin.IntegrationModel.call(this, integrationModelProperties);
        }

        GenericIntegration.prototype = Object.create(WirisPlugin.IntegrationModel.prototype);

        GenericIntegration.prototype.callbackFunction = function() {
            /* Assigning events to the WYSIWYG editor */
            this.addEvents(this.callBackMethodArguments.target);
            /* Parsing input text */
            target.contentWindow.document.body.innerHTML = WirisPlugin.Parser.initParse(target.contentWindow.document.body.innerHTML);

            /* Creating toolbar buttons */
            var editorIcon = '/icons/formula.png';
            var formulaButton = document.createElement('img');
            formulaButton.id = "editorIcon";
            formulaButton.src = this.getPath() + editorIcon;
            formulaButton.style.cursor = 'pointer';

            WirisPlugin.Util.addEvent(formulaButton, 'click', function () {
                this.core.getCustomEditors().disable();
                this.openNewFormulaEditor();
            }.bind(this));

            this.callBackMethodArguments.toolbar.appendChild(formulaButton);


            // Dynamic customEditors buttons.
            var customEditors = this.getCore().getCustomEditors();
            // Iterate from all custom editors.
            for (var customEditor in customEditors.editors) {
                if (customEditors.editors[customEditor].confVariable) {
                    var customEditorButton = document.createElement('img');
                    customEditorButton.src = this.getPath() + '/icons/' + customEditors.editors[customEditor].icon;
                    customEditorButton.id = customEditor + "Icon";
                    customEditorButton.style.cursor = 'pointer';

                    WirisPlugin.Util.addEvent(customEditorButton, 'click', function () {
                        customEditors.enable(customEditor);
                        integrationModel.openNewFormulaEditor();
                    });

                    this.callBackMethodArguments.toolbar.appendChild(customEditorButton);
                }
            }
        }

        var integrationModel = new GenericIntegration(integrationModelProperties);
        integrationModel.init(target, toolbar);
        WirisPlugin.integrationModel = integrationModel;
    }
}());
