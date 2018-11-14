MathType for Generic integration [![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/wirismath)
===================================

MathType is a WYSIWYG editor to edit math equations and chemistry formulas. This package allows integrating MathType into a content editable HTMLElement.

![MathType for Generic screenshot](http://docs.wiris.com/_media/en/mathtype/mathtype_web/using_webpage.png?w=600&tok=e85cb3)

# Table of contents
- [Getting started](#getting-started)
- [Parsing data](#parsing-data)
    * [Loading data](#loading-data)
    * [Getting data](#getting-data)
- [Services](#services)
    * [Install instructions](#install-instructions)
        * [Java](#java)
        * [PHP](#php)
        * [Asp.net](#.NET)
        * [Ruby on Rails](#ruby-on-rails)
- [Documentation](#documentation)

## Getting started
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
4. Create an instance of *GenericIntegration* class. In the previous example add the following before closing the body tag:
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
└───index.html
└───node_modules
    └───@wiris/mathtype-generic
```



## Parsing data

MathType integration, by default, stores the content as MathML and render it into the editable HTMLElement as images. In order to load the MathML data into the edit you should use the **Parser** class:

```js
WirisPlugin.Parser
```


### Loading data
To load data into the edit area you should use the following method:
```js
WirisPlugin.Parser.initParse(htmlData);
```
For instance, the following call:
```js
WirisPlugin.Parser.initParse('<math><mo>x</mo></math');
```
Returns the following image:
```html
<img style="max-width: none; vertical-align: -4px;" class="Wirisformula" src="data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Awrs%3D%22http%3A%2F%2Fwww.wiris.com%2Fxml%2Fcvs-extension%22%20height%3D%2219%22%20width%3D%2213%22%20wrs%3Abaseline%3D%2215%22%3E%3C!--MathML%3A%20%3Cmath%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F1998%2FMath%2FMathML%22%3E%3Cmo%3Ex%3C%2Fmo%3E%3C%2Fmath%3E--%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%2F%3E%3C%2Fdefs%3E%3Ctext%20font-family%3D%22Arial%22%20font-size%3D%2216%22%20text-anchor%3D%22middle%22%20x%3D%226.5%22%20y%3D%2215%22%3Ex%3C%2Ftext%3E%3C%2Fsvg%3E" data-mathml="«math»«mo»x«/mo»«/math»" alt="x" role="math" width="13" height="19" align="middle"/>
```

If you add the following JavaScript code into the previous example:
```js
var htmlElement = document.getElementById('example');
var data = 'Initial data: <math><msqrt><mo>x</mo></msqrt></math>'
htmlElement.innerHTML = WirisPlugin.Parser.initParse(data);
```
The HTML data will be inserted into the edit area by replacing the MatML with its correspondent image.

### Getting data

To save the content of the editable HTMLElement you should use the following method:

```js
WirisPlugin.Parser.endParse(htmlContent);
```

This method returns the HTML content by replacing MathType images with its correspondent MathML.

For example:
```js
WirisPlugin.Parser.endParse('<img style="max-width: none; vertical-align: -4px;" class="Wirisformula" src="data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Awrs%3D%22http%3A%2F%2Fwww.wiris.com%2Fxml%2Fcvs-extension%22%20height%3D%2219%22%20width%3D%2213%22%20wrs%3Abaseline%3D%2215%22%3E%3C!--MathML%3A%20%3Cmath%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F1998%2FMath%2FMathML%22%3E%3Cmo%3Ex%3C%2Fmo%3E%3C%2Fmath%3E--%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%2F%3E%3C%2Fdefs%3E%3Ctext%20font-family%3D%22Arial%22%20font-size%3D%2216%22%20text-anchor%3D%22middle%22%20x%3D%226.5%22%20y%3D%2215%22%3Ex%3C%2Ftext%3E%3C%2Fsvg%3E" data-mathml="«math»«mo»x«/mo»«/math»" alt="x" role="math" width="13" height="19" align="middle"/>');
```
Returns the following:
```html
<math><mo>x</mo></math>
```

## Services

This npm module uses services remotely hosted to render MathML data. However, it is strongly recommended to install these services in your backend. This will allow you, among other things, to customize the backend service and store locally the images generated by MathType.

MathType integration services are available for the following technologies: Java, PHP, .NET and Ruby on Rails. You can download the appropiate services from [here](http://www.wiris.com/en/plugins3/generic/download).

### Install instructions

#### Java
To install the Java services follow the steps below:
1. Download the [MathTpe for generic HTML editor - Java](http://www.wiris.com/en/plugins3/generic/download) package.
2. Deploy the **pluginwiris_engine war** file.
3. Add the following line to genericIntegrationProperties before create the new instance of GenericIntegration class:
    ```js
    genericIntegrationProperties.configurationService = '/pluginwiris_engine/app/configurationjs';
    ```
    In the previous example the JavaScript code should be the following:
    ```js
    <script>
        var genericIntegrationProperties = {};
        genericIntegrationProperties.target = document.getElementById("example");
        genericIntegrationProperties.toolbar = document.getElementById("toolbarLocation");
        // Load Java services.
        genericIntegrationProperties.configurationService = '/pluginwiris_engine/app/configurationjs';

        // GenericIntegration instance.
        var genericIntegrationInstance = new WirisPlugin.GenericIntegration(genericIntegrationProperties);
        genericIntegrationInstance.init();
        genericIntegrationInstance.listeners.fire('onTargetReady', {});
    </script>

    ```
#### PHP
To install the PHP services follow the steps below:
1. Download the [MathTpe for generic HTML editor - PHP](http://www.wiris.com/en/plugins3/generic/download) package.
2. Copy the generic_wiris/integration folder into your project.
3. Add the following line to genericIntegrationProperties before create the new instance of GenericIntegration class:
    ```js
    genericIntegrationProperties.configurationService = '/integration/configurationjs.php';
    ```
    In the previous example the JavaScript code should be the following>
    ```js
    <script>
        var genericIntegrationProperties = {};
        genericIntegrationProperties.target = document.getElementById("example");
        genericIntegrationProperties.toolbar = document.getElementById("toolbarLocation");
        // Load PHP services.
        genericIntegrationProperties.configurationService = 'integration/configurationjs.php';

        // GenericIntegration instance.
        var genericIntegrationInstance = new WirisPlugin.GenericIntegration(genericIntegrationProperties);
        genericIntegrationInstance.init();
        genericIntegrationInstance.listeners.fire('onTargetReady', {});
    </script>
    ```
#### .NET
To install the .NET services follow the steps below:
1. Download the [MathTpe for generic HTML editor - ASP.NET](http://www.wiris.com/en/plugins3/generic/download) package.
2. Copy the generic_wiris/integration folder into your project.
3. Add the following line to genericIntegrationProperties before create the new instance of GenericIntegration class:
    ```js
    genericIntegrationProperties.configurationService = 'integration/configurationjs.aspx';
    ```
    In the previous example the JavaScript code should be the following>
    ```js
    <script>
        var genericIntegrationProperties = {};
        genericIntegrationProperties.target = document.getElementById("example");
        genericIntegrationProperties.toolbar = document.getElementById("toolbarLocation");
        // Load Aspx services.
        genericIntegrationProperties.configurationService = 'integration/configurationjs.aspx';

        // GenericIntegration instance.
        var genericIntegrationInstance = new WirisPlugin.GenericIntegration(genericIntegrationProperties);
        genericIntegrationInstance.init();
        genericIntegrationInstance.listeners.fire('onTargetReady', {});
    </script>
    ```
#### Ruby on Rails

To install the Ruby on Rails services follow the steps below:
1. Download the [MathTpe for generic HTML editor - Ruby on Rails](http://www.wiris.com/en/plugins3/generic/download) package.
2. Instal the **wirispluginengine.gem** gem.
    ```
        gem install -l wirispluginengine.gem
    ```
3. Add the following line to genericIntegrationProperties before create the new instance of GenericIntegration class:
    ```js
    genericIntegrationProperties.configurationService = '/wirispluginengine/integration/configurationjs';
    ```
    In the previous example the JavaScript code should be the following:
    ```js
    <script>
        var genericIntegrationProperties = {};
        genericIntegrationProperties.target = document.getElementById("example");
        genericIntegrationProperties.toolbar = document.getElementById("toolbarLocation");
        // Load Ruby on Rails services.
        genericIntegrationProperties.configurationService = '/wirispluginengine/integration/configurationjs';

        // GenericIntegration instance.
        var genericIntegrationInstance = new WirisPlugin.GenericIntegration(genericIntegrationProperties);
        genericIntegrationInstance.init();
        genericIntegrationInstance.listeners.fire('onTargetReady', {});
    </script>
    ```
## Documentation
To find out more information about MathType, please go to the following documentation:

* [MathType documentation](http://docs.wiris.com/en/mathtype/mathtype_web/start)
* [Introductory tutorials](http://docs.wiris.com/en/mathtype/mathtype_web/intro_tutorials)
* [Service customization](http://docs.wiris.com/en/mathtype/mathtype_web/integrations/config-table)
* [Testing](http://docs.wiris.com/en/mathtype/mathtype_web/integrations/html/plugins-test)

