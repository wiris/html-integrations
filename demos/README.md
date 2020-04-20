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

#### Use an extension to check that the files follow the standards

For detailed information, take a look at this same section found in the README at the root of the project.

Each of the folders where the demos are located have specific scripts to make a check of the files in it. These are the following:
* To make a check of the .js files you can execute either of the following two commands:
  ```sh
  $ npm run lint
  $ npx eslint --quiet [options] <dir|file|glob>
  ```
* To make a check of the .css files you can execute either of the following two commands:
  ```sh
  $ npm run stylelint
  $ npx stylelint [options] <dir|file|glob>
  ```

* To make a check of the .html files you can execute either of the following two commands:
  ```sh
  $ npm run linthtml
  $ html-validate [options] <dir|file|glob>
  ```

In case you want to automatically apply the possible fixes, just add the --fix option in the desired command, the second command found in each specific block of commands, or in those explained in the README file at the root of the project.

## License


## Contact information
team.support.europe@wiris.com 
