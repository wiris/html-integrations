// Load styles.
import 'froala-editor/css/froala_editor.pkgd.min.css';
import './static/style.css';

// Load the file that contains common imports between demos.
import * as Generic from 'resources/demos/imports';

// Apply specific demo names to all the objects.
document.getElementById('header_title_name').innerHTML = 'Mathtype for Froala';
document.getElementById('version_editor').innerHTML = 'Froala editor: ';

// Copy the editor content before initializing it.
Generic.copyContentFromxToy('editor', 'transform_content');

// Initialize editor.
new FroalaEditor('#editor', {                                                                                                 //eslint-disable-line
  // Define the toolbar options for the froala editor.
  toolbarButtons: ['undo', 'redo', 'bold', 'italic', '|', 'wirisEditor', 'wirisChemistry', 'insertImage'],

  // Add [MW] buttons to the image editing popup Toolbar.
  imageEditButtons: ['wirisEditor', 'wirisChemistry', 'imageDisplay', 'imageAlign', 'imageInfo', 'imageRemove'],

  // Allow all the tags to understand the mathml
  htmlAllowedTags: ['.*'],
  htmlAllowedAttrs: ['.*'],

  // List of tags that are not removed when they have no content inside
  // so that formulas renderize propertly
  htmlAllowedEmptyTags: ['mprescripts', 'none'],

  // Remove "Powered by Froala" water mark
  attribution: false,

  // Froala editor language
  // language: 'de',
  // You could set a different language for MathType editor:
  // mathTypeParameters: {
  //   editorParameters: { language: 'es' },
  // },

  // Execute on initialized editor.
  events: {
    initialized() {
      // Get and set the editor and wiris versions in this order.
      Generic.setEditorAndWirisVersion(FroalaEditor.VERSION, WirisPlugin.currentInstance.version);        //eslint-disable-line

      // Set initial content
      this.html.set(`<div>MathType - Keyboard: <img
  style="max-width: none; vertical-align: -4px;"
  class="Wirisformula"
  src="data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Awrs%3D%22http%3A%2F%2Fwww.wiris.com%2Fxml%2Fmathml-extension%22%20height%3D%2223%22%20width%3D%2226%22%20wrs%3Abaseline%3D%2219%22%3E%3C!--MathML%3A%20%3Cmath%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F1998%2FMath%2FMathML%22%3E%3Cmsqrt%3E%3Cmi%3Ex%3C%2Fmi%3E%3C%2Fmsqrt%3E%3C%2Fmath%3E--%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%2F%3E%3C%2Fdefs%3E%3Cpolyline%20fill%3D%22none%22%20points%3D%2212%2C-16%2011%2C-16%205%2C0%202%2C-6%22%20stroke%3D%22%23000000%22%20stroke-linecap%3D%22square%22%20stroke-width%3D%221%22%20transform%3D%22translate(0.5%2C20.5)%22%2F%3E%3Cpolyline%20fill%3D%22none%22%20points%3D%225%2C0%202%2C-6%200%2C-5%22%20stroke%3D%22%23000000%22%20stroke-linecap%3D%22square%22%20stroke-width%3D%221%22%20transform%3D%22translate(0.5%2C20.5)%22%2F%3E%3Cline%20stroke%3D%22%23000000%22%20stroke-linecap%3D%22square%22%20stroke-width%3D%221%22%20x1%3D%2212.5%22%20x2%3D%2224.5%22%20y1%3D%224.5%22%20y2%3D%224.5%22%2F%3E%3Ctext%20font-family%3D%22Arial%22%20font-size%3D%2216%22%20font-style%3D%22italic%22%20text-anchor%3D%22middle%22%20x%3D%2218.5%22%20y%3D%2219%22%3Ex%3C%2Ftext%3E%3C%2Fsvg%3E"
  data-mathml="«math xmlns=¨http://www.w3.org/1998/Math/MathML¨»«msqrt»«mi»x«/mi»«/msqrt»«/math»"
  alt="square root of x"
  role="math"
  width="26"
  height="23"
  align="middle"></div>
<div>MathType - Handwriting: <img
  style="max-width: none; vertical-align: -15px;"
  class="Wirisformula"
  src="data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Awrs%3D%22http%3A%2F%2Fwww.wiris.com%2Fxml%2Fmathml-extension%22%20height%3D%2241%22%20width%3D%2218%22%20wrs%3Abaseline%3D%2226%22%3E%3C!--MathML%3A%20%3Cmath%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F1998%2FMath%2FMathML%22%3E%3Cmfrac%3E%3Cmi%3Ex%3C%2Fmi%3E%3Cmn%3E3%3C%2Fmn%3E%3C%2Fmfrac%3E%3C%2Fmath%3E--%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%2F%3E%3C%2Fdefs%3E%3Cline%20stroke%3D%22%23000000%22%20stroke-linecap%3D%22square%22%20stroke-width%3D%221%22%20x1%3D%222.5%22%20x2%3D%2214.5%22%20y1%3D%2220.5%22%20y2%3D%2220.5%22%2F%3E%3Ctext%20font-family%3D%22Arial%22%20font-size%3D%2216%22%20font-style%3D%22italic%22%20text-anchor%3D%22middle%22%20x%3D%228.5%22%20y%3D%2215%22%3Ex%3C%2Ftext%3E%3Ctext%20font-family%3D%22Arial%22%20font-size%3D%2216%22%20text-anchor%3D%22middle%22%20x%3D%228.5%22%20y%3D%2237%22%3E3%3C%2Ftext%3E%3C%2Fsvg%3E"
  data-mathml="«math xmlns=¨http://www.w3.org/1998/Math/MathML¨»«semantics»«mfrac»«mi»x«/mi»«mn»3«/mn»«/mfrac»«annotation encoding=¨application/json¨»{¨x¨:[[8,64,120],[50,74],[49,75],[50,79,80,50,51,63,74,79,78,66,54,48]],¨y¨:[[89,89,89],[7,72],[72,7],[105,105,105,147,147,146,152,168,204,213,211,197]],¨t¨:[[0,0,0],[0,0],[0,0],[0,0,0,0,0,0,0,0,0,0,0,0]],¨version¨:¨2.0.0¨}«/annotation»«/semantics»«/math»"
  alt="x over 3"
  role="math"
  width="18"
  height="41"
  align="middle"></div>
<div>ChemType - Keyboard: <img
  style="max-width: none; vertical-align: -4px;"
  class="Wirisformula"
  data-custom-editor="chemistry"
  src="data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Awrs%3D%22http%3A%2F%2Fwww.wiris.com%2Fxml%2Fmathml-extension%22%20height%3D%2222%22%20width%3D%2216%22%20wrs%3Abaseline%3D%2218%22%3E%3C!--MathML%3A%20%3Cmath%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F1998%2FMath%2FMathML%22%20class%3D%22wrs_chemistry%22%3E%3Cmsup%3E%3Cmi%20mathvariant%3D%22normal%22%3Ex%3C%2Fmi%3E%3Cmn%3E2%3C%2Fmn%3E%3C%2Fmsup%3E%3C%2Fmath%3E--%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%2F%3E%3C%2Fdefs%3E%3Ctext%20font-family%3D%22Arial%22%20font-size%3D%2216%22%20text-anchor%3D%22middle%22%20x%3D%224.5%22%20y%3D%2218%22%3Ex%3C%2Ftext%3E%3Ctext%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20text-anchor%3D%22middle%22%20x%3D%2211.5%22%20y%3D%2211%22%3E2%3C%2Ftext%3E%3C%2Fsvg%3E"
  data-mathml="«math xmlns=¨http://www.w3.org/1998/Math/MathML¨ class=¨wrs_chemistry¨»«msup»«mi mathvariant=¨normal¨»x«/mi»«mn»2«/mn»«/msup»«/math»"
  alt="x squared"
  role="math"
  width="16"
  height="22"
  align="middle"></div>
<div>ChemType - Handwriting: <img
  style="max-width: none; vertical-align: -9px;"
  class="Wirisformula"
  data-custom-editor="chemistry"
  src="data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Awrs%3D%22http%3A%2F%2Fwww.wiris.com%2Fxml%2Fmathml-extension%22%20height%3D%2224%22%20width%3D%2217%22%20wrs%3Abaseline%3D%2215%22%3E%3C!--MathML%3A%20%3Cmath%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F1998%2FMath%2FMathML%22%20class%3D%22wrs_chemistry%22%3E%3Cmsub%3E%3Cmi%3Ex%3C%2Fmi%3E%3Cmn%3E4%3C%2Fmn%3E%3C%2Fmsub%3E%3C%2Fmath%3E--%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%2F%3E%3C%2Fdefs%3E%3Ctext%20font-family%3D%22Arial%22%20font-size%3D%2216%22%20font-style%3D%22italic%22%20text-anchor%3D%22middle%22%20x%3D%224.5%22%20y%3D%2215%22%3Ex%3C%2Ftext%3E%3Ctext%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20text-anchor%3D%22middle%22%20x%3D%2212.5%22%20y%3D%2220%22%3E4%3C%2Ftext%3E%3C%2Fsvg%3E"
  data-mathml="«math xmlns=¨http://www.w3.org/1998/Math/MathML¨ class=¨wrs_chemistry¨»«semantics»«msub»«mi»x«/mi»«mn»4«/mn»«/msub»«annotation encoding=¨application/json¨»{¨x¨:[[5,29],[4,30],[52,52,52,41,41,56]],¨y¨:[[7,72],[72,7],[100,48,48,84,84,84]],¨t¨:[[0,0],[0,0],[0,0,0,0,0,0]],¨version¨:¨2.0.0¨}«/annotation»«/semantics»«/math»"
  alt="italic x subscript 4"
  role="math"
  width="17"
  height="24"
  align="middle"></div>`);

    },
  },
});

// Add listener on click button to launch updateContent function.
document.getElementById('btn_update').addEventListener('click', (e) => {
  e.preventDefault();
  Generic.updateContent(FroalaEditor.INSTANCES[0].html.get(), 'transform_content');                     //eslint-disable-line
});
