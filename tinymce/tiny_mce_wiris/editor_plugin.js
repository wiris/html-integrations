/* Including core.js */	
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = tinymce.baseURL + '/plugins/tinyWIRIS/core/core.js';
document.getElementsByTagName('head')[0].appendChild(script);

/* Configuration */
var _wrs_conf_editorEnabled = true;		// Specifies if fomula editor is enabled
var _wrs_conf_CASEnabled = true;		// Specifies if WIRIS CAS is enabled

var _wrs_conf_imageMathmlAttribute = 'id';	// Specifies the image tag where we should save the formula editor mathml code
var _wrs_conf_CASMathmlAttribute = 'id';	// Specifies the image tag where we should save the WIRIS CAS mathml code

var _wrs_conf_editorIcon = 'core/wiris-formula.gif';	// Specifies where is the formula editor icon
var _wrs_conf_CASIcon = 'pluginwiris/core/wiris-cas.gif';			// Specifies where is the WIRIS CAS icon

var _wrs_conf_editorPath = 'pluginwiris/integration/editor.php';						// Specifies where is the editor HTML code (for popup window)
var _wrs_conf_editorAttributes = 'width=500, height=400, scroll=no, resizable=yes';		// Specifies formula editor window options
var _wrs_conf_CASPath = 'pluginwiris/integration/cas.php';								// Specifies where is the WIRIS CAS HTML code (for popup window)
var _wrs_conf_CASAttributes = 'width=640, height=480, scroll=no, resizable=yes';		// Specifies WIRIS CAS window options

var _wrs_conf_createimagePath = 'pluginwiris/integration/createimage.php';			// Specifies where is createimage script
var _wrs_conf_createcasimagePath = 'pluginwiris/integration/createcasimage.php';	// Specifies where is createcasimage script

/* Vars */
var _wrs_int_temporalTargetPrefix;
var _wrs_int_window;
var _wrs_int_window_opened = false;
var _wrs_int_temporalImageResizing;

/* Plugin integration */
(function () {
	tinymce.create('tinymce.plugins.tinyWIRIS', {
		init: function (editor, url) {
			editor.addCommand('tinyWIRIS_openFormulaEditor', function() {
				alert("julai");
			});

			editor.addButton('tinyWIRIS_formulaEditor', {
				title: 'Formula Editor',
				cmd: 'tinyWIRIS_openFormulaEditor',
				image: url + '/core/wiris-formula.gif'
			});

			/*alert("LOL");
			editor.addCommand('wrs_addFormula', function() {
				alert('omg');
				//wrs_int_openNewFormulaEditor(editor._iframe);
			});

			editor.addButton('addFormula', {
				title: 'tinyWIRIS.tinyWIRIS_desc',
				cmd: 'wrs_addFormula'
			});
			*/
		},

		getInfo: function () {
			return {
				longname : 'tinyWIRIS',
				author : 'Juan Lao Tebar - Maths for More',
				authorurl : 'http://www.wiris.com',
				infourl : 'http://www.mathsformore.com',
				version : '1.0'
			};
		}
	});

	tinymce.PluginManager.add('tinyWIRIS', tinymce.plugins.tinyWIRIS);
})();
