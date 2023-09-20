The following instructions show how to configure a generic integration to use custom MathType Web integration services. These instructions assume that a custom editor is being configured following the [Getting started](./tutorial-getting_started.html) guide.

## Install instructions

### Java
To install the Java services follow the steps below:
1. Download the [MathType Web Integration Services - Java](https://store.wiris.com/en/products/downloads/mathtype/integrations#froala?utm_source=npmjs&utm_medium=referral) package.
2. Deploy the **pluginwiris_engine war** file.
3. Add the following to genericIntegrationProperties before creating the new instance of genericIntegration class:
    ```js
    genericIntegrationProperties.serviceProviderProperties = {};
    genericIntegrationProperties.serviceProviderProperties.URI = '<app-server>/pluginwiris_engine/app/configurationjs';
    genericIntegrationProperties.serviceProviderProperties.server = 'java';
    ```
    In the previous example the JavaScript code should be the following:
    ```js
    <script>
        var genericIntegrationProperties = {};
        genericIntegrationProperties.target = document.getElementById("example");
        genericIntegrationProperties.toolbar = document.getElementById("toolbarLocation");

        // Load Java services
        genericIntegrationProperties.serviceProviderProperties = {};
        genericIntegrationProperties.serviceProviderProperties.URI = '<app-server>/pluginwiris_engine/app/configurationjs';
        genericIntegrationProperties.serviceProviderProperties.server = 'java';

        // genericIntegration instance
        var genericIntegrationInstance = new WirisPlugin.GenericIntegration(genericIntegrationProperties);
        genericIntegrationInstance.init();
        genericIntegrationInstance.listeners.fire('onTargetReady', {});

        WirisPlugin.currentInstance = genericIntegrationInstance;
    </script>
    ```

### PHP
To install the PHP services follow the steps below:
1. Download the [MathType Web Integration Services - PHP](https://store.wiris.com/en/products/downloads/mathtype/integrations) package.
2. Extract all files into a directory in the web server's DocumentRoot.
3. Add the following to genericIntegrationProperties before creating the new instance of genericIntegration class:
    ```js
    genericIntegrationProperties.serviceProviderProperties = {};
    genericIntegrationProperties.serviceProviderProperties.URI = '<app-server>/<path-to-php-services>/integration';
    genericIntegrationProperties.serviceProviderProperties.server = 'php';
    ```
    In the previous example the JavaScript code should be the following:
    ```js
    <script>
        var genericIntegrationProperties = {};
        genericIntegrationProperties.target = document.getElementById("example");
        genericIntegrationProperties.toolbar = document.getElementById("toolbarLocation");

        // Load PHP services
        genericIntegrationProperties.serviceProviderProperties = {};
        genericIntegrationProperties.serviceProviderProperties.URI = '<app-server>/<path-to-php-services>/integration';
        genericIntegrationProperties.serviceProviderProperties.server = 'php';

        // genericIntegration instance
        var genericIntegrationInstance = new WirisPlugin.GenericIntegration(genericIntegrationProperties);
        genericIntegrationInstance.init();
        genericIntegrationInstance.listeners.fire('onTargetReady', {});

        WirisPlugin.currentInstance = genericIntegrationInstance;
    </script>
    ```

### .NET
To install the .NET services follow the steps below:
1. Download the [MathType Web Integration Services - Aspx](https://store.wiris.com/en/products/downloads/mathtype/integrations) package.
2. Install the application in IIS.
3. Add the following line to genericIntegrationProperties before creating the new instance of genericIntegration class:
    ```js
    genericIntegrationProperties.serviceProviderProperties = {};
    genericIntegrationProperties.serviceProviderProperties.URI = '<app-server>/<path-to-aspx-services>/integration';
    genericIntegrationProperties.serviceProviderProperties.server = 'aspx';
    ```
    In the previous example the JavaScript code should be the following:
    ```js
    <script>
        var genericIntegrationProperties = {};
        genericIntegrationProperties.target = document.getElementById("example");
        genericIntegrationProperties.toolbar = document.getElementById("toolbarLocation");

        // Load .NET services
        genericIntegrationProperties.serviceProviderProperties = {};
        genericIntegrationProperties.serviceProviderProperties.URI = '<app-server>/<path-to-aspx-services>/integration';
        genericIntegrationProperties.serviceProviderProperties.server = 'aspx';

        // genericIntegration instance
        var genericIntegrationInstance = new WirisPlugin.GenericIntegration(genericIntegrationProperties);
        genericIntegrationInstance.init();
        genericIntegrationInstance.listeners.fire('onTargetReady', {});

        WirisPlugin.currentInstance = genericIntegrationInstance;
    </script>
    ```

### Ruby on Rails
To install the Ruby on Rails services follow the steps below:
1. Download the [MathType Web Integration Services - Ruby on Rails](https://store.wiris.com/en/products/downloads/mathtype/integrations) package.
2. Install the **wirispluginengine.gem** gem.
    ```
        gem install -l wirispluginengine.gem
    ```
3. Add the following line to genericIntegrationProperties before creating the new instance of genericIntegration class:
    ```js
    genericIntegrationProperties.serviceProviderProperties = {};
    genericIntegrationProperties.serviceProviderProperties.URI = '<app-server>/wirispluginengine/integration';
    genericIntegrationProperties.serviceProviderProperties.server = 'ruby';
    ```
    In the previous example the JavaScript code should be the following:
    ```js
    <script>
        var genericIntegrationProperties = {};
        genericIntegrationProperties.target = document.getElementById("example");
        genericIntegrationProperties.toolbar = document.getElementById("toolbarLocation");

        // Load Ruby on Rails services
        genericIntegrationProperties.serviceProviderProperties = {};
        genericIntegrationProperties.serviceProviderProperties.URI = '<app-server>/wirispluginengine/integration';
        genericIntegrationProperties.serviceProviderProperties.server = 'ruby';

        // genericIntegration instance
        var genericIntegrationInstance = new WirisPlugin.GenericIntegration(genericIntegrationProperties);
        genericIntegrationInstance.init();
        genericIntegrationInstance.listeners.fire('onTargetReady', {});

        WirisPlugin.currentInstance = genericIntegrationInstance;
    </script>
    ```
