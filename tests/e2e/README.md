# WIRIS HTML Editors E2E Tests - Playwright Migration

This project contains end-to-end tests for WIRIS HTML editors using Playwright.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Environment Configuration

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Configure the following environment variables:

- `BASE_URL`: Base URL for the tests (default: https://integrations.wiris.kitchen/)
- `HTML_EDITOR`: Pipe-separated list of editors to test (e.g., "generic|ckeditor5|tinymce8")
- `TEST_BRANCH`: wiris/html-integrations branch to test


## 🧪 Running Tests

### Basic Commands

```bash
# Run all tests
npm run test

# Run tests in headed mode (browser visible)
npm run test:headed

# Run tests with UI mode
npm run test:ui

# Run tests in debug mode
npm run test:debug
```

### Browser-Specific Tests

```bash
# Run tests in Chrome only
npm run test:chrome

# Run tests in Firefox only
npm run test:firefox

# Run tests in Safari only (WebKit)
npm run test:webkit
```

### Test Categories

```bash
# Run smoke tests
npm run test:smoke

# Run regression tests  
npm run test:regression
```

### Reports

```bash
# Show test report
npm run show-report
```

## 📁 Project Structure

```
playwright/
├── tests/                    # Test specifications
│   ├── insert/              # Insert equation tests
│   ├── edit/                # Edit equation tests
│   ├── latex/               # LaTeX tests
│   ├── modal/               # Modal dialog tests
│   ├── editor/              # Editor-specific tests
│   └── telemetry/           # Telemetry tests
├── page-objects/            # Page Object Model
│   ├── html/                # HTML editor implementations
│   │   └── editor/          # Specific HTML editors
│   ├── base_editor.ts       # Base editor class
│   ├── wiris_editor.ts      # WIRIS editor modal
│   ├── equation_entry_form.ts # Equation entry form
│   ├── editor_manager.ts    # Editor management
│   └── page.ts             # Base page class
├── enums/                   # Enumerations
│   ├── equations.ts         # Test equations
│   ├── toolbar.ts           # Toolbar types
│   └── typing_mode.ts       # Input modes
├── interfaces/              # TypeScript interfaces
│   └── equation.ts          # Equation interface
├── helpers/                 # Helper utilities
│   └── test-setup.ts        # Test setup helpers
├── playwright.config.ts     # Playwright configuration
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## 🔧 Configuration

### Playwright Configuration

The `playwright.config.ts` file contains:

- **Test Directory**: `./tests`
- **Parallel Execution**: Enabled for faster test runs
- **Retries**: 1 retry for flaky tests (2 in CI)
- **Browsers**: Chrome, Firefox, and Safari (WebKit)
- **Reporters**: HTML, JUnit, and Allure
- **Screenshots**: On failure
- **Videos**: On failure
- **Traces**: On first retry

### Editor Selection

Configure which editors to test using the `HTML_EDITOR` environment variable:

```bash
# Test specific editors
HTML_EDITOR="generic|ckeditor5"

# Test all editors
HTML_EDITOR="generic|ckeditor4|ckeditor5|froala|tinymce5|tinymce6|tinymce7|tinymce8"
```

## 🏗️ Page Object Model

The tests use the Page Object Model pattern for maintainability:

### Base Classes

- **`BasePage`**: Common page functionality
- **`BaseEditor`**: Abstract base for all editors with common methods

### Editor Implementations

Each editor (Generic, CKEditor, TinyMCE, Froala) has specific implementations for:
- Button selectors
- Edit field selectors  
- Special behavior (contextual toolbars, iframes)

### WIRIS Editor (MathType Web)

The `WirisEditor` class handles the WIRIS equation editor modal:
- Equation input via keyboard and forms
- MathML and LaTeX entry modes
- Hand-drawn equation support

## 🧪 Test Organization

### Test Categories

Tests are organized into categories using tags:

- `@smoke`: Critical functionality tests
- `@regression`: Comprehensive test coverage (All tests)

### Test Structure

Each test follows this pattern:

1. **Setup**: Initialize editor and WIRIS editor
2. **Open**: Navigate to the editor page
3. **Action**: Perform the test action (insert, edit, etc.)
4. **Verify**: Assert expected results

### Cross-Browser Testing

Tests run across multiple browsers:
- **Chromium**: Google Chrome
- **Firefox**: Mozilla Firefox  
- **WebKit**: Safari


## 🐛 Debugging

### Debug Mode

Run tests in debug mode to step through:

```bash
npm run test:debug
```

### Visual Debugging

Use UI mode for visual test debugging:

```bash
npm run test:ui
```

### Screenshots and Videos

Failed tests automatically capture:
- Screenshots
- Videos (if enabled)
- Traces for debugging

## 🤝 Contributing

1. Follow the existing Page Object Model pattern
2. Add appropriate test tags (`@smoke`, `@regression`)
3. Include JSDoc comments for new methods
4. Update this README for new features

## 📈 Continuous Integration
