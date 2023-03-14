MathType for CKEditor 5 [![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/wirismath)
===

Type and handwrite mathematical notation with MathType.

Easily include quality math equations in your documents and digital content.

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
<script src="https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image"></script>
```

## Documentation

To find out more information about MathType, please go to the following documentation:

[comment]: <> (TODO: link to install instructions)
* [MathType documentation](https://docs.wiris.com/en/mathtype/mathtype_web/start?utm_source=npmjs&utm_medium=referral)
* [Introductory tutorials](https://docs.wiris.com/en/mathtype/mathtype_web/intro_tutorials?utm_source=npmjs&utm_medium=referral)
* [Service customization](https://docs.wiris.com/en/mathtype/mathtype_web/integrations/config-table?utm_source=npmjs&utm_medium=referral)
* [Testing](https://docs.wiris.com/en/mathtype/mathtype_web/integrations/html/plugins-test?utm_source=npmjs&utm_medium=referral)
## Privacy policy

The [MathType Privacy Policy](https://www.wiris.com/en/mathtype-privacy-policy/?utm_source=npmjs&utm_medium=referral) covers the data processing operations for the MathType users. It is an addendum of the company’s general Privacy Policy and the [general Privacy Policy](https://www.wiris.com/en/privacy-policy?utm_source=npmjs&utm_medium=referral) still applies to MathType users.
