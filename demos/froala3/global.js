import FroalaEditor from 'froala-editor'

// Load a plugin.
import 'froala-editor/js/plugins/align.min.js'

// Load styles 
import 'froala-editor/css/froala_editor.pkgd.min.css';

// Initialize editor.
new FroalaEditor('#editor', {
    toolbarButtons: ['undo', 'redo' , 'bold', '|','clear', 'insert']
});