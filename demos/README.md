# Technical demos of WIRIS MathType Web plugins

'Technical demos' is a collection of code examples that we've prepared to test, validate and show **how to integrate MathType Javascript plugins on different editors and technologies**, from vanilla HTML to modern javascript frameworks.

## Table of contents

- [Using the demos](#using-the-demos)
    - [Supported editors & technologies](#supported-editors--technologies)
    - [Folder structure](#folder-structure)
    - [How to run a demo](#how-to-run-a-demo)
- [Using the demos in development mode](#using-the-demos-in-development-mode)
    - [Environment set up](#environment-set-up)
    - [How to run a demo with the local package](#how-to-run-a-demo-with-the-local-package)
    - [Linting files](#linting-files)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Technical support](#technical-support)
- [Privacy Policity](#privacy-policity)
- [License](#license)


## Using the demos

### Supported editors & technologies

On this folder you'll find functional examples of how to integrate WIRIS MathType editor for these next editors:

- CKEditor
- Froala
- TinyMCE
- _Generic_

>Generic is not an editor itself but a generic integration made so that, from there, the WIRIS plugin can be integrated into any editor by following its steps.

We've prepared the very same example app for these next list of technologies:

- HTML5
- ReactJS 
- Angular 

### Folder structure

This next diagram represents the folder structure for this project. 

```bash
    demos
    ├── technology-1
    │   ├── editor-1
    |   |   ├── ...
    |   |   └── package.json
    │   ├── editor-2
    |   ├── ...
    |   └── editor-m
    ├── technology-2
    │   ├── editor-1
    │   ├── editor-2
    |   ├── ...
    |   └── editor-m
    ├── ...
    ├── technology-n
    └── README.md
```

There is a set of `n` supported `technologies` and its `m` supported `editors`, which will be detailed below. 

Every editor has a package.json for the editor dependencies and, depending on the folder you are in, you will see one kind of structure or another following the technology requirements and implementation.

### How to run a demo

Before running the demo, you must first go on the desired folder for a framework and editor.

To run a demo and initialize the editor, run:

```sh
$ cd demos/[technology]/[editor]
$ npm install
$ npm start
```

> **Note**: Use `yarn` instead of `npm install` in all react demos. Otherwise, they might not work.

You can find clarification on which technologies and which frameworks you can work with on this project in the [Supported editors & technologies](#supported-editors-technologies) section above.

*Note: The command `npm install` its just necessary the first time you initialize an editor.*

## Using the demos in development mode

The above instructions will use the MathType packages released at npmjs.org to build the demo.

You may need to build the very same demos but using the MathType packages on this repository, instead. 

### Environment set up

The mono-repository is managed through [Lerna](https://lerna.js.org/), a tool
designed for maintaining multiple npm packages in a single git repository.

> **Note**: The React demos require an extra step beforehand.
>
> Go to the desired demo folder and run `yarn`, e.g.:
>
> ```sh
> html-integrations/demo/react/ckeditor5$ yarn
> ```
>
> All other demos (HTML5 and Angular) do not require this step.

To work with Lerna and try out the packages, with your local changes instead of the published packages, you'd need to copy the contents from `lerna.demos.json` to `lerna.json`.

```sh
html-integrations$ cp lerna.demos.json lerna.json
```

Before running the demo, you must first 'bootstrap' and 'compile' the libraries. More information on the instructions on the [README.md](./README.md) file.

```sh
html-integrations$ npm install
html-integrations$ npm start
```

### How to run a demo with the local package

<<<<<<< HEAD
Go to the desired folder for the framework and editor of your choice and run the 'start' command.
=======
> **Note**: The demos on the `react` folder use `yarn` instead of `npm`. You can skip this whole section and [follow the instructions from the React section](#how-to-run-a-react-demo-with-the-local-package), instead.  

Go to the desired folder for the framework and editor of your choice and run the 'build-dev' command.
>>>>>>> Fix vulnerabilities on all demos

```sh
$ cd demos/[technology]/[editor]
demos/[technology]/[editor]$ npm start
```

Example:

```sh
$ cd demos/angular/ckeditor5
demos/angular/ckeditor5$ npm start
```

You can find a list of which technologies and which frameworks you can work with on this project in the [Supported editors & technologies](#supported-editors-&-technologies) section.

## How to run a React demo with the local package

Before running the demo, you must first 'bootstrap' and 'compile' the libraries. More information on the instructions on the [README.md](./README.md) file.

```bash
$ npm install
$ npm start 

```

Then, go to the desired folder, inside `demos/react` folder, to choose the editor and run the `build-dev` command using `yarn`.

```sh
$ cd demos/react/[editor]
html-integrations/demos/react/[editor]$ yarn run build-dev
```

Example:

```sh
html-integrations$ npm install
html-integrations$ npm start 
html-integrations$ cd demos/angular/generic
html-integrations/demos/react/ckeditor5$ yarn run build-dev
```

### Linting files

For more detailed information, take a look at this same section found in the README at the root of the project.

The important commands to lint the files are:

To check all the .js files you can execute:

```sh
$ npx eslint --quiet [options] <dir|file|glob>
```

To check all the .css files you can execute:

```sh
$ npx stylelint [options] <dir|file|glob>
```

To check all the .html files you can execute:

```sh
$ html-validate [options] <dir|file|glob>
```

In case you want to automatically apply the possible fixes, just add the --fix option in the desired command.

## Testing

There are a set of tests for each demo to validate code and expected behavior.

Open a Terminal window, and follow these steps to run these tests.

```sh
demos$ cd [framework]/[editor]
```

Then, run the demo by following the commands on the [How to run a demo](#how-to-run-a-demo) section, above.

> **Hint**: Use the command `npm serve` to run the demo without openning a new browser window automatically.

When the demo is ready, open a new terminal window and use the following command to run the tests:

```sh
demos/[framework]/[editor]$ npm test
```

This command executes all the tests of the desired demo. If you want to run the tests with other options that are not currentply in the desired demo, you can go on the [Jest documentation](https://jestjs.io/en/) and change the configurations or execute the test with other flags.

Remember to close the demo so you can free the used port when you are done with the tests.

## Troubleshooting

### 01. Build command not working on Windows for the HTML5+CKEditor5

On windows, run the `npm run compile-package-windows` before running `npm start`.

## Technical Support

If you have questions or need help integrating MathType, please contact us (support@wiris.com) instead of opening an issue.

## Privacy policy

The [MathType Privacy Policy](http://www.wiris.com/mathtype/privacy-policy) covers the data processing operations for the MathType users. It is an addendum of the company’s general Privacy Policy and the [general Privacy Policy](https://wiris.com/en/privacy-policy) still applies to MathType users.

## License

Copyright © 2010-2021 [WIRIS](http://www.wiris.com). Released under the [MIT License](../LICENSE).
