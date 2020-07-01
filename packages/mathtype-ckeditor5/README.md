MathType for CKEditor 5 [![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/wirismath)
===

Type and handwrite mathematical notation with MathType.

Easily include quality math equations in your documents and digital content.

![MathType for CKEditor 5 screenshot](http://www.wiris.com/portal/themes/wiris_com/img/others/ckeditor_plugin_npm.png)

# Table of Contents

- [Install instructions](#install-instructions)
- [Services](#services)
- [Documentation](#documentation)
- [Displaying on Target Page](#displaying-on-target-page)
- [Privacy policy](#privacy-policy)

## Install instructions

1. Install the npm module:

   ```
   npm install @wiris/mathtype-ckeditor5
   ```

2. Update the CKEditor configuration by adding the new plugin and including the MathType and ChemType buttons:

   ```js
   import MathType from '@wiris/mathtype-ckeditor5/src/plugin';

   ...

   ClassicEditor
        .create( editorElement, {
            plugins: [ ..., MathType, ... ],
            toolbar: {
                items: [
                    ...
                    'MathType',
                    'ChemType',
                    ...
                ]
            },
   ```

## Services

This npm module uses remotely hosted services to render MathML data. In case of wanting to install these services on your own backend, please contact <support@wiris.com>.

[comment]: <> (TODO: fill this section when the documentation is ready)

## Displaying on Target Page

In order to display mathematical formulas on the target page, i.e. the page where content produced by the HTML editor will be visible, the target page needs to include the [MathType script](https://docs.wiris.com/en/mathtype/mathtype_web/integrations/mathml-mode#add_a_script_to_head). For example for the default setting this would be:
```html
<script src="https://wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image"></script>
```

## Documentation

To find out more information about MathType, please go to the following documentation:

[comment]: <> (TODO: link to install instructions)
* [MathType documentation](http://docs.wiris.com/en/mathtype/mathtype_web/start)
* [Introductory tutorials](http://docs.wiris.com/en/mathtype/mathtype_web/intro_tutorials)
* [Service customization](http://docs.wiris.com/en/mathtype/mathtype_web/integrations/config-table)
* [Testing](http://docs.wiris.com/en/mathtype/mathtype_web/integrations/html/plugins-test)

## Privacy policy

The [MathType Privacy Policy](http://www.wiris.com/mathtype/privacy-policy) covers the data processing operations for the MathType users. It is an addendum of the company’s general Privacy Policy and the [general Privacy Policy](https://wiris.com/en/privacy-policy) still applies to MathType users.
