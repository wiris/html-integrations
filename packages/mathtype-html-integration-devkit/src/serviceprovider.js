import Util from './util.js';
/**
 * Class representing a serviceProvider. A serviceProvider is a class containing
 * an arbitrary number of services with the correspondent path.
 */
export default class ServiceProvider {

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
     * Gets the content from an URL.
     * @param {String} url - Target URL.
     * @param {Object} postVariables - Object containing post variables. null if a GET query should be done.
     * @returns {String} Content of the target URL.
     * @static
     */
    static getUrl(url, postVariables) {
        var currentPath = window.location.toString().substr(0, window.location.toString().lastIndexOf('/') + 1);
        var httpRequest = Util.createHttpRequest();

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

            alert(Core.getStringManager().getString('browser_no_compatible'));


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
        if (get === true) {
            var serviceUrl = ServiceProvider.getServicePath(service) + '?' + postVariables;
            var response = ServiceProvider.getUrl(serviceUrl);
        } else {
            var serviceUrl = ServiceProvider.getServicePath(service);
            var response = ServiceProvider.getUrl(serviceUrl, postVariables);
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