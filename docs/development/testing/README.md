# E2E Testing Documentation

## Overview

This project uses Playwright for end-to-end testing across multiple HTML editor integrations. The testing setup supports parallel execution across different editors with configurable environments.

## Test Structure

The E2E tests are located in `/tests/e2e/` with the following structure:

```
tests/e2e/
├── .env.example              # Environment configuration template
├── .env                      # (Optional) Local environment configuration; git-ignored
├── playwright.config.ts      # Playwright configuration
├── enums/                    # Shared enums for test logic
├── helpers/                  # Utility/helper functions
├── interfaces/               # Shared TypeScript interfaces
├── page-objects/             # Page object models
│   └── base_editor.ts        # Base editor class
│   └── html/                 # Page object for each editor test page
└── tests/                    # Test specifications
    ├── edit/                # Formula editing tests
    │   ├── edit_corner_cases.spec.ts
    │   ├── edit_hand.spec.ts
    │   ├── edit_via_doble_click.spec.ts
    │   └── edit_via_selection.spec.ts
    ├── editor/              # Editor functionality tests
    │   ├── copy_cut_drop.spec.ts
    │   └── editor.spec.ts
    ├── insert/              # Formula insertion tests
    │   ├── insert_corner_cases.spec.ts
    │   ├── insert_hand.spec.ts
    │   └── insert.spec.ts
    ├── latex/               # LaTeX functionality tests
    │   └── latex.spec.ts
    ├── modal/               # Modal dialog tests
    │   ├── confirmation_dialog.spec.ts
    │   └── toolbar.spec.ts
    └── telemetry/           # Analytics tests
        └── telemetry.spec.ts
```

## Supported Editors and Packages

The testing framework supports the following HTML editors with their corresponding localhost ports:
| Editor     | Port | Status |
|------------|------|--------|
| ckeditor4  | 8001 | ✅ Active |
| ckeditor5  | 8002 | ✅ Active |
| froala     | 8004 | ✅ Active |
| tinymce5   | 8006 | ✅ Active |
| tinymce6   | 8008 | ✅ Active |
| tinymce7   | 8009 | ✅ Active |
| tinymce8   | 8010 | ✅ Active |
| generic    | 8007 | ✅ Active |
| viewer     | ? | 📋 TODO |


## Environment Configuration

### Local Setup
You can configure your environment using an optional `.env` file or by setting variables directly in the CLI command, as explained below.

1. **Copy the environment template:**
   ```bash
   cp tests/e2e/.env.example tests/e2e/.env
   ```

2. **Configure your environment:**
   ```bash
   # tests/e2e/.env

   # Select editors to test (pipe-separated)
   HTML_EDITOR=generic|ckeditor4|ckeditor5

   # Environment selection
   USE_STAGING=false

   # Branch for staging tests
   TEST_BRANCH=master
   ```

### Environment Variables

| Variable | Description | Default | Example | Required |
|----------|-------------|---------|---------|----------|
| `HTML_EDITOR` | Pipe-separated list of editors to test | All editors | `generic\|ckeditor5` | Yes |
| `USE_STAGING` | Use staging environment vs localhost | `false` | `true\|false` | No |
| `TEST_BRANCH` | Git branch for staging tests | `master` | `feature-branch` | No |


## Running Tests

### Prerequisites

```bash
# Install dependencies
yarn install

# Install Playwright browsers
yarn playwright install --with-deps
```

### Local Development
The `yarn test:e2e` script is defined in the main package.json and runs the E2E tests.

Playwright is configured to pre-build both the package and test site (`demos` folder) for the configured
editors and deploy them in order to run the test. Don't pre-deploy the test page, Playwright will do it by itself.

```bash
# Run tests for specific editors
HTML_EDITOR=ckeditor5 yarn test:e2e

# Run tests for multiple editors
HTML_EDITOR=generic|froala yarn test:e2e

# Run all tests for all editors. If no HTML_EDITOR variable is set, all editors are tested
yarn test:e2e

# Run with staging environment
USE_STAGING=true yarn test:e2e

# Run specific browser
yarn test:e2e --project=webkit

# Run in headed mode
yarn test:e2e --headed

# Run specific test file
yarn test:e2e tests/insert/insert.spec.ts
```
[See the official Playwright CLI documentation](https://playwright.dev/docs/test-cli) for more details on available commands and options.


**Example workflow:**
```bash
# Build and test CKEditor5
yarn
HTML_EDITOR=ckeditor5 yarn test:e2e
```

## Playwright Configuration
See ([`playwright.config.ts`](../../../tests/e2e/playwright.config.ts)).


## CI/CD Integration

### GitHub Actions Workflow

The E2E tests are automated via GitHub Actions ([`run-e2e-tests.yml`](../../../.github/workflows/cypress-Run-tests-with-npm-packages.yml)):

- **When tests run**: On pushes to `main`, pull requests, and manual workflow dispatch
- **Parallelization**: Each editor runs in a separate job using matrix strategy for maximum parallel execution
- **Reports**:
  - Github reports appear in the GitHub Actions **Checks** tab
  - Failed tests create GitHub Actions annotations with direct links for quick debugging.
  - HTML reports and artifacts are attached to the workflow run.

## Test Coverage

| Test File | Category | Description |
|-----------|----------|-------------|
| `edit/edit_corner_cases.spec.ts` | Edit | Edge cases and error conditions in formula editing |
| `edit/edit_hand.spec.ts` | Edit | Manual formula modifications and handwriting input |
| `edit/edit_via_doble_click.spec.ts` | Edit | Editing formulas by double-clicking on existing formulas |
| `edit/edit_via_selection.spec.ts` | Edit | Editing formulas via text selection and context menu |
| `editor/copy_cut_drop.spec.ts` | Editor | Clipboard operations (copy/cut/paste) and drag-drop functionality |
| `editor/editor.spec.ts` | Editor | General editor behavior and integration tests |
| `insert/insert_corner_cases.spec.ts` | Insert | Edge cases and error conditions in formula insertion |
| `insert/insert_hand.spec.ts` | Insert | Manual formula creation via handwriting input |
| `insert/insert.spec.ts` | Insert | Standard formula insertion workflows and toolbar interactions |
| `latex/latex.spec.ts` | LaTeX | LaTeX rendering, parsing, and conversion functionality |
| `modal/confirmation_dialog.spec.ts` | Modal | Confirmation dialog interactions and user workflows |
| `modal/toolbar.spec.ts` | Modal | Toolbar modal functionality and behavior |
| `telemetry/telemetry.spec.ts` | Telemetry | Usage metrics, event tracking, and analytics validation |


# TODOs
This project previously used cypress for E2E testing. There might still be some reference to Cypress in the code (e.g.: see test section in the demos `project.json` files). These must be deleteded.
- Remove cypress refereces in the `project.json` files
- Remove cypress dashboard secrets in the repository
- Remove old documentation cypress references.

