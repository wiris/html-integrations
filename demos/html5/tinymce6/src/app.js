// Load styles.
import './static/style.css';

// Load the file that contains common imports between demos.
import * as Generic from '../../../../resources/demos/imports';

// Apply specific demo names to all the objects.
document.getElementById('header_title_name').innerHTML = 'Mathtype for TinyMCE';
document.getElementById('version_editor').innerHTML = 'TinyMCE editor: ';

// Copy the editor content before initializing it.
Generic.copyContentFromxToy('editor', 'transform_content');

const validMathML = [
  'math[*]',
  'maction[*]',
  'malignmark[*]',
  'maligngroup[*]',
  'menclose[*]',
  'merror[*]',
  'mfenced[*]',
  'mfrac[*]',
  'mglyph[*]',
  'mi[*]',
  'mlabeledtr[*]',
  'mlongdiv[*]',
  'mmultiscripts[*]',
  'mn[*]',
  'mo[*]',
  'mover[*]',
  'mpadded[*]',
  'mphantom[*]',
  'mprescripts[*]',
  'none[*]',
  'mroot[*]',
  'mrow[*]',
  'ms[*]',
  'mscarries[*]',
  'mscarry[*]',
  'msgroup[*]',
  'msline[*]',
  'mspace[*]',
  'msqrt[*]',
  'msrow[*]',
  'mstack[*]',
  'mstyle[*]',
  'msub[*]',
  'msubsup[*]',
  'msup[*]',
  'mtable[*]',
  'mtd[*]',
  'mtext[*]',
  'mtr[*]',
  'munder[*]',
  'munderover[*]',
  'semantics[*]',
  'annotation[*]',
];

// Set up the editor.
tinymce.init({
  selector: '#editor',
  external_plugins: {
    example: `${window.location.href}node_modules/@wiris/mathtype-tinymce6/plugin.min.js`,
  },
  // allow_html_in_named_anchor: true,
  valid_elements: '+*[*]',
  // cleanup : false,
  // automatic_uploads: false,
  // We recommend to set 'draggable_modal' to true to avoid overlapping issues
  // with the different UI modal dialog windows implementations between core and third-party plugins on TinyMCE.
  // @see: https://github.com/wiris/html-integrations/issues/134#issuecomment-905448642
  // draggable_modal: true,
  // element_format : 'html',
  // plugins: ['image', 'media'],
  // plugins: ['image', 'media'],
  // toolbar: 'undo redo | styleselect | bold italic | image media | tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry',
  toolbar: ' help | tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry',
  extended_valid_elements: '*[.*]',

  // language: 'fr_FR',
  // You could set a different language for MathType editor:
  // mathTypeParameters: {
  //   editorParameters: { language: 'de' },
  // },

  // Handle events.
  setup(editor) {
    // Launch on init event.
    editor.on('init', () => {
      // Get and set the editor and wiris versions in this order.
      Generic.setEditorAndWirisVersion(`${tinymce.majorVersion}.${tinymce.minorVersion}`, WirisPlugin.currentInstance.version);   //eslint-disable-line
      console.log(WirisPlugin);
    });
  },
});

// Add listener on click button to launch updateContent function.
document.getElementById('btn_update').addEventListener('click', (e) => {
  e.preventDefault();
  Generic.updateContent(tinyMCE.activeEditor.getContent(), 'transform_content');            //eslint-disable-line
  // console.log(WirisPlugin.Parser.initParse(tinyMCE.activeEditor.getContent()))
  // const patata = WirisPlugin.Parser.initParse(tinyMCE.activeEditor.getContent());
  // const patata2 = patata.replace('<span>','');
  // const patata3 = patata2.replace('</span>','')
  // tinyMCE.activeEditor.setContent(patata3);
});
