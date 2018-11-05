
MathType Web for CKEditor 4 [![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/wirismath)
===================================

MathType Web is a WYSIWYG editor to edit math equations and chemistry formulas. This package allows to integrate MathTYpe Web into CKEditor4.

![MathType for CKEditor4 screenshot](http://www.wiris.com/system/files/attachments/1202/CKEditor_editor_plugin.png)

## Install instructions

1. Install the npm module
    ```
    npm install @wiris/mathtype-ckeditor4
    ```

2. Add the plugin as an external plugin

    ```js
    CKEDITOR.plugins.addExternal('ckeditor_wiris', '../node_modules/@wiris/mathtype-lib-ckeditor4/', 'plugin.js');
    ```

3. Update the CKEditor configuration by adding the new plugin and allowing MathML content.

    ```js
		CKEDITOR.editorConfig = function(config)
 	{
		extraPlugins = 'ckeditor_wiris';
		// Allow MathML content.
		allowedContent = true;
	};
    ```

    The example is assuming that you have the following directory structure. You may to adjust the plugin path.

    ```
    └───index.html
    └───ckeditor
    └───node_modules
        └───@wiris/mathtype-ckeditor4
    ```
