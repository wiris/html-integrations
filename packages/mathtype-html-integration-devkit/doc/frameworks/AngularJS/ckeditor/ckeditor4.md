
# MathType for CKEditor4 in AngularJS

This guide explains how to use MathType as a plugin in CKEditor4 using AngularJS.

## Create AngularJS project

* If you don't have a project, create it with the next command. For this tutorial it is used Angular CLI 6.2.4 .

~~~
ng new my-app
cd my-app
~~~

## Add NPM packages

1. In order to add plugins it is necessary load CKEditor4 by yourself.

~~~
npm install --save ckeditor4-angular
npm install --save ckeditor
npm install --save @wiris/mathtype-ckeditor4
~~~

2. Open src/app/app.module.ts and add the next.

~~~
// Import Angular plugin.
import { CKEditorModule } from 'ckeditor4-angular';

...

@NgModule({
   ...
   imports: [ ..., CKEditorModule, ... ],
   ...
})
~~~

3. Open _angular.json_ file and insert the next lines inside _assets_ to bundle a folder with CKEditor4 and its point of entry in _scripts_ property to execute ckeditor.js.

~~~
"build" {
  ...

  "assets": [

              ...

              { "glob": "**/*", "input": "node_modules/ckeditor", "output": "/ckeditor/" },
              { "glob": "**/*", "input": "node_modules/@wiris/mathtype-ckeditor4", "output": "/ckeditor/plugins/ckeditor_wiris/" }

              ...

  ],

  ...

  "scripts": [

              ...

              "node_modules/ckeditor/ckeditor.js"

              ...

  ],
  ...
}
~~~

4. Add inside the header in _index.html_ a script to change CKEditor4 basepath.

~~~
<script>
    window.CKEDITOR_BASEPATH = '/ckeditor/';
</script>
~~~

5. Insert in _app.component.html_ a CKEditor4 instance with the next editor component.

~~~
<ckeditor
  data="<p>Editor' content</p>"
  [config]="{ extraPlugins: 'ckeditor_wiris', toolbar: [ [ 'Bold', 'ckeditor_wiris_formulaEditor' ] ] }"
></ckeditor>
~~~