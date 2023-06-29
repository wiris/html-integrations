import git from "../git-data.json";

/**
 * Copies the content of an element x as the content of an element y.
 * @param {String} x Identifier of the element to take its content.
 * @param {String} y Identifier of the element where to copy the content of x.
 */
export function copyContentFromxToy(x, y) {
  const content = document.getElementById(x).innerHTML;
  document.getElementById(y).innerHTML = content;
}

/**
 * Sets the editor, the wiris plugins version, the GitHub branch and commit on the front end page.
 * @param {*} editorVersion Version of the current editor.
 * @param {*} wirisVersion Version of the wiris plugin used.
 */
export function setEditorAndWirisVersion(editorVersion = 0, wirisVersion = 0) {
  if (wirisVersion !== 0) document.getElementById('version_wiris').innerHTML += wirisVersion;
  if (editorVersion !== 0) document.getElementById('version_editor').innerHTML += editorVersion;
  document.getElementById('git_branch').innerHTML += 'Branch: ' + git.branch;
  document.getElementById('git_commit').innerHTML += 'Commit hash: ' + git.hash;
}

/**
 * Takes the editor content,
 * Transforms it into an image,
 * Places it on a reserved containder identified with and idContainer.
 * @param {*} editorContent Content of the editor to be transformed.
 * @param {String} containerId Identifier of the container place.
 */
export function updateContent(editorContent, containerId) {
  document.getElementById(containerId).innerHTML = editorContent;
  com.wiris.js.JsPluginViewer.parseElement(document.getElementById(containerId)); //eslint-disable-line
}

// Initial content for the editors that use <math> for loading content
export const editorContentMathML = `<div>MathType - Keyboard: <math xmlns="http://www.w3.org/1998/Math/MathML"><msqrt><mi>x</mi></msqrt></math></div>
<div>MathType - Handwriting: <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mfrac><mi>x</mi><mn>3</mn></mfrac><annotation encoding="application/json">{"x":[[8,64,120],[50,74],[49,75],[50,79,80,50,51,63,74,79,78,66,54,48]],"y":[[89,89,89],[7,72],[72,7],[105,105,105,147,147,146,152,168,204,213,211,197]],"t":[[0,0,0],[0,0],[0,0],[0,0,0,0,0,0,0,0,0,0,0,0]],"version":"2.0.0"}</annotation></semantics></math></div>
<div>ChemType - Keyboard: <math xmlns="http://www.w3.org/1998/Math/MathML" class="wrs_chemistry"><msup><mi mathvariant="normal">x</mi><mn>2</mn></msup></math></div>
<div>ChemType - Handwriting: <math xmlns="http://www.w3.org/1998/Math/MathML" class="wrs_chemistry"><semantics><msub><mi>x</mi><mn>4</mn></msub><annotation encoding="application/json">{"x":[[5,29],[4,30],[52,52,52,41,41,56]],"y":[[7,72],[72,7],[100,48,48,84,84,84]],"t":[[0,0],[0,0],[0,0,0,0,0,0]],"version":"2.0.0"}</annotation></semantics></math></div>
`;

