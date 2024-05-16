# CKEditor integration in ReactJS

A simple ReactJS App integrating WIRIS MathType on a CKEditor 5 and step-by-step information on how to build it. The code of this example loads a rich text editor instance with a default value.

## Requirements

- **npm** (_Currently_ v6.13.4)
- **create-react-app** (_Currently_ v3.4.1)

## How to run the demo

```sh
$ npm install
$ npm run deploy
```

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

## How to add MathType to CKEditor

1. Install MathType for CKEditor5 dependency.

   ```sh
   $ npm install @wiris/mathtype-ckeditor5
   ```

2. Add the following lines in _src/index.js_:

   ```js
   // Import CKEditor custom build.
   import * as ClassicEditor from './ckeditor';

   ...

   // Define the toolbar icons to be shown
   const toolbar = ['bold', 'italic', 'MathType', 'ChemType', 'alignment:left', 'alignment:center', 'alignment:right'];

   // Initialize editor & define the configuration options for the CKEditor.
   const ckConfig = {
       iframe: true,
       charCounterCount: false,
       toolbar: toolbar,
       htmlAllowedTags: ['.*'],
       htmlAllowedAttrs: ['.*'],
       htmlAllowedEmptyTags: ['mprescripts'],
       imageResize : false,
       useClasses: false
   };

   /* Create a component to be rendered later. */
   class Editor extends React.Component {
       render() {
           return (
               <CKEditor editor = { ClassicEditor } config={ ckConfig } data = { content } />
           );
       }
   }

   ReactDOM.render(<Editor />, document.getElementById('root'));

   ...
   ```

3. Create a custom build to integrate wiris plugins and more. <br>
   a. Follow this [GUIDE](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/development/custom-builds.html) on how to create a custom Classic editor build and the steps and advice we give you below. <br>
   b. The wiris dependency you will need to install when following the guide is:
   `    npm install @wiris/mathtype-ckeditor5` <br>
   c. You can also add as many plugins as your project will need which are not on the default ClassicEditor build (We also added the align plugin). <br>
   d. We recommend you to just clone the branch and copy the compiled file with the editor and the new configurations placed on **build/ckeditor.js** on your project src folder. If you decide to do it by other ways (found in the guide above), you will have to change the way the custom build is imported on your app.component.ts file.

4. Finally, you are ready to run the development server through the specified commant `npm run start`

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

For more information about the CKEditor or it’s options, you can check their [documentation](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/react.html).

To get more information about wiris MathType you can check on the [official documentation](http://www.wiris.com/mathtype)

## License

Copyright © 2010-2020 [WIRIS](http://www.wiris.com). Released under the [MIT License](../../../LICENSE).
