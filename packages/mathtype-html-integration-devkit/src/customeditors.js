/**
 * This class represents MathType custom editors. A custom editor is athType editor with a different
 * toolbar. This class is necessary to associate a custom editor to:
 * - It's own formulas
 * - A custom toolbar
 * - An icon to open it from a HTML editor.
 * - A tooltip for the icon.
 * - A global variable to enable or disable it globally.
 */
export default class CustomEditors {

    constructor() {
        /**
         * Array containing all custom editors.
         * @type {Object[]}
         */

        this.editors = [];
        /**
         * Default editor name.
         * @type {string}
         */
        this.activeEditor = 'default';
    }

    /**
     * Adds a custom editor to editors property.
     * @param {string} editorName - editorName.
     * @param {Object} editorParams - custom editor params.
     * @param {string} editorParams.name - custom editor name.
     * @param {string} editorParams.toolbar - custom editor toolbar.
     * @param {string} editorParams.icon - custom editor icon.
     * @param {string} editorParams.confVariable - configuration key to retrieve if the custom editor is enabled.
     * @param {string} editorParams.title - custom editor title.
     * @param {string} editorParams.tooltip - custom editor tooltip associated with it's own icon.
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
     * Adds a customEditor to editors property.
     * @param {string} key - editor key.
     * @param {CustomEditor} customEditor - a custom editor class.
     */
    add(key, customEditor) {
        this.customEditors[key] = customEditor;
    }

    /**
     * Set as active a customEditor.
     * @param {string} customEditor - customEditor key.
     */
    enable(customEditor) {
        this.activeEditor = customEditor;
    }

    /**
     * Disables a custom editor.
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