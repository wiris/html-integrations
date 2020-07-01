MathType generic integration [![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/wirismath)
===

Type and handwrite mathematical notation with MathType.

Easily include quality math equations in your documents and digital content.

![MathType generic integration screenshot](http://docs.wiris.com/_media/en/mathtype/mathtype_web/using_webpage.png?w=600&tok=e85cb3)

# Table of contents

- [Getting started](#getting-started)
- [Parsing data](#parsing-data)
  * [Setting data](#setting-data)
  * [Getting data](#getting-data)
- [Services](#services)
  * [Install instructions](#install-instructions)
    * [Java](#java)
    * [PHP](#php)
    * [ASP .NET](#asp-net)
    * [Ruby on Rails](#ruby-on-rails)
- [Displaying on Target Page](#displaying-on-target-page)
- [Documentation](#documentation)
- [Privacy policy](#privacy-policy)

## Getting started

The following example shows how to integrate MathType into an editable HTML element. The integration consists of two steps: loading a JavaScript file and initializing the plugin into the editable HTML element.

To integrate MathType, please follow the steps below. Please, note you may adjust the example parameters of the example below depending on your integration.

1. Create a new HTML file with two HTML elements, one for the editable area and another for the toolbar:

   ```html
   <html>
     <body>
       <div id="toolbar"></div>
       <div id="htmlEditor" contenteditable="true">Try me!</div>
     </body>
   </html>
   ```

2. Install the npm module:

   ```
   npm install @wiris/mathtype-generic
   ```

3. Load the module into your project by adding the following code at the **head** of the document:

   ```html
   <head>
     <script src="node_modules/@wiris/mathtype-generic/wirisplugin-generic.js"></script>
   </head>
   ```

4. Add the following code just before closing the body tag:

   ```html
   <script>
     var genericIntegrationProperties = {};
     genericIntegrationProperties.target = document.getElementById('htmlEditor');
     genericIntegrationProperties.toolbar = document.getElementById('toolbar');

     // GenericIntegration instance.
     var genericIntegrationInstance = new WirisPlugin.GenericIntegration(genericIntegrationProperties);
     genericIntegrationInstance.init();
     genericIntegrationInstance.listeners.fire('onTargetReady', {});
   </script>
   ```

   This is the main step of the integration. It does the following:

   * Appends two buttons to the toolbar `div`, one for the math editor and another for the chemistry editor.
   * Initializes the integration into the editable HTML element, assigning listeners to some events of the HTML element. This allows, for instance, to open a formula just by double-clicking it. You may change **target** and **toolbar** parameters depending on the structure of your HTML editor.
   * The **target** property must contain the editable HTML element. This is a mandatory parameter.
   * The **toolbar** property must contain the HTML element representing the toolbar. This parameter is optional.

After following these steps, you should have something like this:

```html
<html>
  <head>
    <script src="node_modules/@wiris/mathtype-generic/wirisplugin-generic.js"></script>
  </head>
  <body>
    <div id="toolbar"></div>
    <div id="htmlEditor" contenteditable="true">Try me!</div>

    <script>
      var genericIntegrationProperties = {};
      genericIntegrationProperties.target = document.getElementById('htmlEditor');
      genericIntegrationProperties.toolbar = document.getElementById('toolbar');

      // GenericIntegration instance.
      var genericIntegrationInstance = new WirisPlugin.GenericIntegration(genericIntegrationProperties);
      genericIntegrationInstance.init();
      genericIntegrationInstance.listeners.fire('onTargetReady', {});
    </script>
  </body>
</html>
```

Notice the example assumes this directory structure:

```
└───index.html
└───node_modules
    └───@wiris/mathtype-generic
```

## Parsing data

By default, MathType stores equations and the formulas as **MathML**. However while editing, MathType converts all MathML into `img` tags rendered inside the editable HTML element.

### Setting data

Before setting the content of the editable HTML element, you must first convert all MathML into images by using the `Parser` class:

```js
htmlData = WirisPlugin.Parser.initParse(htmlData);
```

For instance, the following call:

```js
WirisPlugin.Parser.initParse('<span>hello!</span>  <math><mo>x</mo></math> goodbye');
```

Returns the following:

```html
<span>hello!</span>  <img style="max-width: none; vertical-align: -4px;" class="Wirisformula" src="data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Awrs%3D%22http%3A%2F%2Fwww.wiris.com%2Fxml%2Fcvs-extension%22%20height%3D%2219%22%20width%3D%2213%22%20wrs%3Abaseline%3D%2215%22%3E%3C!--MathML%3A%20%3Cmath%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F1998%2FMath%2FMathML%22%3E%3Cmo%3Ex%3C%2Fmo%3E%3C%2Fmath%3E--%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%2F%3E%3C%2Fdefs%3E%3Ctext%20font-family%3D%22Arial%22%20font-size%3D%2216%22%20text-anchor%3D%22middle%22%20x%3D%226.5%22%20y%3D%2215%22%3Ex%3C%2Ftext%3E%3C%2Fsvg%3E" data-mathml="«math»«mo»x«/mo»«/math»" alt="x" role="math" width="13" height="19" align="middle"/> goodbye
```

You can test this by adding the following JavaScript code at the end of `script` in our previous example:

```js
var htmlEditor = document.getElementById('htmlEditor');
var data = 'Initial data: <math><msqrt><mo>x</mo></msqrt></math>'
htmlEditor.innerHTML = WirisPlugin.Parser.initParse(data);
```

### Getting data

After retrieving the content of the editable HTML element, you must convert all images into MathML:

```js
htmlData = WirisPlugin.Parser.endParse(htmlData);
```

For instance, the following call:

```js
WirisPlugin.Parser.endParse('<span>hello!</span>  <img style="max-width: none; vertical-align: -4px;" class="Wirisformula" src="data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Awrs%3D%22http%3A%2F%2Fwww.wiris.com%2Fxml%2Fcvs-extension%22%20height%3D%2219%22%20width%3D%2213%22%20wrs%3Abaseline%3D%2215%22%3E%3C!--MathML%3A%20%3Cmath%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F1998%2FMath%2FMathML%22%3E%3Cmo%3Ex%3C%2Fmo%3E%3C%2Fmath%3E--%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%2F%3E%3C%2Fdefs%3E%3Ctext%20font-family%3D%22Arial%22%20font-size%3D%2216%22%20text-anchor%3D%22middle%22%20x%3D%226.5%22%20y%3D%2215%22%3Ex%3C%2Ftext%3E%3C%2Fsvg%3E" data-mathml="«math»«mo»x«/mo»«/math»" alt="x" role="math" width="13" height="19" align="middle"/> goodbye');
```

Returns the following:

```html
<span>hello!</span>  <math><mo>x</mo></math> goodbye
```

## Services

This npm module uses remotely hosted services to render MathML data. However, we recommend you install these services on your backend. This will allow you, among other things, to configure the service and to locally store the images generated by MathType.

The services are available for Java, PHP, .NET and Ruby on Rails. If you use any of these technologies, please download the plugin for your backend technology from [here](http://www.wiris.com/en/plugins3/generic/download).

### Install instructions

#### Java

To install the Java services, please, follow the steps below:

1. Download and extract [MathType for generic HTML editor - Java](http://www.wiris.com/en/plugins3/generic/download).

2. Deploy **pluginwiris_engine.war** in your Java application server (e.g., Tomcat or JBoss).

3. Set the following value for the `configurationService` property:

    ```js
    genericIntegrationProperties.configurationService = '/pluginwiris_engine/app/configurationjs';
    ```

    The previous example would end up like this:

    ```js
    <script>
      var genericIntegrationProperties = {};
      genericIntegrationProperties.target = document.getElementById('htmlEditor');
      genericIntegrationProperties.toolbar = document.getElementById('toolbar');

      // We just added this line:
      genericIntegrationProperties.configurationService = '/pluginwiris_engine/app/configurationjs';

      // GenericIntegration instance.
      var genericIntegrationInstance = new WirisPlugin.GenericIntegration(genericIntegrationProperties);
      genericIntegrationInstance.init();
      genericIntegrationInstance.listeners.fire('onTargetReady', {});
    </script>
    ```

#### PHP

To install the PHP services, please, follow the steps below:

1. Download and extract [MathType for generic HTML editor - PHP](http://www.wiris.com/en/plugins3/generic/download).

2. Copy the `generic_wiris/integration` directory into your project.

3. Set the following value for the `configurationService` property:

    ```js
    genericIntegrationProperties.configurationService = 'integration/configurationjs.php';
    ```

    The previous example would end up like this:

    ```js
    <script>
      var genericIntegrationProperties = {};
      genericIntegrationProperties.target = document.getElementById('htmlEditor');
      genericIntegrationProperties.toolbar = document.getElementById('toolbar');

      // We just added this line:
      genericIntegrationProperties.configurationService = 'integration/configurationjs.php';

      // GenericIntegration instance.
      var genericIntegrationInstance = new WirisPlugin.GenericIntegration(genericIntegrationProperties);
      genericIntegrationInstance.init();
      genericIntegrationInstance.listeners.fire('onTargetReady', {});
    </script>
    ```

#### ASP .NET

To install the ASP .NET services, please, follow the steps below:

1. Download and extract [MathType for generic HTML editor - ASP.NET](http://www.wiris.com/en/plugins3/generic/download).

2. Copy the `generic_wiris/integration` directory into your project.

3. Set the following value for the `configurationService` property:

    ```js
    genericIntegrationProperties.configurationService = 'integration/configurationjs.aspx';
    ```

    The previous example would end up like this:

    ```js
    <script>
      var genericIntegrationProperties = {};
      genericIntegrationProperties.target = document.getElementById('htmlEditor');
      genericIntegrationProperties.toolbar = document.getElementById('toolbar');

      // We just added this line:
      genericIntegrationProperties.configurationService = 'integration/configurationjs.aspx';

      // GenericIntegration instance.
      var genericIntegrationInstance = new WirisPlugin.GenericIntegration(genericIntegrationProperties);
      genericIntegrationInstance.init();
      genericIntegrationInstance.listeners.fire('onTargetReady', {});
    </script>
    ```

#### Ruby on Rails

To install the Ruby on Rails services, please, follow the steps below:

1. Download and extract [MathType for generic HTML editor - Ruby on Rails](http://www.wiris.com/en/plugins3/generic/download).

2. Install the **wirispluginengine.gem** gem.

    ```
    gem install -l wirispluginengine.gem
    ```

3. Set the following value for the `configurationService` property:

    ```js
    genericIntegrationProperties.configurationService = '/wirispluginengine/integration/configurationjs';
    ```

    The previous example would end up like this:

    ```js
    <script>
      var genericIntegrationProperties = {};
      genericIntegrationProperties.target = document.getElementById('htmlEditor');
      genericIntegrationProperties.toolbar = document.getElementById('toolbar');

      // We just added this line:
      genericIntegrationProperties.configurationService = '/wirispluginengine/integration/configurationjs';

      // GenericIntegration instance.
      var genericIntegrationInstance = new WirisPlugin.GenericIntegration(genericIntegrationProperties);
      genericIntegrationInstance.init();
      genericIntegrationInstance.listeners.fire('onTargetReady', {});
    </script>
    ```

## Displaying on Target Page

In order to display mathematical formulas on the target page, i.e. the page where content produced by the HTML editor will be visible, the target page needs to include the [MathType script](https://docs.wiris.com/en/mathtype/mathtype_web/integrations/mathml-mode#add_a_script_to_head). For example for the default setting this would be:
```html
<script src="https://wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image"></script>
```

## Documentation

To find out more information about MathType, please go to the following documentation:

* [MathType documentation](http://docs.wiris.com/en/mathtype/mathtype_web/start)
* [Introductory tutorials](http://docs.wiris.com/en/mathtype/mathtype_web/intro_tutorials)
* [Service customization](http://docs.wiris.com/en/mathtype/mathtype_web/integrations/config-table)
* [Testing](http://docs.wiris.com/en/mathtype/mathtype_web/integrations/html/plugins-test)

## Privacy policy

The [MathType Privacy Policy](http://www.wiris.com/mathtype/privacy-policy) covers the data processing operations for the MathType users. It is an addendum of the company’s general Privacy Policy and the [general Privacy Policy](https://wiris.com/en/privacy-policy) still applies to MathType users.
