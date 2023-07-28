# Build WordPress MathType back-end

The WordPress MathType plugin can be build with a php back-end service.

## Add the server-side code

1. Navigate to https://store.wiris.com/en/products/downloads/mathtype/integrations.
2. Go to the `MathType MathType for TinyMCE 5` section.
3. Download the integration for the `PHP Servers`.
4. Unzip the downloaded file.
5. Copy to `wp-includes/js/tinymce/plugins/tiny_mce_wiris`: 
    * The integration folder. 
    * The configuration.ini file.

## Update the server-side code

1. Go to the `webpack.config.js`.
2. Replace the plugins section of the config variable for the commented section with the title `Use the local integration services`.

    > To go back to using the cloud services, replace the plugins section of the config variable for the commented section with the title `Use the cloud integration services`.

3. Update the code to use the back-end local services, using the following commands:

    ```sh
    html-integrations$ yarn install
    html-integrations$ nx build wordpress
    ``` 

    > This will also automatically update the code on the Docker containers, if they're up.

4. Replace the `plugin.js` and `plugin.min.js` from `wp-includes/js/tinymce/plugins/tiny_mce_wiris` with the ones on the `mathtype-wordpress/build` folder.