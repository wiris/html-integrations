# Demos integration

Technical demos is an internal project developed to test, find bugs and improvements, and validate the WIRIS plugins with different types of editors.

## Table of contents

- [Requirements](#requirements)
- [Instructions](#instructions)
  - [Cloning](#cloning)
  - [Quick start](#quick-start)
    - [Bootstraping](#bootstraping)
    - [Installation](#installation)
    - [Run a demo with the public npm package](#run-a-demo-with-the-public-npm-package)
    - [Run a demo with the local package](#run-a-demo-with-the-local-package)
    - [Use an extension to check that the files follow the standards](#use-an-extension-to-check-that-the-files-follow-the-standards)
- [File manifest](#file-manifest)
  - [Important files and folder structure](#important-files-and-folder-structure)
  - [Supported editors](#supported-editors)
  - [Technologies with a demo](#technologies-with-a-demo)
- [Known bugs](#known-bugs)
- [Change log](#change-log)
- [News](#news)
- [Documentation](#documentation)
- [License](#license)
- [Privacy policy](#privacy-policy)
- [Contact information](#contact-information)

## Requirements

This project requires basic knowledge of the `git` and `npm` commands.
It also uses the `npx` tool which comes bundled with `npm`.

To install node and npm follow this [guide-npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm), and use this other one [guide-git](https://www.atlassian.com/git/tutorials/install-git) to install git.


[Lerna](https://lerna.js.org/) is used as a cornerstone of the project structure. Its main features, and how to install it, are explained in this guide.

## Instructions

Please, follow the instructions to have the best experience when working with this project.

### Cloning

First, clone the repository with this url: https://github.com/wiris/html-integrations

#### Linux/Mac

```sh
$ git clone https://github.com/wiris/html-integrations
$ cd html-integrations
html-integrations$
```

#### Windows

You will need to have administrator privileges or activate
[developer mode](https://docs.microsoft.com/en-us/windows/uwp/get-started/enable-your-device-for-development)
in your account, and then use the `core.symlinks` when cloning the repository:

```sh
projects$ git clone --config core.symlinks=true https://github.com/wiris/html-integrations
```

### Quick start

#### Bootstraping

The mono-repository is managed through [Lerna](https://lerna.js.org/), a tool
designed for maintaining multiple npm packages in a single git repository.

To work with Lerna and try out the packages, with your local changes instead of the published packages, you'd need to copy the contents from `lerna.demos.json` to `lerna.json`.

#### Installation

After cloning this repo, and optionally adding Lerna dependencies, open a Terminal window to run these next commands:

```sh
html-integrations$ npm install
html-integrations$ npm start
```

Then go on the demos folder, select the technology and the editor and run;

```
html-integrations/demos/[technology]/[editor]$ npm i
```
You can find clarification on which technologies and which publishers you can work with on this project in [File manifest](#file-manifest) section.

Now, you have the environment ready to start running the demo.

#### Run a demo with the public npm package

To run a demo and initialize the editor, execute:

```sh
$ npm run deploy
```

#### Run a demo with the local package

If you want to build a development environment and run the demo, you must link packages of the mono-repository on your local directory. Also, every time a package is modified, the following command must be executed so the changes can be appreciated:

```sh
$ npm run build-dev
```

Hint: The command `npm i` its just necessary the first time you initialize an editor.

#### Use an extension to check that the files follow the standards

For more detailed information, take a look at this same section found in the README at the root of the project.

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

## File manifest

### Important files and folder structure

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

There is a set of `n` supported `technologies` and its `m` supported `editors`, which will be detailed below. 

Every editor has a package.json for the editor dependencies and, depending on the folder you are in, you will see one kind of structure or another following the technology requirements and implementation.

### Supported editors

This is the list of editors with a supported custom WIRIS plugins especially created for the editors:

- `CKeditor 4`
- `CKeditor 5`
- `Froala 2`
- `Froala 3`
- `generic`
- `TinyMCE 4`
- `TinyMCE 5`

>Generic is not an editor itself, it's a generic integration made so that, from there, the WIRIS plugin can be integrated into any editor by following its steps.

### Technologies with a demo

- `html5`
- [Coming soon] `React`
- [Coming soon] `Angular`

## Running tests

Automatic test will be coming soon.

## Known bugs

- `CKeditor 5` has problems working with Lerna, because the CKeditor 5 architecture prohibits having duplicate dependencies, but there is a temporal solution, which compiles and pack the plugin into a .tgz before bootstraping, then, this .tgz file defined as a dependency on the package.json.

- `Froala 3` launches a reference error that doesn’t affect the proper performance of the demo.

We are working to improve the user experience and fix the errors previously detailed. :smile:

## Change log

- An **improvement** in the project **structure** has been implemented.

- Improvements have been made to the functioning of .css, .html, and .js files, creating a **resource folder** containing all the common code between the demos.

- **Duplicate** configuration **files** have been **removed**.

- Technical demos project **documentation** has been **improved**.

## News

- :tada: Now there is a demo for froala version 3 with `react` technology. 

## Documentation

- [npm](https://docs.npmjs.com/)

- [Lerna](https://github.com/lerna/lerna#readme) 

- [Mathtype by WIRIS](http://www.wiris.com/mathtype)

## License

Copyright © 2010-2020 [WIRIS](http://www.wiris.com). Released under the [MIT License](../LICENSE).

## Privacy policy

The [MathType Privacy Policy](http://www.wiris.com/mathtype/privacy-policy) covers the data processing operations for the MathType users. It is an addendum of the company’s general Privacy Policy and the [general Privacy Policy](https://wiris.com/en/privacy-policy) still applies to MathType users.


## Contact information
team.support.europe@wiris.com 

