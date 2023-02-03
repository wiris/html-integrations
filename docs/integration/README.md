# Integrating MathType in your website

<small>[MathType Web Integrations](../../README.md) → [Documentation](../README.md) → Integrating MathType in your website</small>

To integrate MathType on your website, take a look at the [demos](../demos/README.md) we have prepared.
In the case of Angular and React, each of the demos contains a README.md file explaining how MathType has been integrated.

## MathType Events

To capture events triggered by MathType editor, use the next code:

```js
// Capture onModalOpen event triggered when MT/CT editor is open
let modalOpenListener = window.WirisPlugin.Listeners.newListener('onModalOpen', () => {
  ... // Your callback function
});

window.WirisPlugin.Core.addGlobalListener(modalOpenListener);
```

### List of Global Events

- `onModalOpen()` Triggered when MT/CT editor modal is open
- `onModalClose()` Triggered when MT/CT editor modal is close
