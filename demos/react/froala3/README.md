# Froala integration in ReactJS

A simple ReactJS App integrating WIRIS MathType on a Froala 3 and step-by-step information on how to build it. The  code of this example loads a rich text editor instance with a default value.

## Requirements

* **npm** (*Currently* v6.13.4)
* **create-react-app** (*Currently* v3.4.0)

## How to run the demo

```sh
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
    $ npm install react-froala-wysiwyg --save
    $ npm install @wiris/mathtype-froala3 --save
    $ npm install jquery --save

    ```

2. Replace all the content in *src/index.js* by:

    ```js
    import React from 'react';
    import ReactDOM from 'react-dom';
    import './index.css';
    import * as serviceWorker from './serviceWorker';
    
    // Froala Editor.
    import 'froala-editor/css/froala_style.min.css';
    import 'froala-editor/css/froala_editor.pkgd.min.css';
    import FroalaEditorComponent from 'react-froala-wysiwyg';
    import 'froala-editor/js/plugins.pkgd.min.js';
    import $ from 'jquery';
    
    window.$ = $;
    window.FroalaEditor = require('froala-editor');
    require('@wiris/mathtype-froala3');
    
    const toolbar = ['wirisEditor', 'wirisChemistry'];
    const froalaConfig = {
        iframe: true,
        charCounterCount: false,
        imageEditButtons: ['wirisEditor', 'wirisChemistry', 'imageRemove'],
        toolbarButtons: toolbar,
        toolbarButtonsMD: toolbar,
        toolbarButtonsSM: toolbar,
        toolbarButtonsXS: toolbar,
        htmlAllowedTags: ['.*'],
        htmlAllowedAttrs: ['.*'],
        htmlAllowedEmptyTags: ['mprescripts'],
        imageResize : false,
        key: 'CA5D-16E3A2E3G1I4A8B8A9B1D2rxycF-7b1C3vyz==',
        heightMax: 310,
        useClasses: false
    };
    
    ReactDOM.render(<FroalaEditorComponent config={ froalaConfig } />, document.getElementById('root'));
    
    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: https://bit.ly/CRA-PWA
    serviceWorker.unregister();
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

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

For more information about the Froala or it’s options, you can check their [documentation](https://froala.com/wysiwyg-editor/docs/framework-plugins/react/).

To get more information about wiris MathType you can check on the [official documentation](http://www.wiris.com/mathtype)

## License

Copyright © 2010-2020 [WIRIS](http://www.wiris.com). Released under the [MIT License](../../../LICENSE).