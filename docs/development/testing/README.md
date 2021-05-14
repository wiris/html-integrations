# Testing

<small>[⇱ Back to root](../../README.md)<br>[↖ Back to Development guide](../README.md)</small>

We have prepared a set of tests to validate our packages code and developer code examples.
There are unit, integration and E2E tests; for the latter we have used an extension called [Puppeteer].

[Puppeteer]: https://pptr.dev/

## Table of contents

- [Run all tests at once](#run-all-tests-at-once)
- [Run all tests for a specific package](#run-all-tests-for-a-specific-package)
- [Run all the tests for a specific demo](#run-all-the-tests-for-a-specific-demo)

## Run all tests at once

All tests can be executed with the `npm test` command from the root of the project.
Tests will be run on all packages and all the existing demos.

```sh
$ npm test
```

## Run all tests for a specific package

You can run the tests of a package:

```sh
$ npm install
$ npm test
```

## Run all the tests for a specific demo

You can run all the tests a demo:

```sh
$ npm install
$ npm start
# Wait for the demo to start.
# Then, run the tests on a new terminal in the same folder.
$ npm test
```
