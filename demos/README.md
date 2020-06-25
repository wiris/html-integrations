# Technical demos of WIRIS MathType Web plugins

'Technical demos' is a collection of code examples that we've prepared to test, validate and show **how to integrate MathType Javascript plugins on different editors using technologies**, from vanilla HTML to modern javascript frameworks.

## Table of contents

- [Using the demos](#using-the-demos)
    - [Supported editors & technologies](#supported-editors--technologies)
    - [Folder structure](#folder-structure)
    - [How to run a demo](#how-to-run-a-demo)
- [Using the demos in development mode](#using-the-demos-in-development-mode)
    - [Environment set up](#environment-set-up)
    - [How to run a demo with the local package](#how-to-run-a-demo-with-the-local-package)
    - [Linting files](#linting-files)
- [Updates](#updates)
- [Contact information](#contact-information)
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

There is a set of `n` supported `technologies` and its `m` supported `editors`, which will be detailed below. You will find which are the technologies and editors in the [Supported editors & technologies](#supported-editors-&-technologies) section.

Every editor has a package.json for the editor dependencies and, depending on the folder you are in, you will see one kind of structure or another following the technology requirements and implementation.

### How to run a demo

Before running the demo, you must first go on the desired folder for a framework and editor.<br>
To run a demo and initialize the editor, run:

```sh
html-integrations/demos/[technology]/[editor]$ npm install
html-integrations/demos/[technology]/[editor]$ npm start
```

You can find clarification on which technologies and which frameworks you can work with on this project in [Supported editors & technologies](#supported-editors-technologies) section.

*Note: The command `npm install` its just necessary the first time you initialize an editor.*

## Using the demos in development mode

### Environment set up

The mono-repository is managed through [Lerna](https://lerna.js.org/), a tool
designed for maintaining multiple npm packages in a single git repository.

To work with Lerna and try out the packages, with your local changes instead of the published packages, you'd need to copy the contents from `lerna.demos.json` to `lerna.json`.

### How to run a demo with the local package

Before running the demo, you must first go on the desired folder for a framework and editor.<br>

```sh
$ cd demos/[technology]/[editor]
html-integrations/demos/[technology]/[editor]$ npm run build-dev
```

Example:

```sh
$ cd demos/angular/ckeditor5
html-integrations/demos/angular/ckeditor5$ npm run build-dev
```

You can find a list of which technologies and which frameworks you can work with on this project in the [Supported editors & technologies](#supported-editors-&-technologies) section.

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

## Updates

- :tada: Examples for developers for ReactJS and Angular are now available.

## Contact information

team.support.europe@wiris.com

## License

Copyright © 2010-2020 [WIRIS](http://www.wiris.com). Released under the [MIT License](../LICENSE).
