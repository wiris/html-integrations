/**
 * EditorListener class. This class implement EditorListener interface
 * and contains the logic to determine if editor has been changed or not.
 * @ignore
 */
export default class EditorListener {
    constructor() {
        this.isContentChanged = false;
        this.waitingForChanges = false;
    }

    /**
     * EditorListener method set if content is changed
     * @ignore
     */
    setIsContentChanged (value) {
        this.isContentChanged = value;
    };
    /**
     * EditorListener method to get if content is changed
     * @ignore
     */
    getIsContentChanged (value) {
        return this.isContentChanged;
    };
    /**
     * EditorListener method to wait changes
     * @ignore
     */
    setWaitingForChanges (value) {
        this.waitingForChanges = value;
    };
    /**
     * EditorListener method to overwrite
     * @ignore
     */
    caretPositionChanged (editor) {};
    /**
     * EditorListener method to overwrite
     * @ignore
     */
    clipboardChanged (editor) {};
    /**
     * EditorListener method to set if content is changed
     * @ignore
     */
    contentChanged (editor) {
        if (this.waitingForChanges === true && this.isContentChanged === false) {
            this.isContentChanged = true;
        }
    }
    /**
     * EditorListener method to overwrite
     * @ignore
     */
    styleChanged (editor) {};
    /**
     * EditorListener method to overwrite
     * @ignore
     */
    transformationReceived (editor) {}
}