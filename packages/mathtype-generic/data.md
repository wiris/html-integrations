# Parsing data

MathType integration, by default, stores the content as MathML and render it into the editable HTMLElement as images. In order to load the MathML data into the edit you should use the **Parser** class:

```js
WirisPlugin.Parser
```


## Loading data
To load data into the edit area you should use the following method:
```js
WirisPlugin.Parser.initParse(htmlData);
```
For instance, the following call:
```js
WirisPlugin.Parser.initParse('<math><mo>x</mo></math');
```
Returns the following image:
```html
<img style="max-width: none; vertical-align: -4px;" class="Wirisformula" src="data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Awrs%3D%22http%3A%2F%2Fwww.wiris.com%2Fxml%2Fcvs-extension%22%20height%3D%2219%22%20width%3D%2213%22%20wrs%3Abaseline%3D%2215%22%3E%3C!--MathML%3A%20%3Cmath%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F1998%2FMath%2FMathML%22%3E%3Cmo%3Ex%3C%2Fmo%3E%3C%2Fmath%3E--%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%2F%3E%3C%2Fdefs%3E%3Ctext%20font-family%3D%22Arial%22%20font-size%3D%2216%22%20text-anchor%3D%22middle%22%20x%3D%226.5%22%20y%3D%2215%22%3Ex%3C%2Ftext%3E%3C%2Fsvg%3E" data-mathml="«math»«mo»x«/mo»«/math»" alt="x" role="math" width="13" height="19" align="middle"/>
```

If you add the following JavaScript code into the previous example:
```js
var htmlElement = document.getElementById('example');
var data = 'Initial data: <math><msqrt><mo>x</mo></msqrt></math>'
htmlElement.innerHTML = WirisPlugin.Parser.initParse(data);
```
The HTML data will be inserted into the edit area by replacing the MatML with its correspondent image.

## Getting data

To save the content of the editable HTMLElement you should use the following method:

```js
WirisPlugin.Parser.endParse(htmlContent);
```

This method returns the HTML content by replacing MathType images with its correspondent MathML.

For example:
```js
WirisPlugin.Parser.endParse('<img style="max-width: none; vertical-align: -4px;" class="Wirisformula" src="data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Awrs%3D%22http%3A%2F%2Fwww.wiris.com%2Fxml%2Fcvs-extension%22%20height%3D%2219%22%20width%3D%2213%22%20wrs%3Abaseline%3D%2215%22%3E%3C!--MathML%3A%20%3Cmath%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F1998%2FMath%2FMathML%22%3E%3Cmo%3Ex%3C%2Fmo%3E%3C%2Fmath%3E--%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%2F%3E%3C%2Fdefs%3E%3Ctext%20font-family%3D%22Arial%22%20font-size%3D%2216%22%20text-anchor%3D%22middle%22%20x%3D%226.5%22%20y%3D%2215%22%3Ex%3C%2Ftext%3E%3C%2Fsvg%3E" data-mathml="«math»«mo»x«/mo»«/math»" alt="x" role="math" width="13" height="19" align="middle"/>');
```
Returns the following:
```html
<math><mo>x</mo></math>
```