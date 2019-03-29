# Getting started
The following example shows how to integrate MathType into an editable HTMLElement. The integration consists of two steps: loading a JavaScript file and initialize the plugin into the editable HTMLElement.

To integrate MathType, please follow the steps below (you may adjust the example parameters of the example below depending on your integration):

1. Create a new HTML file with two HTMLElements, one for the editable area and the other one for the toolbar:
    ```html
    <html>
        <body>
            <div id="toolbarLocation"></div>
            <div id="example" contenteditable="true">Try me!</div>
        </body>
    </html>
    ```

2. Install the npm module:
    ```
    npm install @wiris/mathtype-generic
    ```

3. Load the module into your project by adding the following code to the **head** of the HTML file:
    ```html
    <head>
        <script src="./node_modules/@wiris/mathtype-generic/wirisplugin-generic.js"></script>
    </head>
    ```
4. Create an instance of GenericIntegration class. In the previous example add the following before closing the body tag:
    ```html
    <script>
        var genericIntegrationProperties = {};
        genericIntegrationProperties.target = document.getElementById("example");
        genericIntegrationProperties.toolbar = document.getElementById("toolbarLocation");

        // GenericIntegration instance.
        var genericIntegrationInstance = new WirisPlugin.GenericIntegration(genericIntegrationProperties);
        genericIntegrationInstance.init();
        genericIntegrationInstance.listeners.fire('onTargetReady', {});
    </script>
    ```
    This is the main step of the integration, doing the following:
    * Appends two toolbar buttons, one for the math editor and the other one for the chem editor, to the toolbar div. It allows to open both, math and chemistry editors.
    * Inits the integration into the editable HTMLElement. This add new events to the HTMLElement (to open the created formula by double-click, for example) and allows MathType editor to insert formulas into it.

    You may change **target** and **toolbar** parameters depending on the structure of your HTML editor.
    * The **target** property expects the HTMLElement edit area. This parameter is mandatory.
    * The **toolbar** property expects the HTMLElement which contains the toolbar. This parameter is not mandatory.

The complete HTML code of the previuos example is the following:
```html
<html>
    <head>
        <meta charset="utf-8">
        <script src="./node_modules/@wiris/mathtype-generic/wirisplugin-generic.js"></script>
    </head>
    <body>
        <div id="editorContainer">
            <div id="toolbarLocation"></div>
            <div id="example" contenteditable="true">Try me!</div>
        </div>
    </body>
    <script>
    /**
     * @type {integrationModelProperties}
     */
    var genericIntegrationProperties = {};
    genericIntegrationProperties.target = document.getElementById("example");
    genericIntegrationProperties.toolbar = document.getElementById("toolbarLocation");

    // GenericIntegration instance.
    var genericIntegrationInstance = new WirisPlugin.GenericIntegration(genericIntegrationProperties);
    genericIntegrationInstance.init();
    genericIntegrationInstance.listeners.fire('onTargetReady', {});
    </script>
</html>
```

Notice that the example is assuming that you have the following directory structure and the plugin path may be adjusted:
```
project
./index.html
./node_modules
    @wiris/mathtype-generic
```


