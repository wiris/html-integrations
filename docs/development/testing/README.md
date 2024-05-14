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

Before running the tests you will need to build all package and start all demos.

All tests can be run with the commands:

```sh
$ nx run-many --target=start --all --parallel
$ nx run-many --target=test --all --parallel
```

## Run all the tests for a specific demo

You can run all tests for a specific demo with the `nx test <package>` command.

Before running the tests you will need to build the package and start a demo. For example to run all tests on the `ckeditor5` demo run:

```
$ nx start html-ckeditor5
$ nx test ckeditor5
```
