# CI/CD

<small>[MathType Web Integrations](../../../README.md) → [Documentation](../../README.md) → [Development guide](../README.md) → CI/CD</small>

This project uses [GitHub actions](https://github.com/features/actions) for the CI/CD strategy.

**Table of contents**

- [Workflows](#workflows)
- [Actions secrets](#actions-secrets)

## Workflows

### Generate and validate the JSDoc site

This job uses JSDoc library to generate a static site as an artifact called `mathtype-html-integration-devkit-docs.zip`, from the comments on the library code.

### Run E2E tests
This workflow runs end-to-end tests across all supported HTML editors using Playwright. The tests are executed in a matrix strategy to enable parallel execution for each editor. See [docs/testing/README.md](../testing/README.md) for further details.

**Supported editors:**
- Generic HTML
- CKEditor 4 & 5
- Froala
- TinyMCE 5, 6, 7 & 8

**Key features:**
- **Parallel execution**: Each editor runs in its own job for faster feedback
- **Multi-browser testing**: Tests run on Chromium, Firefox, and WebKit
- **Timeout protection**: Each job has a 30-minute timeout to prevent hanging
- **Test reporting**: Results are published using JUnit format with detailed reports
- **Artifact collection**: Test reports are collected as downloadable artifacts

**Workflow triggers:**
- Push to master branch
- Pull requests
- Manual dispatch

The workflow builds the necessary packages, starts static file servers for each editor demo, and runs the Playwright test suite against them.


