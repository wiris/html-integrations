
# MathType for TinyMCE5 in AngularJS

This guide explains how to use MathType as a plugin in TinyMCE5 using AngularJS.

## Create AngularJS project

* If you don't have a project, create it with the next command. For this tutorial it is used Angular CLI 6.2.4 .

~~~
ng new my-app
cd my-app
~~~

## Add NPM packages

1. In order to add plugins it is necessary load TinyMCE by yourself.

~~~
npm install --save @tinymce/tinymce-angular
npm install --save tinymce
npm install --save @wiris/mathtype-tinymce4
~~~

2. Open src/app/app.module.ts and add the next.

~~~
// Import Angular plugin.
import { EditorModule } from '@tinymce/tinymce-angular';
...

@NgModule({
   ...
   imports: [ ..., EditorModule, ... ],
   ...
})
~~~

3. Open _angular.json_ file and insert the next lines inside _assets_ to bundle a folder with tinymce assets and its plugins; and the point of entry for TinyMCE in _scripts_ properties.

~~~
"build" {
  ...

  "assets": [

              ...

              { "glob": "**/*", "input": "node_modules/tinymce/skins", "output": "/tinymce/skins/" },
              { "glob": "**/*", "input": "node_modules/tinymce/themes", "output": "/tinymce/themes/" },
              { "glob": "**/*", "input": "node_modules/tinymce/plugins", "output": "/tinymce/plugins/" },
              { "glob": "**/*", "input": "node_modules/@wiris/mathtype-tinymce5", "output": "/tinymce/plugins/tiny_mce_wiris/" }

              ...

  ],

  ...

  "scripts": [

              ...

              "node_modules/tinymce/tinymce.min.js"

              ...

  ],
  ...
}
~~~

4. Add inside the class constructor in _app.component.ts_ the options to override TinyMCE baseurl default and take only minified files.

~~~
// The next line needs to be inserted after the imports.
declare const tinyMCE;

// Class constructor.
constructor() {
    tinyMCE.overrideDefaults({
      base_url: '/tinymce/',  // Base for assets such as skins, themes and plugins
      suffix: '.min'          // This will make Tiny load minified versions of all its assets
    });
}
~~~

5. Insert in _app.component.html_ a TinyMCE instance with the next editor component.

~~~
<editor [init]="{
    plugins: 'tiny_mce_wiris',
    toolbar: 'tiny_mce_wiris_formulaEditor'
}"></editor>
~~~