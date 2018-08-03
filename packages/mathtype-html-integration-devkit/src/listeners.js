/**
 * This class represents a class to manage custom listeners.
 */
export default class Listeners {
    constructor() {
        /**
         * Array containing all custom listeners.
         * @type {Array}
         */
        this.listeners = [];
    }


    /**
     * Add a listener to Listener class.
     * @param {Object} listener - A listener object.
     */
    add(listener) {
        this.listeners.push(listener);
    }

    /**
     * Fires MathType event listeners
     * @param  {String} eventName event name
     * @param  {Object} event properties
     * @return {bool} false if event has been prevented.
     * @ignore
     */
    fire(eventName, e) {
        for (var i = 0; i < this.listeners.length && !e.cancelled; ++i) {
            if (this.listeners[i].eventName === eventName) {
                // Calling listener.
                this.listeners[i].callback(e);
            }
        }

        return e.defaultPrevented;
    }

    /**
     * Creates a new listener.
     * @param {string} eventName  - Event name.
     * @param {string} callback - Callback function.
     * @returns {object} returns the listener object.
     */
    static newListener(eventName, callback) {
        var listener = {};
        listener.eventName = eventName;
        listener.callback = callback;
        return listener;
    }
}