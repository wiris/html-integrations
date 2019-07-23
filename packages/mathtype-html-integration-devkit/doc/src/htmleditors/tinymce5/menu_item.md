# Menu Item

TinyMCE5 allows to define a list of items in the menu bar. This behavior can be configured through [menu](https://www.tiny.cloud/docs/configure/editor-appearance/#menu) and [menubar](https://www.tiny.cloud/docs/configure/editor-appearance/#menubar) configuration properties.

## Steps to display Wiris menu item

In order to display a Wiris menu item it is necessary having [**_MathType for TinyMCE_**](https://www.npmjs.com/package/@wiris/mathtype-tinymce5) and **load the next configuration** in TinyMCE5.

```
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