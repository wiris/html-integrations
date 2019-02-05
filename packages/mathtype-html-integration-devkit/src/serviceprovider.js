import Util from './util.js';
import StringManager from './stringmanager';
import Listeners, { Listener } from './listeners';

/**
 * Class representing a serviceProvider. A serviceProvider is a class containing
 * an arbitrary number of services with the correspondent path.
 */
export default class ServiceProvider {

    /**
     * Returns Service Provider listeners.
     * @type {Listeners}
     */
    static get listeners() {
        return ServiceProvider._listeners;
    }

    /**
     * Adds a {@link Listener} instance to {@link ServiceProvider} class.
     * @param {Listener} listener - Instance of {@link Listener}.
     */
    static addListener(listener) {
        ServiceProvider.listeners.add(listener);
    }

    /**
     * Fires events in Service Provider.
     * @param {String} eventName - Event name.
     * @param {Event} event - Event object.
     */
    static fireEvent(eventName, event) {
        ServiceProvider.listeners.fire(eventName, event);
    }

    /**
     * Static property.
     * Return service provider paths.
     * @private
     * @type {String}
     */
    static get servicePaths() {
        return ServiceProvider._servicePaths;
    }

    /**
     * Static property setter.
     * Set service paths.
     * @param {String} value - The property value.
     * @ignore
     */
    static set servicePaths(value) {
        ServiceProvider._servicePaths = value;
    }

    /**
     * Adds a new service to the ServiceProvider.
     * @param {String} service - Service name.
     * @param {String} path - Service path.
     * @static
     */
    static setServicePath(service, path) {
        ServiceProvider.servicePaths[service] = path;
    }

    /**
     * Returns the service path for a certain service.
     * @param {String} serviceName - Service name.
     * @returns {String} The service path.
     * @static
     */
    static getServicePath(serviceName) {
        return ServiceProvider.servicePaths[serviceName];
    }

    /**
     * Static property.
     * Service provider integration path.
     * @type {String}
     */
    static get integrationPath() {
        return ServiceProvider._integrationPath;
    }

    /**
     * Static property setter.
     * Set service provider integration path.
     * @param {String} value - The property value.
     * @ignore
     */
    static set integrationPath(value) {
        ServiceProvider._integrationPath = value;
    }

    /**
     * Returns the server URL in the form protocol://serverName:serverPort.
     * @return {String} The client side server path.
     */
    static getServerURL() {
        const url = window.location.href;
        const arr = url.split("/");
        const result = arr[0] + "//" + arr[2];
        return result;
    }

    /**
     * Inits {@link this} class. Uses {@link this.integrationPath} as
     * base path to generate all backend services paths.
     * @param {Object} parameters - Function parameters.
     * @param {String} parameters.integrationPath - Service path.
     */
    static init(parameters) {
        const integrationPath = parameters.integrationPath;
        // Services path (tech dependant).
        let createImagePath = integrationPath.replace('configurationjs', 'createimage');
        let showImagePath = integrationPath.replace('configurationjs', 'showimage');
        let getMathMLPath = integrationPath.replace('configurationjs', 'getmathml');
        let servicePath = integrationPath.replace('configurationjs', 'service');

        // Some backend integrations (like Java o Ruby) have an absolute backend path,
        // for example: /app/service. For them we calculate the absolute URL path, i.e
        // protocol://domain:port/app/service
        if (integrationPath.indexOf("/") == 0) {
            const serverPath = ServiceProvider.getServerURL();
            showImagePath = serverPath + showImagePath;
            createImagePath = serverPath + createImagePath;
            getMathMLPath = serverPath + getMathMLPath;
            servicePath = serverPath + servicePath;
        }

        ServiceProvider.setServicePath('showimage', showImagePath);
        ServiceProvider.setServicePath('createimage', createImagePath);
        ServiceProvider.setServicePath('service', servicePath);
        ServiceProvider.setServicePath('getmathml', getMathMLPath);
        ServiceProvider.setServicePath('configurationjs', parameters.integrationPath);

        ServiceProvider.listeners.fire('onInit', {});
    }

    /**
     * Gets the content from an URL.
     * @param {String} url - Target URL.
     * @param {Object} [postVariables] - Object containing post variables. null if a GET query should be done.
     * @returns {String} Content of the target URL.
     * @private
     * @static
     */
    static getUrl(url, postVariables) {
        const currentPath = window.location.toString().substr(0, window.location.toString().lastIndexOf('/') + 1);
        const httpRequest = Util.createHttpRequest();

            if (httpRequest) {
                if (typeof postVariables === undefined || typeof postVariables == 'undefined') {
                    httpRequest.open('GET', url, false);
                }
                else if (url.substr(0, 1) == '/' || url.substr(0, 7) == 'http://' || url.substr(0, 8) == 'https://') {
                    httpRequest.open('POST', url, false);
                }
                else {
                    httpRequest.open('POST', currentPath + url, false);
                }

                if (postVariables !== undefined) {
                    httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
                    httpRequest.send(Util.httpBuildQuery(postVariables));
                }
                else {
                    httpRequest.send(null);
                }

                return httpRequest.responseText;
            }

            alert(StringManager.get('browser_no_compatible'));


        return '';
    }

    /**
     * Returns the response text of a certain service.
     * @param {String} service - Service name.
     * @param {String} postVariables - Post variables.
     * @param {Boolean} get - True if the request is GET instead of POST. false otherwise.
     * @returns {String} Service response text.
     */
    static getService(service, postVariables, get) {
        let response;
        if (get === true) {
            const serviceUrl = ServiceProvider.getServicePath(service) + '?' + postVariables;
            response = ServiceProvider.getUrl(serviceUrl);
        } else {
            const serviceUrl = ServiceProvider.getServicePath(service);
            response = ServiceProvider.getUrl(serviceUrl, postVariables);
        }
        return response;
    }
}

/**
 * @property {String} service - The service name.
 * @property {String} path - The service path.
 * @static
 */
ServiceProvider._servicePaths = {};

/**
 * The integration path. Contains the path of the configuration service.
 * Used to define the path for all services.
 * @type {String}
 * @private
 */
ServiceProvider._integrationPath = '';

/**
 * ServiceProvider static listeners.
 * @type {Listeners}
 * @private
 */
ServiceProvider._listeners = new Listeners();