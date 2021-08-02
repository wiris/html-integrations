The following instructions allows to customizate MathType Web Integration services TinyMCE 4.

## Install instructions

### Java
To install the Java services follow the steps below:
1. Download the [MathType Web Integration Services - Java](https://store.wiris.com/en/products/downloads/mathtype/integrations) package.
2. Deploy the **pluginwiris_engine war** file.
3. Add the following attribute to TinyMCE configuration:
    ```js
    tinymce.init({
        mathTypeParameters : {
            serviceProviderProperties : {
                URI : '/pluginwiris_engine/app/configurationjs',
                server : 'java'
            }
        }
	}

    ```

### PHP
To install the PHP services follow the steps below:
1. Download the [MathType Web Integration Services - PHP](https://store.wiris.com/en/products/downloads/mathtype/integrations) package.
2. Copy the generic_wiris/integration folder into your project. For this example we are assuming that the services are located at DOCUMENT_ROOT/php-services/
3. Add the following attribute to TinyMCE configuration:
    ```js
    tinymce.init({
        mathTypeParameters : {
            serviceProviderProperties : {
                URI : 'http://localhost/php-services/integration',
                server : 'php'
            }
        }
	}
    ```

### .NET
To install the PHP services follow the steps below:
1. Download the [MathType Web Integration Services - Aspx](https://store.wiris.com/en/products/downloads/mathtype/integrations) package.
2. Copy the generic_wiris/integration folder into your project. For this example we are assuming that the services are located at DOCUMENT_ROOT/aspx-services/
3. Add the following attribute to TinyMCE configuration:
    ```js
    tinymce.init({
        mathTypeParameters : {
            serviceProviderProperties : {
                URI : 'http://localhost/aspx-services/integration',
                server : 'aspx'
            }
        }
	}
    ```

### Ruby on Rails

To install the Ruby on Rails services follow the steps below:
1. Download the [MathType Web Integration Services - Ruby on Rails](https://store.wiris.com/en/products/downloads/mathtype/integrations) package.
2. Instal the **wirispluginengine.gem** gem.
    ```
        gem install -l wirispluginengine.gem
    ```
3. Add the following attribute to TinyMCE configuration:
    ```js
    tinymce.init({
        mathTypeParameters : {
            serviceProviderProperties : {
                URI : '/wirispluginengine/integrationn',
                server : 'ruby'
            }
        }
    }
    ```
