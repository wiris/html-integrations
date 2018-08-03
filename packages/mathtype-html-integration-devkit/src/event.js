/**
 * This class represents a custom event.
 */
export default class Event {
    /**
     * Class constructor.
     */
    constructor() {
        this.cancelled = false;
        this.defaultPrevented = false;
    }

    /**
     * Cancel the event.
     */
    cancel() {
        this.cancelled = true;
    }

    /**
     * Prevents the default action
     */
    preventDefault() {
        this.defaultPrevented = true;
    }
}