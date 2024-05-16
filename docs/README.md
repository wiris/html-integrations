# Documentation

<small>[MathType Web Integrations](../README.md) → Documentation</small>

Mono-repository for the [MathType](http://www.wiris.com/en/mathtype) Web plugins and their dependencies.

## MathType Events

To capture events triggered by MathType editor, use the next code:

```js
// Capture onModalOpen event triggered when MT/CT editor is open
let modalOpenListener = window.WirisPlugin.Listeners.newListener('onModalOpen', () => {
  ... // Your callback function
});
window.WirisPlugin.Core.addGlobalListener(modalOpenListener);
```

### List of Global Events

- `onModalOpen()` Triggered when MT/CT editor modal is open
- `onModalClose()` Triggered when MT/CT editor modal is close

## Table of contents

- [Requirements](#requirements)
  - [For Windows users](#for-windows-users)
- [Structure](#structure)
- [First steps](#first-steps)
  - [Cloning the repository](#cloning-the-repository)
  - [Bootstrapping](#bootstrapping)
- [Next steps](#next-steps)

## Requirements

Using this project requires having [git], [Nx](https://nx.dev/) and [yarn](https://yarnpkg.com/) installed:

- Follow [this guide](https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable) to install yarn.
- Follow [this guide](https://www.atlassian.com/git/tutorials/install-git) to install git.
- Run the following command, in your project directory, to install Nx: `yarn global add nx`.

[Git]: https://git-scm.com/
[npm]: https://www.npmjs.com/

### For Windows users

This project runs shell commands not compatible among different OS.

To prevent that, you need to run the commands in the `git bash` instead of the windows one.

## Structure

This repository has a [monorepo](https://en.wikipedia.org/wiki/Monorepo) structure.
This means that the source code of multiple npm packages is stored in a single git repository.
Some of these packages depend on each other, so storing them together allows for a faster development cycle.
In order to manage multiple packages, we use [Nx](https://nx.dev/) as a cornerstone of the project structure.

The main functionality of Nx is bootstrapping.
Bootstrapping consists of linking to the local source code of the dependencies instead of downloading them from npm.
This allows us to make live changes to some dependency and see how it affects another package without having to publish the dependency to npm.

The most important files and folders are:

- `docs`. The main documentation for the project.
  You can see the stable version rendered [here](https://wiris.github.io/html-integrations).
- `packages`. The source code of the plugins, as well as their common API known as the "devkit".
  Each folder contains one npm package.
  All the usual npm commands work inside.
- `demos`. A growing set of demos to help developers integrate these plugins on different scenarios.
- `scripts`. Scripts used for different development tasks.
- `resources`. Resources files that are needed for the publish workflow.

## First steps

### Cloning the repository

You can clone this repo as follows:

```sh
$ git clone https://github.com/wiris/html-integrations
```

### Bootstrapping

After cloning the repo, run the following command on the project root:

```sh
$ yarn
```

This will bootstrap the packages using `Yarn` and `Nx`.

### Workspace configuration for Visual Studio Code ( OPTIONAL )

If you are using Visual Studio Code, you can configure the workspace to use the team selection of extensions and settings.

For more information, check the [Vscode Extensions](development/vscode/extensions.md)

We also modified vscode default settings to ease the development experience.

For more information, check the [Vscode Settings](development/vscode/settings.md)

## Next steps

- [Trying out the demos](demos/README.md)
- [Integrating MathType in your website](integration/README.md)
- [Development guide](development/README.md)
- [Contributing guidelines](contributing/README.md)
- [Code of conduct](code-of-conduct/README.md)
