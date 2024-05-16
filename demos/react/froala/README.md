# Froala integration in ReactJS

A simple ReactJS App integrating WIRIS MathType on a Froala and step-by-step information on how to build it. The code of this example loads a rich text editor instance with a default value.

## Requirements

- **npm** (_Currently_ v6.13.4)
- **create-react-app** (_Currently_ v3.4.0)

## How to run the demo

```sh
$ yarn
$ npm start
```

Runs the app in the development mode.

Open [http://localhost:3004](http://localhost:3004) to view it in the browser.

The page will reload if you make edits.

You will also see any lint errors in the console.

## How to add MathType to Froala

1. Install MathType for Froala dependency.

   ```sh
   $ npm install @wiris/mathtype-froala --save
   $ npm install jquery --save

   ```

2. Replace all the content in _src/index.js_ by:

   ```js
   // Import jQuery so we can expose Froala editor to the window.
   import $ from "jquery";

   // Expose froala-editor to the window.
   window.$ = $;
   window.FroalaEditor = require("froala-editor");

   // Load wiris mathtype-froala plugin.
   require("@wiris/mathtype-froala");

   // Load WIRISplugins.js dynamically.
   const jsDemoImagesTransform = document.createElement("script");
   jsDemoImagesTransform.type = "text/javascript";
   jsDemoImagesTransform.src = "https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image";
   // Load generated scripts.
   document.head.appendChild(jsDemoImagesTransform);

   // Define the toolbar & configuration options for the froala editor.
   const toolbar = ["wirisEditor", "wirisChemistry"];
   const froalaConfig = {
     toolbarButtons: toolbar,
     // Add [MW] uttons to the image editing popup Toolbar.
     imageEditButtons: ["wirisEditor", "wirisChemistry", "imageDisplay", "imageAlign", "imageInfo", "imageRemove"],
     // Allow all the tags to understand the mathml
     htmlAllowedTags: [".*"],
     htmlAllowedAttrs: [".*"],
     // List of tags that are not removed when they have no content inside
     // so that formulas renderize propertly
     htmlAllowedEmptyTags: ["mprescripts", "none"],
     // You can choose the language for the MathType editor:
     // @see: https://docs.wiris.com/en/mathtype/mathtype_web/sdk-api/parameters#regional_properties
     // mathTypeParameters: {
     //   editorParameters: { language: 'es' },
     // },
   };
   ```

3. Finally, you are ready to run the development server through the specified `npm run start`

## How to run the tests

```sh
$ npm run test
```

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

## Learn More

Checkout the [FAQ](FAQs.md) file learn more about the most frequent asked questions.

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

For more information about the Froala or it’s options, you can check their [documentation](https://froala.com/wysiwyg-editor/docs/framework-plugins/react/).

To get more information about wiris MathType you can check on the [official documentation](http://www.wiris.com/mathtype)

## License

Copyright © 2010-2022 [WIRIS](http://www.wiris.com). Released under the [MIT License](../../../LICENSE).
