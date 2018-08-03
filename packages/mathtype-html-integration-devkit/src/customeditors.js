/**
 * This class manages MathType custom editors. A custom editor is an editor which is a MathType editor with a different
 * toolbar. This class is necessary to associate a custom editor to:
 * - It's own formulas
 * - A custom toolbar
 * - An icon to open it from a HTML editor.
 * - A tooltip for the icon.
 * - A global variable to enable or disable it globally.
 */
export default class CustomEditors {

    constructor() {
        this.editors = {};
        this.activeEditor = 'default';
    }

    /**
     * Add a custom editor to editors property.
     * A custom editor is an object with the following parameters:
     * - name
     * - toolbar
     * - icon
     * - confVariable
     * - title
     * - tooltip
     * @param {string} editorName - editorName
     * @param {object} editorParams  - custom editor params
     */
    addEditor(editorName, editorParams) {
        var customEditor= {};
        customEditor.name = editorParams.name;
        customEditor.toolbar = editorParams.toolbar;
        customEditor.icon = editorParams.icon;
        customEditor.confVariable = editorParams.confVariable;
        customEditor.title = editorParams.title;
        customEditor.tooltip = editorParams.tooltip;
        this.editors[editorName] = customEditor;
    }

    /**
     * Adds to Core instance a new custom editor.
     * @param {string} key - editor key (usually toolbar name)
     * @param {CustomEditor} customEditor - a custom editor class.
     */
    add(key, customEditor) {
        this.customEditors[key] = customEditor;
    }

    /**
     * Set active a customEditor.
     * @param {string} customEditor - customEditor key.
     */
    enable(customEditor) {
        this.activeEditor = customEditor;
    }

    /**
     * Disable a custom editor.
     */
    disable() {
        this.activeEditor = 'default';
    }

    /**
     * Returns the active editor key.
     * @return {object} - If a custom editor is enabled, returns the custom editor object. Null otherwise.
     */
    getActiveEditor() {
        if (this.activeEditor != 'default') {
            return this.editors[this.activeEditor];
        } else {
            return null;
        }
    }

}