/**
 * This class represents a class to manage custom listeners.
 */
export default class Listeners {
    constructor() {
        /**
         * Array containing all custom listeners.
         * @type {Object[]}
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
     * @param {String} eventName - event name
     * @param {Event} event - event object.
     * @return {boolean} false if event has been prevented. true otherwise.
     */
    fire(eventName, event) {
        for (var i = 0; i < this.listeners.length && !event.cancelled; ++i) {
            if (this.listeners[i].eventName === eventName) {
                // Calling listener.
                this.listeners[i].callback(event);
            }
        }

        return event.defaultPrevented;
    }

    /**
     * Creates a new listener object.
     * @param {string} eventName - Event name.
     * @param {Object} callback - Callback function.
     * @returns {object} the listener object.
     */
    static newListener(eventName, callback) {
        var listener = {};
        listener.eventName = eventName;
        listener.callback = callback;
        return listener;
    }
}