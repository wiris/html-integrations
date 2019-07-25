# Menu Item

TinyMCE5 allows to define a list of items in the menu bar. This behavior can be configured through [menu](https://www.tiny.cloud/docs/configure/editor-appearance/#menu) and [menubar](https://www.tiny.cloud/docs/configure/editor-appearance/#menubar) configuration properties.

## Display MathType and ChemType as menu items

Update the TinyMCE configuration with the following parameters:

```js
{
...
menu: {
    mathtype: {
        title: 'Wiris', items: 'tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry'
    }
},
menubar : 'mathtype',
plugins: 'tiny_mce_wiris',
...
}
```
