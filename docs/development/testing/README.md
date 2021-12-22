# Testing

<small>[MathType Web Integrations](../../../README.md) → [Documentation](../../README.md) → [Development guide](../README.md) → Testing</small>

This project uses [Cypress][Cypress] to run integration and validation tests in order to cover all published packages.

[Cypress]: https://www.cypress.io/

## Table of contents

- [Run all tests at once](#run-all-tests-at-once)
    - [With the published packages](#with-the-published-packages)
    - [With the local packages](#with-the-local-packages)
- [Run all the tests for a specific demo](#run-all-the-tests-for-a-specific-demo)

## Before you begin

Linux's users will need to install `net-tools` to use Cypress. 

```bash
$ sudo apt install net-tools
```

Also, you will need to allow non-local connections to control the X server on your computer.

Run this command:

```bash
$ xhost local:root
```

> This has to be executed once after each reboot

## Testing commands

* `npm test`: To run the tests with the interactive mode.
* `npm test:run`: To run all the tests available at once.
* `npm test:ci`: Use this command to run the tests in the CI machine.

## Run all tests at once 

All tests can be executed with the `npm test:run` command from the root of the project.

> note that you can also use `npm test` to run the tests on an interactive mode.

The tests can run either with the published or local packages, depending on the `build` command you use.

### With the published packages

```sh
$ npm install
$ npm run build-generic-demo:public
$ npm test:run
```

### With the local packages

```sh
$ npm install
$ cp lerna.demos.json lerna.json
$ npm run build-generic-demo:local
$ npm test:run
```

## Run all the tests for a specific demo

// TODO