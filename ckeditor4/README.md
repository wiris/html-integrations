MathType WEB for CKEDITOR4 [![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/wirismath)
===================================

MathType is a WYSIWYG editor to edit math equations and chemistry formulas.

![MathType for CKEditor4 screenshot](http://www.wiris.com/system/files/attachments/1202/CKEditor_editor_plugin.png)

## Installation
### CDN
If you want to use MathType using CKEditor from a CDN, please follow the steps bellow:
1. Create a index.html file and copy the following code:
    ```html
    <!DOCTYPE html>
    <html>
    	<head>
    		<meta charset="utf-8">
    		<title>MathType CKEDditor4 demo</title>
    		<script src="https://cdn.ckeditor.com/4.10.1/standard/ckeditor.js">
    		</script>
    	</head>
    	<body>
    		<textarea name="example">
    		</textarea>
    		<script>
    			CKEDITOR.plugins.addExternal('ckeditor_wiris', 'http://localhost/project/node_modules/@wiris/mathtype-lib-ckeditor4/', 'plugin.js');
    			CKEDITOR.replace( 'example',
    			 {
    				extraPlugins: 'ckeditor_wiris',
    				// Allow MathML content.
    				allowedContent : true,
                } );
    		</script>
    	</body>
    </html>
    ```
2. npm install @wiris/mathtype-lib-ckeditor4
    The example is assuming that you have the following directory structure. You may to have to adjust the plugin path.
    ```
    project
    └───index.html
    └───node_modules
        └───@wiris/mathtype-lib-editor4
    ```
### Local
1. npm install @wiris/mathtype-lib-ckeditor4
2. Add the plugins as an external plugin
    ```js
    CKEDITOR.plugins.addExternal('ckeditor_wiris', '../node_modules/@wiris/mathtype-lib-ckeditor4/', 'plugin.js');
    ```
3. Enable the plugin
    ```js
    config.extraPlugins = 'ckeditor_wiris';
    ```
4. Allow MathML specification
    ```js
    config.allowedContent : true
    ```
    The example is assuming that you have the following directory structure. You may to have to adjudst the plugin path.
    ```
    └───ckeditor
    │   └───config.js
    └───node_modules
        └───@wiris/mathtype-lib-clkeditor4
    ```