import Parser from "@wiris/mathtype-html-integration-devkit/src/parser";
import { Properties } from "./properties";

enum MethodType {
  Post = "POST",
  Get = "GET",
}

/**
 * Thrown when a service returns a JSON with a non-ok status value in its JSON body
 */
export class StatusError extends Error {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, StatusError.prototype);
  }
}

/**
 * Helper function to process responses from the editor services.
 * These usually come wrapped in a JSON with a status field that can be either "ok" or "warning".
 * If status is "ok", return the result value along it. Otherwise, throw a StatusError.
 * @param {Response} response - The response given by the service.
 * @returns {Promise<any>} The unwrapped result of the response, if valid.
 * @throws {StatusError} Service responded with a non-ok status.
 *                       If the response.json() fails, it'll return a generic exception.
 */
async function processJsonResponse(response: Response): Promise<any> {
  const { status, result } = await response.json();

  if (status !== "ok") {
    throw new StatusError("Service responded with a non-ok status");
  }

  return result;
}

/**
 * Calls the endpoint servicename and returns its response.
 * @param {object} query - Object of parameters to pass as the body request or search parameters.
 * @param {string} serviceName - Name of the service to be called.
 * @param {string} serverURL - Url of the server where we want to call the service.
 * @param {string} extension - Extension to add to the end of the serviceName (including the dot if necessary).
 * @returns {Promise<Response>} The request response.
 */
export async function callService(
  query: object,
  serviceName: string,
  method: MethodType,
  serverURL: string,
  extension: string,
): Promise<any> {
  const url = new URL(serviceName + extension, serverURL);

  // Getting the configuration is asynchronous since we make some requests.
  const properties = await Properties.getInstance();
  const headers = {
    "Content-type": "application/x-www-form-urlencoded; charset=utf-8",
    ...properties.config.backendConfig.wiriscustomheaders,
  };

  const init: RequestInit = {
    method,
    headers,
  };

  if (method === MethodType.Get) {
    // Add the query as search params
    for (const [key, value] of Object.entries(query)) {
      url.searchParams.set(key, value);
    }
  } else {
    // Add the query as the body of the request
    init.body = new URLSearchParams({ ...query });
  }

  return await fetch(url.toString(), init);
}

/**
 * Returns the alt text of the MathML passed as parameter.
 * @param {string} mml - MathML to be transformed into alt text.
 * @param {string} lang - Language of the accessible text.
 * @param {string} url - URL of the server where we want to call the service.
 * @param {string} extension - Extension to add to the end of the serviceName (including the dot if necessary).
 * @returns {Promise<Response>} The mathml2accessible service response.
 */
export async function mathml2accessible(mml: string, lang: string, url: string, extension: string): Promise<any> {
  // Set the needed params to retrieve the alt text.
  const params = {
    service: "mathml2accessible",
    mml: mml,
    metrics: "true",
    centerbaseline: "false",
    lang: lang,
    ignoreStyles: "true",
  };

  const response = await callService(params, "service", MethodType.Post, url, extension);
  return processJsonResponse(response);
}

/**
 * Calls the showImage service with the given MathML and returns the received Response object.
 * @param {string} mml - MathML to render.
 * @param {string} lang - Language.
 * @param {string} url - URL of the server where we want to call the service.
 * @param {string} extension - Extension to add to the end of the serviceName (including the dot if necessary).
 * @returns {Promise<Response>} the Response object to the petition made to showImage
 */
export async function showImage(mml: string, lang: string, url: string, extension: string): Promise<any> {
  const params = {
    mml: mml,
    metrics: "true",
    centerbaseline: "false",
    lang: lang,
  };

  // Try to obtain the image via GET
  const getParams = Parser.createShowImageSrcData(params, params.lang);
  const showImageResponse = await callService(getParams, "showimage", MethodType.Get, url, extension);
  try {
    return await processJsonResponse(showImageResponse);
  } catch (e) {
    if (e instanceof StatusError) {
      // If GET request fails, it means that the formula was not in cache. Proceed to create the image:
      return createImage(mml, lang, url, extension);
    } else {
      throw e;
    }
  }
}

/**
 * Calls the createImage service with the given MathML and returns the received Response object.
 * @param {string} mml - MathML to render
 * @param {string} lang - Language.
 * @param {string} url - URL of the server where we want to call the service.
 * @param {string} extension - Extension to add to the end of the serviceName (including the dot if necessary).
 * @returns {Promise<Response>} the Response object to the petition made to showImage
 */
export async function createImage(mml: string, lang: string, url: string, extension: string): Promise<any> {
  const params = {
    mml: mml,
    metrics: "true",
    centerbaseline: "false",
    lang: lang,
  };

  // POST request to retrieve the corresponding image.
  const response = await callService(params, "showimage", MethodType.Post, url, extension);
  return processJsonResponse(response);
}

/**
 * Calls the latex2mathml service with the given LaTeX and returns the received Response object.
 * @param {string} latex - LaTeX to render
 * @param {string} url - Url of the server where we want to call the service.
 * @param {string} extension - Extension to add to the end of the serviceName (including the dot if necessary).
 * @returns {Promise<Response>} the Response object to the petition made to service
 */
export async function latexToMathml(latex: string, url: string, extension: string): Promise<any> {
  const params = {
    service: "latex2mathml",
    latex: latex,
  };

  const response = await callService(params, "service", MethodType.Post, url, extension);
  return processJsonResponse(response);
}

/**
 * Returns the configuration from the backend.
 * @param {string[]} variablekeys - List of the key names of the variables to fetch.
 * @param {string} extension - Extension to add to the end of the serviceName (including the dot if necessary).
 * @returns {Promise<Response>} The configurationjson service response.
 */
export async function configurationJson(variablekeys: string[], url: string, extension: string): Promise<any> {
  const params = {
    variablekeys: variablekeys.join(","),
  };

  try {
    const response = await callService(params, "configurationjson", MethodType.Get, url, extension);
    return processJsonResponse(response);
  } catch (e) {
    return e;
  }
}
