# Demos integration

Technical demos is a internal project developed to test, finding bugs and improvements, and validate the wiris plugins with different types of editors.

## Table of contents

- [Requirements](#requirements)
- [Instructions](#instructions)
  - [Adding lerna dependencies](#adding-lerna-dependencies)
  - [Quick start](#quick-start)
    - [Run a demo with the public npm package](#run-a-demo-with-the-public-npm-package)
    - [Run a demo with the local package](#run-a-demo-with-the-local-package)
    - [Use an extension to check that the files follow the standards](#use-an-extension-to-check-that-the-files-follow-the-standards)
- [License](#license)
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
designed for mantaining multiple npm packages in a single git repository.

To work with lerna and try out the packages, with your local changes instead of the published packages, you'd need to copy the contents from `lerna.demos.json` to `lerna.json`.

#### Installation

After cloning this repo, and optionally adding lerna dependencies, open a Terminal window to run these next commands:

```sh
html-integrations$ npm install
html-integrations$ npm start
```

Then go on the folders demo, select the technology and the editor and run;

```
html-integrations/demos/[technology]/[editor]$ npm i
```
You can find clarification on which technologies and which publishers you can work with on this project in [File manifest](#file-manifest) section.

Now you have the environment ready to start running the demo.

#### Run a demo with the public npm package

To run a demo and initialize the editor execute:

```sh
$ npm run deploy
```

#### Run a demo with the local package

If you want to build a development enviorment and run the demo, you must link packages of the mono-repositoy on your local directoy. Also, every time a package is modified, the following command must be executed so the changes can be appreciated:

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

## File manifest

### Important files and folder structure

The next tree you will see represents the structure of this project in major terms. 

```bash
demos
├── technoloy-1
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

Every editor has a package.json for the editor dependencies and, relying on the folder you are in, you will see one kind of structure or another following the technlology requirements and implementation.

### Supported editors

This is the list of editors with a supported custom wiris plugins especially created for the editors:

- `ckeditor4`,
- `ckeditor5`,
- `froala2`,
- `froala3`,
- `generic`,
- `tinymce4`,
- `tinymce5`;

### Technologies with a demo

- `html5`
- [Comming soon] `React`
- [Comming soon] `Angular`

## License

## Contact information
team.support.europe@wiris.com 

