# Build WordPress MathType plugin

The WordPress MathType plugin is an integration for TinyMCE 4.x.

## Build folder structure

- `icons`. Set of images for the toolbar MathType and ChemType buttons.
- `plugin.js`. The not minified compiled file, for debugging purposes.
- `plugin.min.js` Compiled file that'll be used for the integration.

## Update the client-side code

The client-side source code is located inside the folder:

```
packages/tinymce5/
```

To update new changes, use the following commands:

```sh
html-integrations$ yarn
html-integrations$ nx build wordpress 
```

> This will also automatically update the code on the Docker containers, if they're up.