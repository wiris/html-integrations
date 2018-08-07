(function ($) {
  /**
   * Auxiliary method. Returns the path of wiris.js script. Needed to load
   * CSS styles and core.js
   * @returns {string} "wiris.js" file path.
   */
  function getScriptPath() {
    var scriptUrl;
    var scripts = document.getElementsByTagName("script");
    var scriptName = "wiris.js";
    for (var i = 0; i < scripts.length; i++) {
        var j = scripts[i].src.lastIndexOf(scriptName);
        if (j >= 0) {
          scriptUrl = scripts[i].src.substr(0, j - 1);
        }
    }
    return scriptUrl;
  }

  /**
   * This method creates an instance of IntegrationModel object extending necesary methods
   * to integrate the plugin into Froala editor.
   * @param {editor} editor - Froala editor object.
   */
  function createIntegrationModel(editor) {

    // Select target: choose between iframe or
    // div editable.
    if (editor.opts.iframe) {
        target = editor.$iframe[0];
    } else {
        target = editor.$box[0]
    }

  var callbackMethodArguments = {};
  callbackMethodArguments.editor = editor;
  /**
   * Integration model properties
   * @type {object}
   * @property {object} target - Integration DOM target.
   * @property {string} configurationService - Configuration integration service.
   * @property {string} version - Plugin version.
   * @property {string} scriptName - Integration script name.
   * @property {object} environment - Integration environment properties.
   * @property {string} editor - Editor name.
   * @property {object} editorObject - Froala editor object.
   */
    var integrationModelProperties = {};
    integrationModelProperties.target = target;
    integrationModelProperties.configurationService = '@param.js.configuration.path@';
    integrationModelProperties.version = '@plugin.version@';
    integrationModelProperties.scriptName = "wiris.js";
    integrationModelProperties.environment = {};
    integrationModelProperties.environment.editor = "Froala";
    integrationModelProperties.callbackMethodArguments = callbackMethodArguments;
    integrationModelProperties.editorObject = editor;


    // Updating integration paths if context path is overwrited by editor javascript configuration.
    if ('wiriscontextpath' in editor.opts) {
      integrationModelProperties.configurationService  = editor.opts.wiriscontextpath + integrationModelProperties.configurationService;
    }

    /**
     * IntegrationModel constructor. This method sets the dependant
     * integration properties needed by the IntegrationModel class to init the plugin.
     * @param {integrationModelProperties} integrationModelProperties.
     */
      var FroalaIntegration = function(integrationModelProperties) {
        this.editorObject = integrationModelProperties.editorObject;
        WirisPlugin.IntegrationModel.call(this, integrationModelProperties);
      }

      // Inherit IntegrationModel prototype.
      FroalaIntegration.prototype = Object.create(WirisPlugin.IntegrationModel.prototype);

      FroalaIntegration.prototype.init = function() {
        editor.events.on('focus', function() {
            this.editorObject = this.updateEditorObject(this);
        }.bind(this));
        WirisPlugin.IntegrationModel.prototype.init.call(this);
      }

      FroalaIntegration.prototype.getLanguage = function() {
        if (editor.opts.language != null) {
          return editor.opts.language;
        } else {
          return this.getBrowserLanguage();
        }
      }

      FroalaIntegration.prototype.updateEditorObject = function() {
        this.editorObject.focus = function () {
          // Hide popups in order to set the caret and allow the user writting without hide the image popup that Froala has.
          return this.$oel.froalaEditor('events.focus', true);
        };
        return this.editorObject;
      }

      FroalaIntegration.prototype.callbackFunction = function() {
        this.createButtons();
        var editor = this.callbackMethodArguments.editor;
        WirisPlugin.IntegrationModel.prototype.callbackFunction.call(this);

        // Update editor parameters.
        // The integration could contain an object with editor parameters. These parameters
        // have preference over the backend parameters so we need to update them.
        if ('wiriseditorparameters' in editor.opts) {
          WirisPlugin.Configuration.update('_wrs_conf_editorParameters', editor.opts.wiriseditorparameters);
        }

        // Events
        if (WirisPlugin.Configuration.get('imageFormat') == "svg") {
          editor.events.on('html.set', function () {
            var images = this.el.getElementsByClassName('Wirisformula');
            for (var i = 0; i < images.length; i++) {
              if (images[i].src.substr(0, 10) == "data:image") {
                var firstPart = images[i].src.substr(0, 33);
                var secondPart = images[i].src.substr(33, images[i].src.length);
                images[i].src = firstPart + encodeURIComponent(decodeURIComponent(secondPart));
              }
            }
          });
        }

        editor.events.on('html.get', function(e, editor, html) {
          return WirisPlugin.Parser.endParse(e);
        });



        // Adding parse MathML to images after command event to prevent
        // lost image formulas.
        editor.events.on('commands.after', function (cmd) {
            if(cmd == "html"){
            if(!editor.codeView.isActive()){
                var parsedContent = WirisPlugin.Parser.initParse(editor.html.get(), editor.opts.language);
                editor.html.set(parsedContent);
            }
            }
        });

        // Parse content

        var parsedContent = WirisPlugin.Parser.initParse(editor.html.get());
        editor.html.set(parsedContent);
      }

      FroalaIntegration.prototype.createButtons = function() {
        $.FroalaEditor.RegisterCommand('wirisEditor', {
            title: 'Insert a math equation - MathType',
            focus: true,
            undo: true,
            refreshAfterCallback: true,
            callback: function () {
              // Setting explicit current Editor beacuse last froala doesn't set focus on click button
              this.editorObject = this.updateEditorObject(this);
              this.hidePopups();
              this.core.getCustomEditors().disable();
              var imageObject = this.editorObject.image.get();
              if (typeof imageObject !== 'undefined' && imageObject !== null && imageObject.hasClass(WirisPlugin.Configuration.get('imageClassName'))) {
                this.core.editionProperties.temporalImage = imageObject[0];
                this.openExistingFormulaEditor(this.target);
              } else {
                this.openNewFormulaEditor();
              }
              // wrs_int_openNewFormulaEditor(this.$iframe != null ? this.$iframe[0] : this.$box[0], this.opts.language, this.$iframe != null ? true : false);
            }.bind(this)
          });

          $.FroalaEditor.COMMANDS.wirisEditor.refresh = function ($btn) {
            var selectedImage = this.editorObject.image.get();
              if (($btn.parent()[0].hasAttribute('class') && $btn.parent()[0].getAttribute('class').indexOf('fr-buttons') == -1) || (selectedImage[0] &&
                  ($(selectedImage[0]).hasClass(WirisPlugin.Configuration.get('imageClassName')) || $(selectedImage[0]).contents().hasClass(WirisPlugin.Configuration.get('imageClassName'))))) {
                $btn.removeClass('fr-hidden');
              }
              else {
                $btn.addClass('fr-hidden');
              }
          }.bind(this);

          $.FroalaEditor.RegisterCommand('wirisChemistry', {
            title: 'Insert a chemistry formula - ChemType',
            focus: true,
            undo: true,
            refreshAfterCallback: true,
            callback: function () {
              // Setting explicit current Editor because last froala doesn't set focus on click button
              this.editorObject = this.updateEditorObject(this);
              this.hidePopups();
              this.core.getCustomEditors().enable('chemistry');
              var imageObject = this.editorObject.image.get();
              if (typeof imageObject !== 'undefined' && imageObject !== null && imageObject.hasClass(WirisPlugin.Configuration.get('imageClassName'))) {
                this.core.editionProperties.temporalImage = imageObject[0];
                this.openExistingFormulaEditor(this.target);
              } else {
                this.openNewFormulaEditor();
              }
            }.bind(this)
          });

          $.FroalaEditor.COMMANDS.wirisChemistry.refresh = function ($btn) {
            var selectedImage = this.editorObject.image.get();
            if (($btn.parent()[0].hasAttribute('class') && $btn.parent()[0].getAttribute('class').indexOf('fr-buttons') == -1) || (selectedImage[0] &&
                ($(selectedImage[0]).hasClass(WirisPlugin.Configuration.get('imageClassName')) || $(selectedImage[0]).contents().hasClass(WirisPlugin.Configuration.get('imageClassName'))))) {
              $btn.removeClass('fr-hidden');
            }
            else {
              $btn.addClass('fr-hidden');
            }
        }.bind(this);

      }

      FroalaIntegration.prototype.hidePopups = function() {
        var instances =  $.FroalaEditor.INSTANCES;
            for (var i = 0; i < instances.length; i++) {
              instances[i].popups.hideAll();
            }
          }


      var froalaIntegrationInstance = new FroalaIntegration(integrationModelProperties);
      froalaIntegrationInstance.init()
      window.froalaIntegrationInstance = froalaIntegrationInstance;
    }

  // Define the plugin.
  // The editor parameter is the current instance.
  $.FroalaEditor.PLUGINS.wiris = function (editor) {
    function _init() {
      $('head').append('<link rel="stylesheet" href="' + getScriptPath() + '/icons/font/css/wirisplugin.css">');

      // Add an option for your plugin.
      $.FroalaEditor.DEFAULTS = $.extend($.FroalaEditor.DEFAULTS, {
        myOption: false
      });

      // Including core.js
      var script = document.createElement('script');
      script.type = 'text/javascript';
      // TODO: version
      script.src = getScriptPath() + '/core/core.js?v=' + '@plugin.version@';
      document.getElementsByTagName('head')[0].appendChild(script);
      script.onload = function() {
        createIntegrationModel(editor);
      }
    }

    return {
      _init: _init,
    }
  }


  // Icons should be registered here. FormulaIntegration.createButtons insert the logic.
  // Icon templates
  $.FroalaEditor.DefineIconTemplate('wirisplugin', '<i class="icon icon-[NAME]"></i>');
  // Add an option for your plugin.
  $.FroalaEditor.DefineIcon('wirisEditor', {NAME: 'editor', template: 'wirisplugin'});
  $.FroalaEditor.RegisterCommand('wirisEditor', {
      title: 'Insert a math equation - MathType',
  });


  $.FroalaEditor.DefineIcon('wirisChemistry', {NAME: 'chemistry', template: 'wirisplugin'});
  $.FroalaEditor.RegisterCommand('wirisChemistry', {
      title: 'Insert a chemistry formula - ChemType',
    });


})(jQuery);
