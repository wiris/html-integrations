/**
 * EditorListener class. This class implement EditorListener interface
 * and contains the logic to determine if editor has been changed or not.
 */
export default class EditorListener {
    constructor() {
        /**
         * Indicates if the content of the editor has changed.
         * @type {boolean}
         */
        this.isContentChanged = false;

        /**
         * Indicates if the listener should be waiting for changes in the editor.
         * @type {boolean}
         */
        this.waitingForChanges = false;
    }

    /**
     * EditorListener method set if content is changed
     * @param {boolean} value - true if the content has changed. false otherwise.
     */
    setIsContentChanged(value) {
        this.isContentChanged = value;
    };

    /**
     * Returns true if the content of the editor has been changed. false otherwise.
     * @return {boolean}
     */
    getIsContentChanged() {
        return this.isContentChanged;
    };

    /**
     * Indicates if the EditorListener should wait for any changes.
     * @param {boolean} value - true if the editor should wait for changes. false otherwise.
     */
    setWaitingForChanges(value) {
        this.waitingForChanges = value;
    };

    /**
     * EditorListener method to overwrite.
     */
    caretPositionChanged(editor) {};

    /**
     * EditorListener method to overwrite
     */
    clipboardChanged(editor) {};

    /**
     * This method contains all the logic to indicate if the content of the editor
     * has changed.
     * @param {JsEditor} editor - editor object.
     */
    contentChanged(editor) {
        if (this.waitingForChanges === true && this.isContentChanged === false) {
            this.isContentChanged = true;
        }
    }

    /**
     * EditorListener method to overwrite
     */
    styleChanged(editor){};

    /**
     * EditorListener method to overwrite
     */
    transformationReceived(editor) {}
}