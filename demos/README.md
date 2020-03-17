# Demos integration

Some kind of esplanation 

## Quick start

First you have to install all the project dependencies on the root folder:

```sh
$ npm i
```

Then, to work with lerna, you must add the following line on the packages place in lerna.json. Or temporarily replace the content with the one from lerna.demos.json file.

```javascript
  "packages": [
    "demos/**/*",
    "packages/*"
  ],
```

To run a demo, go on the desired editor folder and run, to init the editor:

```sh
$ npm i
$ npm run deploy
```

If you want to build a development enviorment, you must link packages of the mono-repositoy on your local directoy. Also, every time, a package is modified, it has to be compiled. To do this, run:

```sh
$ npm i
$ npm run build-dev
```

Hint: The commant "npm i" it's just necessary the first time you initialyze an editor.

To work with the ckeditor5 demo with lerna, it's necessary to cut the dependencies of the plugin package and copy them on the demo package