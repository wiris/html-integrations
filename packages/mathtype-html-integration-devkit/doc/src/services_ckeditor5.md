The following instructions allows to customizate MathType Web Integration services CKEditor 5.

## Install instructions

### Java
To install the Java services follow the steps below:
1. Download the [MathType Web Integration Services - Java](http://www.wiris.com/en/plugins/services/download) package.
2. Deploy the **pluginwiris_engine war** file.
3. Add mathTypeParameters to CKEditor5 with the configuration below:
    ```js
    ClassicEditor.create( document.querySelector( '#example' ), {
            plugins: [ ..., MathType, ... ],
            toolbar: {
                items: [
                    ...,
                    'MathType',
                    'ChemType',
                    ...,
                ]
            },
            language: 'en',
            // MathType Parameters
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
1. Download the [MathType Web Integration Services - PHP](http://www.wiris.com/en/plugins/services/download) package.
2. Copy the generic_wiris/integration folder into your project. For this example we are assuming that the services are located at DOCUMENT_ROOT/php-services/
3. Add mathTypeParameters to CKEditor5 with the configuration below:
    ```js
    ClassicEditor.create( document.querySelector( '#example' ), {
            plugins: [ ..., MathType, ... ],
            toolbar: {
                items: [
                    ...,
                    'MathType',
                    'ChemType',
                    ...,
                ]
            },
            language: 'en',
            // MathType Parameters
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
1. Download the [MathType Web Integration Services - Aspx](http://www.wiris.com/en/plugins/services/download) package.
2. Copy the generic_wiris/integration folder into your project. For this example we are assuming that the services are located at DOCUMENT_ROOT/aspx-services/
3. Add mathTypeParameters to CKEditor5 with the configuration below:
    ```js
    ClassicEditor.create( document.querySelector( '#example' ), {
            plugins: [ ..., MathType, ... ],
            toolbar: {
                items: [
                    ...,
                    'MathType',
                    'ChemType',
                    ...,
                ]
            },
            language: 'en',
            // MathType Parameters
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
1. Download the [MathType Web Integration Services - Ruby on Rails](http://www.wiris.com/en/plugins/services/download) package.
2. Instal the **wirispluginengine.gem** gem.
    ```
        gem install -l wirispluginengine.gem
    ```
3. Add mathTypeParameters to CKEditor5 with the configuration below:
    ```js
    ClassicEditor.create( document.querySelector( '#example' ), {
            plugins: [ ..., MathType, ... ],
            toolbar: {
                items: [
                    ...,
                    'MathType',
                    'ChemType',
                    ...,
                ]
            },
            language: 'en',
            // MathType Parameters
            mathTypeParameters : {
                serviceProviderProperties : {
                    URI : '/wirispluginengine/integrationn',
                    server : 'ruby'
                }
            }
    }
    ```
