# Demos integration

Technical demos folder to test wiris plugins with different types of editors.

## Instructions

First, follow the instructions of the README file you can find in the root directory of the project.

### Adding lerna dependencies

To work with lerna, you must replace the packages content, with the following lines, in the file lerna.json you can find in the root directory of the project. Or temporarily replace all the content with the one from lerna.demos.json file.

```javascript
  "packages": [
    "demos/**/*",
    "packages/*"
  ],
```

### Quick start

Go on the desired editor folder and run;

```
$ npm i
```
Now you have the environment ready to start running the demo.

#### Run a demo with the public npm package

To run a demo and initialize the editor execute:

```sh
$ npm run deploy
```

#### Run a demo with the local package

If you want to build a development enviorment and run the demo, you must link packages of the mono-repositoy on your local directoy. Also, every time a package is modified, the following command must be executed so the changes can be appreciated. The line to be executed is:

```sh
$ npm run build-dev
```

Hint: The commant "npm i" it's just necessary the first time you initialyze an editor.

## License


## Contact information
team.support.europe@wiris.com 
