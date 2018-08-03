
(function() {
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
     * Inits the MathType for this demo.
     * @param iframe editable iframe
     * @param toolbar HTML element where icons will be inserted
     */
    window.wrs_int_init = function(target,toolbar) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = getPath() + '/core/core.js?v=' +  '@plugin.version@';
        document.getElementsByTagName('head')[0].appendChild(script);
        script.onload = function() {
            loadConstructor(target, toolbar);
        }
    }

    function loadConstructor(target, toolbar) {
        var IntegrationModelImpl = function(target) {
            WirisPlugin.IntegrationModel.call(this, target);
            this.configurationService = '@param.js.configuration.path@';
            this.version = '@plugin.version@';
            this.target = null;
            this.script = "wirisplugin-generic.js";
            this.environment.editor = "GenericHTML";
        }

        IntegrationModelImpl.prototype = Object.create(WirisPlugin.IntegrationModel.prototype);

        IntegrationModelImpl.prototype.init = function(target, toolbar) {
            var lang;
            if (typeof _wrs_int_langCode !== 'undefined') {
                lang = _wrs_int_langCode;
            }
            else {
                if (navigator.userLanguage) {
                    lang = navigator.userLanguage.substring(0, 2);
                }
                else if (navigator.language) {
                    lang = navigator.language.substring(0, 2);
                }
                else {
                    lang = 'en';
                }
            }
            this.setLang(lang);
            this.listener = WirisPlugin.Listeners.newListener('onLoad', function() {
                this.callbackFunction(target, toolbar);
            }.bind(this));
            WirisPlugin.IntegrationModel.prototype.init.call(this, target, lang);
        }

        IntegrationModelImpl.prototype.callbackFunction = function(target, toolbar) {
            /* Assigning events to the WYSIWYG editor */
            this.addEvents(target);
            /* Parsing input text */
            target.contentWindow.document.body.innerHTML = WirisPlugin.Parser.initParse(target.contentWindow.document.body.innerHTML);

            /* Creating toolbar buttons */
            // TODO: Editor enabled?
            var editorIcon = '/icons/formula.png';
            var formulaButton = document.createElement('img');
            formulaButton.id = "editorIcon";
            formulaButton.src = this.getPath() + editorIcon;
            formulaButton.style.cursor = 'pointer';

            WirisPlugin.Util.addEvent(formulaButton, 'click', function () {
                this.core.getCustomEditors().disable();
                this.openNewFormulaEditor();
            }.bind(this));

            toolbar.appendChild(formulaButton);


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

                    toolbar.appendChild(customEditorButton);
                }
            }
        }

        var integrationModel = new IntegrationModelImpl(target);
        integrationModel.init(target, toolbar);
        WirisPlugin.integrationModel = integrationModel;
    }
}());
