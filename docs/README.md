# Documentation

<small>[MathType Web Integrations](../README.md) → Documentation</small>

Mono-repository for the [MathType](http://www.wiris.com/en/mathtype) Web plugins and their dependencies.

## Table of contents

- [Requirements](#requirements)
- [Structure](#structure)
- [First steps](#first-steps)
  - [Cloning the repository](#cloning-the-repository)
  - [Bootstrapping](#bootstrapping)
- [Next steps](#next-steps)

## Requirements

Using this project requires having [Git] and [npm] installed.
You can follow [this guide](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) to install npm and [this guide](https://www.atlassian.com/git/tutorials/install-git) to install git.

[Git]: https://git-scm.com/
[npm]: https://www.npmjs.com/

## Structure

This repository has a [monorepo](https://en.wikipedia.org/wiki/Monorepo) structure.
This means that the source code of multiple npm packages is stored in a single git repository.
Some of these packages depend on each other, so storing them together allows for a faster development cycle.
In order to manage multiple packages, we use [Lerna] as a cornerstone of the project structure.
You don't need to install Lerna on your own, as it will be installed locally by npm.

The main functionality of Lerna is bootstrapping.
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
- `resources`. Resources files that are needed in the demos folder, such as images, etc.

[Lerna]: https://lerna.js.org/

## First steps

### Cloning the repository

On Linux or macOS, you can clone this repo as usual:

```sh
$ git clone https://github.com/wiris/html-integrations
```

On Windows, you will need to have administrator privileges or to activate [developer mode](https://docs.microsoft.com/en-us/windows/uwp/get-started/enable-your-device-for-development) in your account.
Then, use the `core.symlinks` option when cloning the repository:

```sh
$ git clone --config core.symlinks=true https://github.com/wiris/html-integrations
```

### Bootstrapping

After cloning this repo, run the following commands:

```sh
$ npm install
$ npm start
```

This will bootstrap the packages using Lerna.

## Next steps

- [Trying out the demos](demos/README.md)
- [Integrating MathType in your website](integration/README.md)
- [Development guide](development/README.md)
- [Contributing guidelines](contributing/README.md)
- [Code of conduct](code-of-conduct/README.md)
