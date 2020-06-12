# TinyMCE integration in ReactJS

A simple ReactJS App integrating WIRIS MathType on a TinyMCE 5 and step-by-step information on how to build it. The  code of this example loads a rich text editor instance with a default value.

## Requirements

* **npm** (*Currently* v6.13.4)
* **create-react-app** (*Currently* v3.4.1)

## How to run the demo

```sh
$ npm install
$ npm run deploy
```

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

## How to add MathType to TinyMCE from scratch

1. Run the following through the terminal

    Notice that **$APP_NAME** needs to be replaced by the name that you choose.

    ```sh
    $ create-react-app $APP_NAME
    $ cd $APP_NAME
    $ npm install --save @tinymce/tinymce-react
    $ npm install tinymce
    $ npm install @wiris/mathtype-tinymce5
    $ npm install jquery --save
    ```

2. Replace all the content in *src/index.js* by:

    ```js
    // Default create-react-app imports
    import React from 'react';
    import ReactDOM from 'react-dom';
    import './index.css';
    import * as serviceWorker from './serviceWorker';
    
    // Import the react editor TinyMCE component.
    import { Editor } from '@tinymce/tinymce-react';
    
    // Add jquery.
    import $ from 'jquery';
    
    // Load wiris formula render script.
    const jsDemoImagesTransform = document.createElement('script');
    jsDemoImagesTransform.type = 'text/javascript';
    jsDemoImagesTransform.src = 'https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image';
    document.head.appendChild(jsDemoImagesTransform);
    
    // This needs to be included before the '@wiris/mathtype-tinymce5' is loaded synchronously
    window.$ = $;
    window.tinymce = require('tinymce');  // Expose the TinyMCE to the window.
    
    // Load wiris plugin synchronously.
    require('@wiris/mathtype-tinymce5');
    
    // Set the initial editor content
    const content = '<p class="text"> Double click on the following formula to edit it.</p><p style="text-align:center;"><math><mi>z</mi><mo>=</mo><mfrac><mrow><mo>-</mo><mi>b</mi><mo>&PlusMinus;</mo><msqrt><msup><mi>b</mi><mn>3</mn></msup><mo>-</mo><mn>4</mn><mi>a</mi><mi>c</mi></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></math></p>';
    
    // Init the editor and define its options
    const options = {
        height: 500,
        menubar: false,
        
        // Add wiris plugin
        external_plugins: {
            'tiny_mce_wiris' : `${window.location.href}/node_modules/@wiris/mathtype-tinymce5/plugin.min.js`
        },
        plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount '
        ],
        toolbar: [
            ' bold italic |' +
            'tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry '
        ],
        htmlAllowedTags:  ['.*'],
        htmlAllowedAttrs: ['.*'],
    };
    
    /* Create a component to be rendered later.
    This is important to remove complexity from the reactDom.render
    and to be able to add other functionality. */
    class EditorTiny extends React.Component {
        render() {
            return (
                <Editor init ={ options } initialValue = { content } />
            );
        }
    }
    
    ReactDOM.render(<EditorTiny />, document.getElementById('root'));
    
    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: https://bit.ly/CRA-PWA
    serviceWorker.unregister();
    ```

3. Add the following script on the head of the *public/index.html*

    ```html
    <script src="https://cdn.tiny.cloud/1/no-api-key/tinymce/5/tinymce.min.js" referrerpolicy="origin"></script>
    ```

4. Finally, you are ready to run the development server through the specified command ```npm run start```

5. The **content** can be empty or anything you want to set as the initial editor content.

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

For more information about the TinyMCE or it’s options, you can check their [documentation](https://www.tiny.cloud/docs/integrations/react/).

To get more information about wiris MathType you can check on the [official documentation](http://www.wiris.com/mathtype)

## License

Copyright © 2010-2020 [WIRIS](http://www.wiris.com). Released under the [MIT License](../../../LICENSE).
