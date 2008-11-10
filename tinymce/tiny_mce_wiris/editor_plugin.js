(function() {
	tinymce.create('tinymce.plugins.tinyWIRIS', {
		init : function (editor, url) {
			editor.addCommand('wrs_addFormula', function() {
				alert('omg');
				//wrs_int_openNewFormulaEditor(editor._iframe);
			});

			/*editor.addButton('addFormula', {
				title: 'tinyWIRIS.tinyWIRIS_desc',
				cmd: 'wrs_addFormula'
			});*/
			editor.addButton('emotions', {title : 'emotions.emotions_desc', cmd : 'wrs_addFormula'});
		},

		getInfo : function() {
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