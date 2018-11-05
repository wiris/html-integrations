
MathType for Froala [![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/wirismath)
===================================

MathType is a WYSIWYG editor to edit math equations and chemistry formulas. This package allows to integrate MathType Web into Froala.

![MathType for Froala screenshot](http://www.wiris.com/en/system/files/froala_wiris.png)

## Installation
If you want to use MathType WEB in Froala, please follow the steps bellow:

1. Install the npm module
    ```
    npm install @wiris/mathtype-froala
    ```
2. Load the module into your project
    ```js
    <script src="node_modules/@wiris/mathtype-froala/wiris.js"></script>
    ```
3. Update Froala configuration to add MathType and ChemType buttons to the toolbar
    ```js
    ${}.froalEditor({
    	toolbar = ['wirisEditor', 'wirisChemistry']
    })
    ```
4. Update Froala configuration to allow MathML specification
    ```js
    ${}.froalEditor({
    	htmlAllowedTags:  ['.*'],
    	htmlAllowedAttrs: ['.*'],
    })
    ```
    The example is assuming that you have the following directory structure. You may to adjust the plugin path.

    ```
    project
    └───node_modules
        └───@wiris/mathtype-lib-ckeditor4
    ```
