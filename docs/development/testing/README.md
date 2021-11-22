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

## Record the tests on Cypress Dashboard

The test executions on this project can either be sent or not to Cypress Dashboard.

### Through GitHub actions

Tests are automatically recorded on our Cypress Dashboard through GitHub actions.
They're recorded for each:
* Automatically when a **Pull Request** is *created* or *re-opened* by a team member.
* Manually with a **Workflow dispatch**, trigger. It requests a string parameter with the following options:
    * `No`: Default parameter. Will run the tests but won't send them to record on the Cypress Dashboard.
    * `Yes`: Use this string to indicate the action to send the test run to Cypress Dashboard.

        Use this option to record the local pushed test executions only when necessary:
        * Each time there’s a new push to an opened pull request with code that can change the test behaviour (e.g: modify the mathtype-devkit package)
        * When created new tests for the first time, we want to detect the flaky ones. (we should have the flaky tests detected and handled before opening a pull request)