// Initial content for the editors that use <img> for loading content
export const editorContentImg = `<div>MathType - Keyboard: <img style="max-width: none; vertical-align: -4px;" class="Wirisformula" src="data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Awrs%3D%22http%3A%2F%2Fwww.wiris.com%2Fxml%2Fmathml-extension%22%20height%3D%2223%22%20width%3D%2226%22%20wrs%3Abaseline%3D%2219%22%3E%3C!--MathML%3A%20%3Cmath%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F1998%2FMath%2FMathML%22%3E%3Cmsqrt%3E%3Cmi%3Ex%3C%2Fmi%3E%3C%2Fmsqrt%3E%3C%2Fmath%3E--%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%2F%3E%3C%2Fdefs%3E%3Cpolyline%20fill%3D%22none%22%20points%3D%2212%2C-16%2011%2C-16%205%2C0%202%2C-6%22%20stroke%3D%22%23000000%22%20stroke-linecap%3D%22square%22%20stroke-width%3D%221%22%20transform%3D%22translate(0.5%2C20.5)%22%2F%3E%3Cpolyline%20fill%3D%22none%22%20points%3D%225%2C0%202%2C-6%200%2C-5%22%20stroke%3D%22%23000000%22%20stroke-linecap%3D%22square%22%20stroke-width%3D%221%22%20transform%3D%22translate(0.5%2C20.5)%22%2F%3E%3Cline%20stroke%3D%22%23000000%22%20stroke-linecap%3D%22square%22%20stroke-width%3D%221%22%20x1%3D%2212.5%22%20x2%3D%2224.5%22%20y1%3D%224.5%22%20y2%3D%224.5%22%2F%3E%3Ctext%20font-family%3D%22Arial%22%20font-size%3D%2216%22%20font-style%3D%22italic%22%20text-anchor%3D%22middle%22%20x%3D%2218.5%22%20y%3D%2219%22%3Ex%3C%2Ftext%3E%3C%2Fsvg%3E" data-mathml="«math xmlns=¨http://www.w3.org/1998/Math/MathML¨»«msqrt»«mi»x«/mi»«/msqrt»«/math»" alt="square root of x" role="math" width="26" height="23" align="middle"></div>
<div>MathType - Handwriting: <img style="max-width: none; vertical-align: -15px;" class="Wirisformula" src="data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Awrs%3D%22http%3A%2F%2Fwww.wiris.com%2Fxml%2Fmathml-extension%22%20height%3D%2241%22%20width%3D%2218%22%20wrs%3Abaseline%3D%2226%22%3E%3C!--MathML%3A%20%3Cmath%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F1998%2FMath%2FMathML%22%3E%3Cmfrac%3E%3Cmi%3Ex%3C%2Fmi%3E%3Cmn%3E3%3C%2Fmn%3E%3C%2Fmfrac%3E%3C%2Fmath%3E--%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%2F%3E%3C%2Fdefs%3E%3Cline%20stroke%3D%22%23000000%22%20stroke-linecap%3D%22square%22%20stroke-width%3D%221%22%20x1%3D%222.5%22%20x2%3D%2214.5%22%20y1%3D%2220.5%22%20y2%3D%2220.5%22%2F%3E%3Ctext%20font-family%3D%22Arial%22%20font-size%3D%2216%22%20font-style%3D%22italic%22%20text-anchor%3D%22middle%22%20x%3D%228.5%22%20y%3D%2215%22%3Ex%3C%2Ftext%3E%3Ctext%20font-family%3D%22Arial%22%20font-size%3D%2216%22%20text-anchor%3D%22middle%22%20x%3D%228.5%22%20y%3D%2237%22%3E3%3C%2Ftext%3E%3C%2Fsvg%3E" data-mathml="«math xmlns=¨http://www.w3.org/1998/Math/MathML¨»«semantics»«mfrac»«mi»x«/mi»«mn»3«/mn»«/mfrac»«annotation encoding=¨application/json¨»{¨x¨:[[8,64,120],[50,74],[49,75],[50,79,80,50,51,63,74,79,78,66,54,48]],¨y¨:[[89,89,89],[7,72],[72,7],[105,105,105,147,147,146,152,168,204,213,211,197]],¨t¨:[[0,0,0],[0,0],[0,0],[0,0,0,0,0,0,0,0,0,0,0,0]],¨version¨:¨2.0.0¨}«/annotation»«/semantics»«/math»" alt="x over 3" role="math" width="18" height="41" align="middle"></div>
<div>ChemType - Keyboard: <img style="max-width: none; vertical-align: -4px;" class="Wirisformula" data-custom-editor="chemistry" src="data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Awrs%3D%22http%3A%2F%2Fwww.wiris.com%2Fxml%2Fmathml-extension%22%20height%3D%2222%22%20width%3D%2216%22%20wrs%3Abaseline%3D%2218%22%3E%3C!--MathML%3A%20%3Cmath%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F1998%2FMath%2FMathML%22%20class%3D%22wrs_chemistry%22%3E%3Cmsup%3E%3Cmi%20mathvariant%3D%22normal%22%3Ex%3C%2Fmi%3E%3Cmn%3E2%3C%2Fmn%3E%3C%2Fmsup%3E%3C%2Fmath%3E--%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%2F%3E%3C%2Fdefs%3E%3Ctext%20font-family%3D%22Arial%22%20font-size%3D%2216%22%20text-anchor%3D%22middle%22%20x%3D%224.5%22%20y%3D%2218%22%3Ex%3C%2Ftext%3E%3Ctext%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20text-anchor%3D%22middle%22%20x%3D%2211.5%22%20y%3D%2211%22%3E2%3C%2Ftext%3E%3C%2Fsvg%3E" data-mathml="«math xmlns=¨http://www.w3.org/1998/Math/MathML¨ class=¨wrs_chemistry¨»«msup»«mi mathvariant=¨normal¨»x«/mi»«mn»2«/mn»«/msup»«/math»" alt="x squared" role="math" width="16" height="22" align="middle"></div>
<div>ChemType - Handwriting: <img style="max-width: none; vertical-align: -9px;" class="Wirisformula" data-custom-editor="chemistry" src="data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Awrs%3D%22http%3A%2F%2Fwww.wiris.com%2Fxml%2Fmathml-extension%22%20height%3D%2224%22%20width%3D%2217%22%20wrs%3Abaseline%3D%2215%22%3E%3C!--MathML%3A%20%3Cmath%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F1998%2FMath%2FMathML%22%20class%3D%22wrs_chemistry%22%3E%3Cmsub%3E%3Cmi%3Ex%3C%2Fmi%3E%3Cmn%3E4%3C%2Fmn%3E%3C%2Fmsub%3E%3C%2Fmath%3E--%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%2F%3E%3C%2Fdefs%3E%3Ctext%20font-family%3D%22Arial%22%20font-size%3D%2216%22%20font-style%3D%22italic%22%20text-anchor%3D%22middle%22%20x%3D%224.5%22%20y%3D%2215%22%3Ex%3C%2Ftext%3E%3Ctext%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20text-anchor%3D%22middle%22%20x%3D%2212.5%22%20y%3D%2220%22%3E4%3C%2Ftext%3E%3C%2Fsvg%3E" data-mathml="«math xmlns=¨http://www.w3.org/1998/Math/MathML¨ class=¨wrs_chemistry¨»«semantics»«msub»«mi»x«/mi»«mn»4«/mn»«/msub»«annotation encoding=¨application/json¨»{¨x¨:[[5,29],[4,30],[52,52,52,41,41,56]],¨y¨:[[7,72],[72,7],[100,48,48,84,84,84]],¨t¨:[[0,0],[0,0],[0,0,0,0,0,0]],¨version¨:¨2.0.0¨}«/annotation»«/semantics»«/math»" alt="italic x subscript 4" role="math" width="17" height="24" align="middle"></div>
`;
