# Testing

<small>[MathType Web Integrations](../../../README.md) → [Documentation](../../README.md) → [Development guide](../README.md) → Testing</small>

This project uses [Cypress][Cypress] to run integration and validation tests in order to cover all published packages.

[Cypress]: https://www.cypress.io/

## Table of contents

- [Run all tests at once](#run-all-tests-at-once)
- [Run all the tests for a specific demo](#run-all-the-tests-for-a-specific-demo)

## Before you begin

Linux users will need to install `net-tools` to use Cypress. 

```bash
$ sudo apt install net-tools
```

Also, you will need to allow non-local connections to control the X server on your computer.

Run this command:

```bash
$ xhost local:root
```

> This has to be executed once after each reboot

## Run all tests at once

All tests can be executed with the `npm test` command from the root of the project.

All available tests will be run.

```sh
$ npm install
$ npm run build
$ npm test
```

## Run all the tests for a specific demo

// TODO