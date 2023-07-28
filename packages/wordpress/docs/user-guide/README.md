### MathType for WordPress

The MathType integration for WordPress works with the TinyMCE Classic editor.

The MathType for WordPress plugin consists in:
* A minified compiled file, `plugin.min.js`, for the integration. It'll be the default used ti add MathType to WordPress.
* A compiled file, `plugin.js`, for debugging purposes.
* The icons of the MathType and ChemType that'll be used on the toolbar.
* A VERSION file with the plugin's version.

#### Requirements

* WordPress 3.0 or higher installed.
* TinyMCE as text editor (also known as Classic). WordPress versions earlier than 5.0 use it as default.
* A valid license to install the integration in a production environment; otherwise, you can use the downloaded file just for demo purposes.
* The following two packages must be downloaded:
    * MathType integration for WordPress (php)
    * MathType integration for TinyMCE 5 (js)

#### Installation

1. Unzip the MathType integration for WordPress (php) package and add the `tiny_mce_wiris.php` inside the `/wp-content/plugins` WordPress folder.
2. Create a folder called `tiny_mce_wiris` inside the `/wp-includes/js/tinymce/plugins` WordPress directory.
3. Unzip the MathType integration for TinyMCE 5 (js) package and add all its files inside the `/wp-includes/js/tinymce/plugins/tiny_mce_wiris` previously created directory.
4. Activate WordPress MathType integration in your WordPress plugins administration.
5. Include `WIRISplugins.js` script in the `header.php` file of your theme right before the `</head>` closing tag. As follows:
    ```php
    <script src="<?php echo get_option('home');?>/wp-includes/js/tinymce/plugins/tiny_mce_wiris/integration/WIRISplugins.js?viewer=image" type="text/javascript"></script>
    ```

#### Other configurations

* If you stored the MathType for WordPress integration in a different route than the one mentioned above, modify the route inside the `wrs_addPlugin` function on the `tiny_mce_wiris.php` file, to math the route where you placed the integration.
* If you want to use the compiled file for debugging purposes, replace the `plugin.min.js` for `plugin.js` text inside the `wrs_addPlugin` function on the `tiny_mce_wiris.php` file. This will make WordPress use the debugging file.

#### Integration/Back-end services

By default, MathType integrations are configured to use our cloud integration/server services. Visit the overview page for more details <<LINK>>

En el link del backend, si hi ha algun apartat de wordpress s'ha d'explicar els permisos que s'han de donar, com configurar el config.ini, el testing, clean & backup. Tot això es pot seguir de l'actual pagina de wordpress.

#### Additional information

* For more information on the MathType integration for TinyMCE, take a look at the [official documentation](https://docs.wiris.com/mathtype/en/mathtype-integrations/mathtype-for-html-editors/mathtype-for-tinymce.html).

#### Using MathType ion WordPress

> Note: Some WordPress versions may add line breaks around formula images. This is related to WordPress default `wpautop` filter. You can disable `wpautop` behavior using an [integration like this](https://wordpress.org/plugins/toggle-wpautop/) or you can enable the image mode in our plugin.

The process described below covers both WordPress pages and WordPress posts. The process is the same. We further assume you are using **WordPress 5.0 or later**, but other than the mention of the block editor, the process is the same for earlier WordPress versions.

##### Write an equation

> **This process will not work** with the standard WordPress installation. You must have either the TinyMCE Advanced plugin or the Classic Editor plugin installed (or both).

If you have the Classic Editor plugin installed, and are using Classic mode to write/edit the page, skip step 1 and proceed with step 2. These steps will assume you're working with the TinyMCE Advanced editor.

1. To add an equation to a post, add a Classic Paragraph block by clicking the keyboard icon on the page:

![Add Classic Block](https://docs.wiris.com/mathtype/en/image/uuid-d98a4053-a753-592d-c561-2b0efb0df1ac.png)

2. Click the MathType or ChemType button on the Classic toolbar to open the editor:

![MT/CT editor](https://docs.wiris.com/mathtype/en/image/uuid-22c8e3a4-198b-89af-330a-78307e09b03e.png)

3. Create the equation and click OK to insert it into the paragraph:

##### Edit an equation

1. Select the formula you want to edit, then open MathType/ChemType by clicking the button on the toolbar. You can also double-click the formula, and the MathType/ChemType editor will automatically open.

2. Make the changes to the formula, then click OK to save the changes to the post.

![Edit formula](https://docs.wiris.com/mathtype/en/image/uuid-35b7e66b-c947-9c18-dbfb-da2777382a28.png)