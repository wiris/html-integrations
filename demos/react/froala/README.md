# Froala integration in ReactJS

A simple ReactJS App integrating WIRIS MathType on a Froala and step-by-step information on how to build it. The  code of this example loads a rich text editor instance with a default value.

## Requirements

* **npm** (*Currently* v6.13.4)
* **create-react-app** (*Currently* v3.4.0)

## How to run the demo

```sh
$ yarn
$ npm start
```

Runs the app in the development mode.

Open [http://localhost:3004](http://localhost:3004) to view it in the browser.

The page will reload if you make edits.

You will also see any lint errors in the console.

## How to add MathType to Froala from scratch

1. Run the following through the terminal

    Notice that **$APP_NAME** needs to be replaced by the name that you choose.
    
   > **Note:** you can set the `froala-editor` and `angular-froala-wysiwyg` versions,
   as showed in the comment below, which lies between 3 and 4.
   Yo can also not specify any version, in that case, the latest stable version will be installed.

    ```sh
    $ create-react-app $APP_NAME
    $ cd $APP_NAME
    $ npm install react-froala-wysiwyg --save
    # npm install react-froala-wysiwyg@3.2.7 --save
    # Supports Froala V4 and V3
    $ npm install --save @wiris/mathtype-froala3
   
    $ npm install @wiris/mathtype-froala3 --save
    $ npm install jquery --save

    ```

2. Replace all the content in *src/index.js* by:

    ```js
    // Load react default libraries.
    import React from 'react';
    import ReactDOM from 'react-dom';
    import './index.css';
    import reportWebVitals from './reportWebVitals';

    // Load Froala Editor scripts and styles.
    import 'froala-editor/css/froala_style.min.css';
    import 'froala-editor/css/froala_editor.pkgd.min.css';
    import FroalaEditorComponent from 'react-froala-wysiwyg';
    import 'froala-editor/js/plugins.pkgd.min.js';

    // Import jQuery so we can expose Froala editor to the window.
    import $ from 'jquery';

    // Expose froala-editor to the window.
    window.$ = $;
    window.FroalaEditor = require('froala-editor');

    // Load wiris mathtype-froala plugin.
    require('@wiris/mathtype-froala3');

    // Load WIRISplugins.js dynamically.
    const jsDemoImagesTransform = document.createElement('script');
    jsDemoImagesTransform.type = 'text/javascript';
    jsDemoImagesTransform.src = 'https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image';
    // Load generated scripts.
    document.head.appendChild(jsDemoImagesTransform);

    // Define the toolbar & configuration options for the froala editor.
    const toolbar = ['wirisEditor', 'wirisChemistry'];
    const froalaConfig = {
        toolbarButtons: toolbar,
        // Add [MW] uttons to the image editing popup Toolbar.
        imageEditButtons: ['wirisEditor', 'wirisChemistry', 'imageDisplay', 'imageAlign', 'imageInfo', 'imageRemove'],
        // Allow all the tags to understand the mathml
        htmlAllowedTags: ['.*'],
        htmlAllowedAttrs: ['.*'],
        // List of tags that are not removed when they have no content inside
        // so that formulas renderize propertly
        htmlAllowedEmptyTags: ['mprescripts', 'none'],
        // In case you are using a different Froala editor language than default,
        // language: 'es',
        // You can choose the language for the MathType editor, too:
        // @see: https://docs.wiris.com/en/mathtype/mathtype_web/sdk-api/parameters#regional_properties
        // mathTypeParameters: {
        //   editorParameters: { language: 'es' },
        // },
        // Execute on initialized editor.
        events: {
            initialized() {
            // Since Froala 3.1.1 version, initialization events need to be called manually for the React component.
            // Parse the initial content set on the editor through html to render it
            const contentRendered = WirisPlugin.Parser.initParse(this.html.get(true));
            this.html.set(contentRendered);
            },
        },
    };

    // Set the initial content.
    const content = '<p class="text"> Double click on the following formula to edit it.</p><p style="text-align: center;"><math><mi>z</mi><mo>=</mo><mfrac><mrow><mo>-</mo><mi>b</mi><mo>&PlusMinus;</mo><msqrt><msup><mi>b</mi><mn>3</mn></msup><mo>-</mo><mn>4</mn><mi>a</mi><mi>c</mi></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></math></p>'


    ReactDOM.render(<FroalaEditorComponent tag='div' config={ froalaConfig } model={ content } />, document.getElementById('root'));

    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: https://bit.ly/CRA-PWA
    reportWebVitals();
    ```

    *Note that the **content** can be empty or anything you want to set as the initial editor content.*

3. Finally, you are ready to run the development server through the specified ```npm run start```

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