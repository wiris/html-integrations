
MathType Web for Generic integration [![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/wirismath)
===================================

MathType Web is a WYSIWYG editor to edit math equations and chemistry formulas. This package allows to integrate MathType Web into a *contenteditable* area.

![MathType for Froala screenshot](http://docs.wiris.com/_media/en/mathtype/mathtype_web/using_webpage.png?w=600&tok=e85cb3)

## Getting started
The following example shows how to integrate MathType Web into a *contenteditable* element. You may adjust the parameters depending on your integration. In order to clarify, the example below only contains two *div* elements: one for the content and another one to place the toolbar icons.

1. Create a index.html file and copy the following code:
    ```html
    <html>
        <body>
            <div id="editorContainer">
                <div id="toolbarLocation"></div>
                <div id="example" contenteditable="true">Try me!</div>
            </div>
        </body>
    </html>
    ```

2. Install the npm module:
    ```
    npm install @wiris/mathtype-generic
    ```
2. Load the module into your project. In the previous example add the following code to the head of the html file:
    ```html
    <head>
        <script> src="./node_modules/@wiris/mathtype-generic/wirisplugin-generic.js">
        </script>
    </head>
    ```
3. Create an instance of GenericIntegration class. In the previous example add the following code to the footer of the html file:
    ```html
    <footer>
        <script>
            var genericIntegrationProperties = {};
            genericIntegrationProperties.target = document.getElementById("example");
            genericIntegrationProperties.toolbar = document.getElementById("toolbarLocation");

            // GenericIntegration instance.
            var genericIntegrationInstance = new WirisPlugin.GenericIntegration(genericIntegrationProperties);
            genericIntegrationInstance.init();
            genericIntegrationInstance.listeners.fire('onTargetReady', {});
        </script>
    </footer>
    ```
    Notice that the example is assuming that you have the following directory structure.

    ```
    project
    └───index.html
    └───node_modules
        └───@wiris/mathtype-generic
    ```
