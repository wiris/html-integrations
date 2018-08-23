import Core from './core.src.js';
import Listeners from './listeners.js';

var backwardsLib;
export default backwardsLib;

// Backwards compatibility methods.
/**
 * Add a new callback to a MathType listener.
 * @param {object} listener an Object containing listener name and a callback.
 * @tutorial tutorial
 */
function wrs_addPluginListener(jsonListener) {
    // TODO: Add documentation URL + doc example.
    console.warn('Deprecated method');
    var eventName;
    eventName = Object.keys(jsonListener)[0];
    var callback;
    callback = jsonListener[eventName];
    var pluginListener = Listeners.newListener(eventName, callback);
    Core.addGlobalListener(pluginListener);
}

window.wrs_addPluginListener = wrs_addPluginListener;