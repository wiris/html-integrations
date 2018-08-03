import Util from './util.js';
/**
 * Class representing a serviceProvider. A serviceProvider is a class containing
 * an arbitrary number of services with the correspondent path.
 */
export default class ServiceProvider {
    /**
     * Add a new service to the servicePath property.
     * @param {string} service - Service name
     * @param {string} path  - Service path.
     */
    static setServicePath(service, path) {
        ServiceProvider.serVicePaths[service] = path;

    }

    /**
     * Returns the servicePaths object.
     * @param {string} - Service name
     * @return {string} - Service path.
     */
    static getServicePath(service) {
        return ServiceProvider.serVicePaths[service];
    }

    /**
     * Gets the content from an URL.
     * @param {string} url target URL.
     * @param {object} postVariables post variables. Null if a GET query should be done.
     * @return {string} content of the target URL.
     * @ignore
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
     *
     * @param {string} service - Service name.
     * @param {string} postVariables - Post variables.
     * @param {boolean} get - True if the request is GET instead of POST.
     * @return {string} - The service response text.
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
 */
ServiceProvider.serVicePaths = {};