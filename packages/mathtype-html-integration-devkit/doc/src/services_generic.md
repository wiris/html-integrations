The following instructions allows to customizate MathType Web Integration services for a custom editor. This instructions assumes that a custom editor is configured following the [Getting started](./tutorial-getting_started.html) guide.

## Install instructions

### Java
To install the Java services follow the steps below:
1. Download the [MathType Web Integration Services - Java](http://www.wiris.com/en/plugins/services/download) package.
2. Deploy the **pluginwiris_engine war** file.
3. Add the following line to genericIntegrationProperties before create the new instance of GenericIntegration class:
    ```js
    genericIntegrationProperties.serviceProviderProperties = {};
    genericIntegrationProperties.serviceProviderProperties.URI = '/pluginwiris_engine/app/configurationjs';
    genericIntegrationProperties.serviceProviderProperties.server = 'java';

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

### PHP
To install the PHP services follow the steps below:
1. Download the [MathType Web Integration Services - PHP](http://www.wiris.com/en/plugins/services/download) package.
2. Copy the generic_wiris/integration folder into your project. For this example we are assuming that the services are located at DOCUMENT_ROOT/php-services/
3. Add the following line to genericIntegrationProperties before create the new instance of GenericIntegration class:
    ```js
    genericIntegrationProperties.serviceProviderProperties = {};
    genericIntegrationProperties.serviceProviderProperties.URI = 'http://localhost/php-services/integration';
    genericIntegrationProperties.serviceProviderProperties.server = 'php';
    ```
    In the previous example the JavaScript code should be the following:
    ```js
    <script>
        var genericIntegrationProperties = {};
        genericIntegrationProperties.target = document.getElementById("example");
        genericIntegrationProperties.toolbar = document.getElementById("toolbarLocation");
        // Load PHP services.
        genericIntegrationProperties.configurationService = 'http://localhost/php-services/integration';

        // GenericIntegration instance.
        var genericIntegrationInstance = new WirisPlugin.GenericIntegration(genericIntegrationProperties);
        genericIntegrationInstance.init();
        genericIntegrationInstance.listeners.fire('onTargetReady', {});
    </script>
    ```

### .NET
To install the PHP services follow the steps below:
1. Download the [MathType Web Integration Services - Aspx](http://www.wiris.com/en/plugins/services/download) package.
2. Copy the generic_wiris/integration folder into your project. For this example we are assuming that the services are located at DOCUMENT_ROOT/aspx-services/
3. Add the following line to genericIntegrationProperties before create the new instance of GenericIntegration class:
    ```js
    genericIntegrationProperties.serviceProviderProperties = {};
    genericIntegrationProperties.serviceProviderProperties.URI = 'http://localhost/aspx-services/integration';
    genericIntegrationProperties.serviceProviderProperties.server = 'aspx';
    ```
    In the previous example the JavaScript code should be the following:
    ```js
    <script>
        var genericIntegrationProperties = {};
        genericIntegrationProperties.target = document.getElementById("example");
        genericIntegrationProperties.toolbar = document.getElementById("toolbarLocation");
        // Load PHP services.
        genericIntegrationProperties.configurationService = 'http://localhost/aspx-services/integration';

        // GenericIntegration instance.
        var genericIntegrationInstance = new WirisPlugin.GenericIntegration(genericIntegrationProperties);
        genericIntegrationInstance.init();
        genericIntegrationInstance.listeners.fire('onTargetReady', {});
    </script>
    ```

### Ruby on Rails

To install the Ruby on Rails services follow the steps below:
1. Download the [MathType Web Integration Services - Ruby on Rails](http://www.wiris.com/en/plugins/services/download) package.
2. Instal the **wirispluginengine.gem** gem.
    ```
        gem install -l wirispluginengine.gem
    ```
3. Add the following line to genericIntegrationProperties before create the new instance of GenericIntegration class:
    ```js
    genericIntegrationProperties.configurationService = '';
    genericIntegrationProperties.serviceProviderProperties = {};
    genericIntegrationProperties.serviceProviderProperties.URI = '/wirispluginengine/integration';
    genericIntegrationProperties.serviceProviderProperties.server = 'ruby';
    ```
    In the previous example the JavaScript code should be the following:
    ```js
    <script>
        var genericIntegrationProperties = {};
        genericIntegrationProperties.target = document.getElementById("example");
        genericIntegrationProperties.toolbar = document.getElementById("toolbarLocation");
        // Load Ruby on Rails services.
        genericIntegrationProperties.configurationService = '/wirispluginengine/integration/';

        // GenericIntegration instance.
        var genericIntegrationInstance = new WirisPlugin.GenericIntegration(genericIntegrationProperties);
        genericIntegrationInstance.init();
        genericIntegrationInstance.listeners.fire('onTargetReady', {});
    </script>    ```
