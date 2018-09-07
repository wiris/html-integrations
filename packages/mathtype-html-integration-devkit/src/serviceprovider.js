import Util from './util.js';
/**
 * Class representing a serviceProvider. A serviceProvider is a class containing
 * an arbitrary number of services with the correspondent path.
 */
export default class ServiceProvider {
    /**
     * Adds a new service to the ServiceProvider.
     * @param {string} service - service name.
     * @param {string} path - service path.
     * @static
     */
    static setServicePath(service, path) {
        ServiceProvider.serVicePaths[service] = path;
    }

    /**
     * Returns the service path for a certain service.
     * @param {string} serviceName - service name
     * @returns {string} the service path.
     * @static
     */
    static getServicePath(serviceName) {
        return ServiceProvider.serVicePaths[serviceName];
    }

    /**
     * Gets the content from an URL.
     * @param {string} url - target URL.
     * @param {Object} postVariables - object containing post variables. null if a GET query should be done.
     * @returns {string} content of the target URL.
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
     * @param {string} service - service name.
     * @param {string} postVariables - `post variables.
     * @param {boolean} get - true if the request is GET instead of POST. false otherwise.
     * @returns {string} service response text.
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
 * @property {string} service - The service name
 * @property {string} path - The service path
 * @static
 */
ServiceProvider.serVicePaths = {};