/**
 * This class represents an editor listener. It implements the EditorListener [interface](http://www.wiris.net/demo/editor/docs/api/com/wiris/editor/EditorListener.html).
 * Contains all the logic to determine if an editor has changes or not.
 */
export default class EditorListener {
    /**
     * Returns an instance of the editor listener class.
     */
    constructor() {
        /**
         * Indicates if the content of the editor has changed.
         * @type {Boolean}
         */
        this.isContentChanged = false;

        /**
         * Indicates if the listener should be waiting for changes in the editor.
         * @type {Boolean}
         */
        this.waitingForChanges = false;
    }

    /**
     * Sets {@link EditorListener.isContentChanged} property.
     * @param {Boolean} value - The new vlue.
     */
    setIsContentChanged(value) {
        this.isContentChanged = value;
    };

    /**
     * Returns true if the content of the editor has been changed, false otherwise.
     * @return {Boolean}
     */
    getIsContentChanged() {
        return this.isContentChanged;
    };

    /**
     * Determines if the EditorListener should wait for any changes.
     * @param {Boolean} value - True if the editor should wait for changes, false otherwise.
     */
    setWaitingForChanges(value) {
        this.waitingForChanges = value;
    };

    /**
     * EditorListener method to overwrite.
     * @type {JsEditor}
     * @ignore
     */
    caretPositionChanged(editor) {};

    /**
     * EditorListener method to overwrite
     * @type {JsEditor}
     * @ignore
     */
    clipboardChanged(editor) {};

    /**
     * Determines if the content of an editor has been changed.
     * @param {JsEditor} editor - editor object.
     */
    contentChanged(editor) {
        if (this.waitingForChanges === true && this.isContentChanged === false) {
            this.isContentChanged = true;
        }
    }

    /**
     * EditorListener method to overwrite
     * @param {JsEditor} editor - The editor instance.
     */
    styleChanged(editor) {
    }

    /**
     * EditorListener method to overwrite
     * @param {JsEditor} - The editor instance.
     */
    transformationReceived(editor) {
    }
}