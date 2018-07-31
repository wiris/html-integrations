// Define variables needed by core/core.js
var _wrs_int_conf_file = "@param.js.configuration.path@";
var _wrs_plugin_version = "@plugin.version@";
baseURL = window.location.protocol + "//" + window.location.host + "/assets/froala_wiris";
// Get _wrs_conf_path (plugin URL).
var col = document.getElementsByTagName("script");
// In order to run when wiris.js is inside /assets folder and running as a precompiled asset, we need to search by 'wiris.'
var _wrs_conf_editor = "Froala";
var scriptName = "wiris.js";
for (var i = 0; i < col.length; i++) {
    var j = col[i].src.lastIndexOf(scriptName);
    if (j >= 0) {
        baseURL = col[i].src.substr(0, j - 1);
    }
}
_wrs_conf_path = baseURL;

var _wrs_int_path = _wrs_int_conf_file.split("/");
_wrs_int_path.pop();
_wrs_int_path = _wrs_int_path.join("/");
_wrs_int_path = _wrs_int_path.indexOf("/") == 0 || _wrs_int_path.indexOf("http") == 0 ? _wrs_int_path : _wrs_conf_path + "/" + _wrs_int_path;

var _wrs_conf_setSize = true;

$('head').append('<link rel="stylesheet" href="' + _wrs_conf_path + '/icons/font/css/wirisplugin.css">');

var _wrs_int_customEditors = {chemistry : {name: 'Chemistry', toolbar : 'chemistry', icon : 'chem.png', enabled : false, confVariable : '_wrs_conf_chemEnabled', tooltip: 'Insert a chemistry formula - ChemType', title : 'ChemType'}}
var _wrs_currentEditor;

var _wrs_int_temporalImageResizing;
var _wrs_int_langCode = 'en';

// Extra vars
var _wrs_int_window_opened = false;

