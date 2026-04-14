# MathType for CKEditor5 (SDK-based)

MathType Web plugin for CKEditor5 built on the MathType Integrations SDK (`@wiris/mathtype.integrations.sdk`).

This is a lightweight integration that provides only the **MathType** button to open the formula editor modal. It does **not** include ChemType.

## Installation

```sh
npm install @wiris/mathtype-ckeditor5-sdk
```

## Usage

```js
import MathType from '@wiris/mathtype-ckeditor5-sdk';

ClassicEditor
  .create(document.querySelector('#editor'), {
    plugins: [MathType, /* ... other plugins */],
    toolbar: ['MathType', /* ... other toolbar items */],
    // Optional: configure MathType parameters
    mathTypeParameters: {
      // SDK configuration
      sdkConfig: {
        url: 'https://www.wiris.net/demo/editor',
        variant: 'modern',
        environment: 'production',
      },
      // Editor modal configuration
      editorModalConfig: {
        language: 'en',
      },
    },
  })
  .catch(error => {
    console.error(error);
  });
```

## Configuration

You can pass configuration through the `mathTypeParameters` key in CKEditor5 config:

| Parameter | Type | Description |
|-----------|------|-------------|
| `sdkConfig` | `Partial<SdkConfig>` | SDK configuration (url, variant, environment) |
| `editorModalConfig` | `EditorModalConfig` | Editor modal configuration (language, editor config, modal config) |

## Differences from `@wiris/mathtype-ckeditor5`

- Uses the new `@wiris/mathtype.integrations.sdk` instead of `@wiris/mathtype-html-integration-devkit`
- Only includes the MathType button (no ChemType)
- Simplified architecture leveraging the SDK's built-in modal and editor components
