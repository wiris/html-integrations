# Generic integration in ReactJS

A simple ReactJS App integrating WIRIS MathType on a generic editor, build with your own html and css, and step-by-step information on how to build it. The code of this example loads a text editor instance with a default value.

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

## How to add MathType with a Generic integration from scratch

1. Run the following through the terminal

    Notice that **$APP_NAME** needs to be replaced by the name that you choose.

    ```sh
    $ create-react-app $APP_NAME
    $ cd $APP_NAME
    $ npm install @wiris/mathtype-generic
    $ npm install @wiris/mathtype-html-integration-devkit
    ```

2. Replace all the content in *src/index.js* by:

    ```js
    // Default create-react-app imports
    import React from 'react';
    import ReactDOM from 'react-dom';
    import './index.css';
    import * as serviceWorker from './serviceWorker';
    
    // Import and load functions from wiris mathype-generic plugin.
    import { wrsInitEditor } from '@wiris/mathtype-generic/wirisplugin-generic.src';
    import '@wiris/mathtype-generic/wirisplugin-generic';
    
    // Load WIRISplugins.js render dynamically
    const jsDemoImagesTransform = document.createElement('script');
    jsDemoImagesTransform.type = 'text/javascript';
    jsDemoImagesTransform.src = 'https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image';
    // Load the generated script.
    document.head.appendChild(jsDemoImagesTransform);
    
    // Create toolbar component
    function Toolbar() {
        return (
            <div id="toolbar"></div>
        );
    }
    
    /**
    * Create editable area component.
    * @param {String} props.data  String that represents the initial content of the editor. It can be either mathml or any other html tag.
    */
    function HtmlEditor(props) {
        return (
            <div id="htmlEditor" contentEditable="true" dangerouslySetInnerHTML={{ __html: props.data }}></div>
        );
    }
    
    // Create an extension of the react components called editor.
    class Editor extends React.Component {
        // Execute after the render.
        componentDidMount() {
            // Load the toolbar and the editable area into const variables to work easy with them.
            const editableDiv = document.getElementById('htmlEditor');
            const toolbarDiv = document.getElementById('toolbar');
            
            // Initialize the editor.
            wrsInitEditor(editableDiv, toolbarDiv);
        }
        render() {
            return [
                <Toolbar />,
                <HtmlEditor data = {content} />
            ];
        }
    }
    
    // Define the initial content to place on the editor.
    const content = '<p class="text"> Double click on the following formula to edit it.</p><p style="text-align:center;"><math><mi>z</mi><mo>=</mo><mfrac><mrow><mo>-</mo><mi>b</mi><mo>&PlusMinus;</mo><msqrt><msup><mi>b</mi><mn>3</mn></msup><mo>-</mo><mn>4</mn><mi>a</mi><mi>c</mi></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></math></p>';
    
    // Render the editor react component.
    ReactDOM.render(
        <Editor />,
        document.getElementById('root')
    );
    
    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: https://bit.ly/CRA-PWA
    serviceWorker.unregister();
    ```

    *Note that the **content** can be empty or anything you want to set as the initial editor content.*

3. Finally, you are ready to run the development server through the specified command ```npm run start```

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

To get more information about wiris MathType you can check on the [official documentation](http://www.wiris.com/mathtype)

## License

Copyright © 2010-2020 [WIRIS](http://www.wiris.com). Released under the [MIT License](../../../LICENSE).