(function ($) {


  /**
   * Returns Froala editor object with mandatory attributes like 'focus' for core.js file.
   * @param {Object} editor froala editor instance.
   */
  function wrs_createEditorObject(editor) {
    editor.focus = function () {
      // Hide popups in order to set the caret and allow the user writting without hide the image popup that Froala has.
      wrs_int_hideFroalaPopups();
      return this.$oel.froalaEditor('events.focus', true);
    };
    return editor;
  }

  // Add an option for your plugin.
  $.FroalaEditor.DEFAULTS = $.extend($.FroalaEditor.DEFAULTS, {
    myOption: false
  });

  // Define the plugin.
  // The editor parameter is the current instance.
  $.FroalaEditor.PLUGINS.wiris = function (editor) {

    // Updating integration paths if context path is overwrited by editor javascript configuration.
    if ('wiriscontextpath' in editor.opts) {
      _wrs_int_path = editor.opts.wiriscontextpath ;
      _wrs_int_conf_file = editor.opts.wiriscontextpath + _wrs_int_conf_file;
    }

    // Including core.js
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = _wrs_conf_path + '/core/core.js?v=' + _wrs_plugin_version;
    document.getElementsByTagName('head')[0].appendChild(script);
    editor.events.on('focus', function() {
      _wrs_currentEditor = wrs_createEditorObject(this);
    });

    // Adding parse mathml to images after command event to prevent
    // lost image formulas.
     editor.events.on('commands.after', function (cmd) {
      if(cmd == "html"){
        if(!editor.codeView.isActive()){
          var parsedContent = wrs_initParse(editor.html.get(), editor.opts.language);
            editor.html.set(parsedContent);
        }
      }
     });

    // Entry point:
    // Register events, and global functions.
    function _init () {
        function waitForCore() {
          if (window.wrs_initParse && typeof _wrs_conf_plugin_loaded != 'undefined') {
            // This event solve malformed uris without percent-encoding
            // when we set wirisimages on editor.
            if (_wrs_conf_imageFormat == "svg") {
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
            if ('wiriseditorparameters' in editor.opts) {
              _wrs_int_wirisProperties = editor.opts.wiriseditorparameters;
            }
            _wrs_int_langCode = editor.opts.language != null ? editor.opts.language : 'en';
            if (editor.opts.iframe) {
              wrs_addIframeEvents(editor.$iframe[0], function (iframe, element) {
                wrs_int_doubleClickHandler(editor, iframe, true, element);
              }, wrs_int_mousedownHandler, wrs_int_mouseupHandler);
            } else {
              wrs_addElementEvents(editor.$el[0], function (div, element, event) {
                wrs_int_doubleClickHandlerForDiv(editor, div, element, event);
              }, wrs_int_mousedownHandler, wrs_int_mouseupHandler);
            }

            var parsedContent = wrs_initParse(editor.html.get(), editor.opts.language);
            editor.html.set(parsedContent);

            editor.events.on('html.get', function(e, editor, html) {
              return wrs_endParse(e);
            });

          } else {
            setTimeout(waitForCore, 50);
          }
        }

      window.wrs_int_updateFormula = wrs_int_updateFormula;
      window.wrs_int_insertElementOnSelection = wrs_int_insertElementOnSelection;
      window.wrs_int_doubleClickHandler = wrs_int_doubleClickHandler;
      window.wrs_int_openExistingFormulaEditor = wrs_int_openExistingFormulaEditor;
      window.wrs_int_openNewFormulaEditor = wrs_int_openNewFormulaEditor;
      window.wrs_int_getSelectedItem = wrs_int_getSelectedItem;
      window.wrs_int_notifyWindowClosed = wrs_int_notifyWindowClosed;
      window.wrs_int_hideFroalaPopups = wrs_int_hideFroalaPopups;

      waitForCore();

    }

    /**
     * Calls wrs_updateFormula with well params.
     * @param string mathml
     */
    function wrs_int_updateFormula(mathml, editMode, language) {
      // _wrs_int_wirisProperties contains some js render params. Since mathml can support render params, js params should be send only to editor, not to render.
      if (_wrs_int_temporalElementIsIframe) {
        // wrs_updateFormula(_wrs_int_temporalElement.contentWindow, _wrs_int_temporalElement.contentWindow, mathml, _wrs_int_wirisProperties, editMode, language);
        wrs_updateFormula(_wrs_int_temporalElement.contentWindow, _wrs_int_temporalElement.contentWindow, mathml, {}, editMode, language);
      }
      else {
        // wrs_updateFormula(_wrs_int_temporalElement, window, mathml, _wrs_int_wirisProperties, editMode, language);
        wrs_updateFormula(_wrs_int_temporalElement, window, mathml, {}, editMode, language);
      }
    }

    /**
     * Handles window closing.
     */
    function wrs_int_notifyWindowClosed() {
      _wrs_int_window_opened = false;
    }


    /**
     * Handles a mouse down event on the iframe.
     * @param object iframe Target
     * @param object element Element mouse downed
     */
    function wrs_int_mousedownHandler(iframe, element) {
        if (element.nodeName.toLowerCase() == 'img') {
            if (wrs_containsClass(element, 'Wirisformula') || wrs_containsClass(element, 'Wiriscas')) {
                _wrs_int_temporalImageResizing = element;
            }
        }
    }

    /**
     * Handles a mouse up event on the iframe.
    */
    function wrs_int_mouseupHandler() {
        if (_wrs_int_temporalImageResizing) {
            setTimeout(function () {
                wrs_fixAfterResize(_wrs_int_temporalImageResizing);
            }, 10);
        }
    }

    /**
     * Opens formula editor to edit an existing formula.
     * @param object element Target
     * @param bool isIframe
     */
    function wrs_int_openExistingFormulaEditor(element, isIframe, language) {
        _wrs_int_window_opened = true;
        _wrs_isNewElement = false;
        _wrs_int_temporalElement = element;
        _wrs_int_temporalElementIsIframe = isIframe;
        _wrs_int_window = wrs_openEditorWindow(language, element, isIframe);
    }

    /**
      * Opens formula editor.
      * @param object element Target
      */
    function wrs_int_openNewFormulaEditor(element, language, isIframe) {
    if (_wrs_int_window_opened && !_wrs_conf_modalWindow) {
      _wrs_int_window.focus();
    }
    else {
      _wrs_int_window_opened = true;
      _wrs_isNewElement = true;
      _wrs_int_temporalElement = element;
      _wrs_int_temporalElementIsIframe = isIframe;
      _wrs_int_window = wrs_openEditorWindow(language, element, isIframe);
    }
    }

    function wrs_int_insertElementOnSelection() {
      if (_wrs_currentEditor.selection.get().anchorNode != null) {  // In case of not modify...
        _wrs_currentEditor.selection.element().focus();
        _wrs_range = _wrs_currentEditor.selection.get().getRangeAt(0);
      }
    }

    /**
     * Handles a double click on the target.
     * @param object editor tinymce active editor
     * @param object target Target
     * @param object element Element double clicked
     * @param bool isIframe target is an iframe or not
     */
    function wrs_int_doubleClickHandler(editor, target, isIframe, element) {

      // This loop allows the double clicking on the formulas represented with span's.
      while (!wrs_containsClass(element, 'Wirisformula')) {
        if (element == null) return;
        element = element.parentNode;
      }

      wrs_int_disableCustomEditors();

      var elementName = element.nodeName.toLowerCase();
      if (elementName == 'img' || elementName == 'iframe' || elementName == 'span') {
          if (wrs_containsClass(element, 'Wirisformula')) {
              if (customEditor = element.getAttribute('data-custom-editor')) {
                  if (window[_wrs_int_customEditors[customEditor].confVariable]) {
                      wrs_int_enableCustomEditor(customEditor);
                  }
              }

              if (!_wrs_int_window_opened || _wrs_conf_modalWindow) {
                  _wrs_temporalImage = element;
                  wrs_int_openExistingFormulaEditor(target, isIframe, 'en');
              }
              else {
                  _wrs_int_window.focus();
              }
          }
      }
    }

    function wrs_int_getSelectedItem(target, isIframe) {
      if (typeof _wrs_currentEditor.image != 'undefined' && typeof _wrs_currentEditor.image.get() != 'undefined' &&
          _wrs_currentEditor.image.get() !== null && _wrs_currentEditor.image.get().hasOwnProperty('0')) {
        var selectedItem = new Object();
        selectedItem.node = _wrs_currentEditor.image.get()[0];
        return selectedItem;
      }
      else {
        // Latex case
        // If the node is not a text node, it means that there isn't any item
        var selection = _wrs_currentEditor.selection.get();
        return selection.anchorNode.nodeType === 3 ? { node: selection.anchorNode, caretPosition: selection.anchorOffset } : null;
      }
    }

    /**
     * Handles a double click on the contentEditable div.
     * @param object div Target
     * @param object element Element double clicked
     */
    function wrs_int_doubleClickHandlerForDiv(editor, div, element, event) {
      wrs_int_doubleClickHandler(editor, div, false, element, event);
    }

    function wrs_int_hideFroalaPopups() {
      var instances =  $.FroalaEditor.INSTANCES;
      for (var i = 0; i < instances.length; i++) {
        instances[i].popups.hideAll();
      }
    }

    return {
      _init: _init,
    }
  }

  // Icon templates
  $.FroalaEditor.DefineIconTemplate('wirisplugin', '<i class="icon icon-[NAME]"></i>');
  // Add an option for your plugin.
  $.FroalaEditor.DefineIcon('wirisEditor', {NAME: 'editor', template: 'wirisplugin'});
  $.FroalaEditor.RegisterCommand('wirisEditor', {
      title: 'Insert a math equation - MathType',
      focus: true,
      undo: true,
      refreshAfterCallback: true,
      callback: function () {
        // Setting explicit current Editor beacuse last froala doesn't set focus on click button
        _wrs_currentEditor = wrs_createEditorObject(this);
        wrs_int_hideFroalaPopups();
        wrs_int_disableCustomEditors();
        wrs_int_openNewFormulaEditor(this.$iframe != null ? this.$iframe[0] : this.$box[0], this.opts.language, this.$iframe != null ? true : false);
      }
    });


  $.FroalaEditor.DefineIcon('wirisChemistry', {NAME: 'chemistry', template: 'wirisplugin'});
  $.FroalaEditor.RegisterCommand('wirisChemistry', {
      title: 'Insert a chemistry formula - ChemType',
      focus: true,
      undo: true,
      refreshAfterCallback: true,
      callback: function () {
        // Setting explicit current Editor beacuse last froala doesn't set focus on click button
        _wrs_currentEditor = wrs_createEditorObject(this);
        wrs_int_hideFroalaPopups();
        wrs_int_enableCustomEditor('chemistry');
        wrs_int_openNewFormulaEditor(this.$iframe != null ? this.$iframe[0] : this.$box[0], this.opts.language, this.$iframe != null ? true : false);
      }
    });

   $.FroalaEditor.COMMANDS.wirisEditor.refresh = function ($btn) {
    var selectedImage = _wrs_currentEditor.image.get();
      if (($btn.parent()[0].hasAttribute('class') && $btn.parent()[0].getAttribute('class').indexOf('fr-buttons') == -1) || (selectedImage[0] &&
          ($(selectedImage[0]).hasClass(_wrs_conf_imageClassName) || $(selectedImage[0]).contents().hasClass(_wrs_conf_imageClassName)))) {
        $btn.removeClass('fr-hidden');
      }
      else {
        $btn.addClass('fr-hidden');
      }
  }

   $.FroalaEditor.COMMANDS.wirisChemistry.refresh = function ($btn) {
      var selectedImage = _wrs_currentEditor.image.get();
      if (($btn.parent()[0].hasAttribute('class') && $btn.parent()[0].getAttribute('class').indexOf('fr-buttons') == -1) || (selectedImage[0] &&
          ($(selectedImage[0]).hasClass(_wrs_conf_imageClassName) || $(selectedImage[0]).contents().hasClass(_wrs_conf_imageClassName)))) {
        $btn.removeClass('fr-hidden');
      }
      else {
        $btn.addClass('fr-hidden');
      }
  }

})(jQuery);
