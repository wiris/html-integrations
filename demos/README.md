# Technical demos of WIRIS MathType Web plugins

Technical demos is a collection of code examples created to test, find bugs and improvements, and validate the WIRIS MathType plugins on different editors.

## Table of contents

- [Supported editors & technologies](#supported-editors-&-technologies)
- [Demos usage](#demos-usage)
  - [Cloning](#cloning)
  - [Folder structure](#folder-structure)
  - [How to run the demo](#how-to-run-the-demo)
- [Using the demos in development mode](#file-manifest)
  - [Environment set up](#environment-set-up)
  - [How to run a demo with the local package](#how-to-run-a-demo-with-the-local-package)
  - [Linting files](#linting-files)
- [Updates](#updates)
- [License](#license)
- [Contact information](#contact-information)

## Supported editors & technologies

This is the list of editors with a supported custom WIRIS plugins especially created for the editors:

- `CKeditor`
- `Froala`
- `generic`
- `TinyMCE`

>Generic is not an editor itself, it's a generic integration made so that, from there, the WIRIS plugin can be integrated into any editor by following its steps.

The technologies with demos are:

- **html5**
- **React** 
- **Angular** 

## Demos usage

### Cloning

You can clone the project following the instructions on the clonnig secction of this [guide](../README.md).

### Folder structure

The next tree you will see represents the structure of this project in major terms. 

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

### How to run the demo

Before running the demo, you must first go on the desired folder for a framework and editor.<br>
To run a demo and initialize the editor, run:

```sh
html-integrations/demos/[technology]/[editor]$ npm install
html-integrations/demos/[technology]/[editor]$ npm run deploy
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
If you want to build a development environment and run the demo, you must link packages of the mono-repository on your local directory. the following commands must be executed:

```sh
html-integrations/demos/[technology]/[editor]$ npm install
html-integrations/demos/[technology]/[editor]$ npm run deploy
```

You can find clarification on which technologies and which frameworks you can work with on this project in [Supported editors & technologies](#supported-editors-&-technologies) section.

*Note: The command `npm install` its just necessary the first time you initialize an editor.*

### Linting files

For more detailed information, take a look at this same section found in the README at the root of the project.

The important commands to lint the files are:

* To make a check of the .js files you can execute:
```sh
$ npx eslint --quiet [options] <dir|file|glob>
```

* To make a check of the .css files you can execute:
```sh
$ npx stylelint [options] <dir|file|glob>
```

* To make a check of the .html files you can execute:
```sh
$ html-validate [options] <dir|file|glob>
```

In case you want to automatically apply the possible fixes, just add the --fix option in the desired command.

## Updates

- :tada: Demos with `react` and `angular`frameworks arenow live.

- An **improvement** in the project **structure** has been implemented.

## License

Copyright © 2010-2020 [WIRIS](http://www.wiris.com). Released under the [MIT License](../LICENSE).

## Contact information

team.support.europe@wiris.com
