enum MethodType {
  Post = "POST",
  Get = "GET",
}

// Thrown when a service returns a JSON with a non-ok status value in its JSON body
export class StatusError extends Error {}

/**
 * Calls the endpoint servicename and returns its response.
 * @param {object} query - Object of parameters to pass as the body request or search parameters.
 * @param {string} serviceName - Name of the service to be called.
 * @param {string} serverURL - Url of the server where we want to call the service.
 * @returns {Promise<Response>} The request response.
 */
export async function callService(query: object, serviceName: string, method: MethodType, serverURL: string) : Promise<any> {
  try {
    const url = new URL(serviceName, serverURL);
    const init: RequestInit = {
      method,
      headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
      },
    };

    if (method === MethodType.Get) {
      // Add the query as search params
      for (const [key, value] of Object.entries(query)) {
        url.searchParams.set(key, value);
      }
    } else {
      // Add the query as the body of the request
      init.body = new URLSearchParams({...query});
    }

    const response = await fetch(url.toString(), init);
    const { status, result } = await response.json();

    if (status !== 'ok') {
      throw new StatusError('Service responded with a non-ok status');
    }

    return result;
  } catch(e) {
    // TODO manage network and status non-ok errors
    throw e;
  }
}

/**
 * Returns the alt text of the MathML passed as parameter.
 * @param mml MathML to be transformed into alt text.
 * @param {string} lang - Language of the accessible text.
 * @param {string} url - Url of the server where we want to call the service.
 * @returns {Promise<Response>} The mathml2accessible service response.
 */
export async function mathml2accessible(mml: string, lang: string, url: string) : Promise<any> {
  // Set the needed params to retrieve the alt text.
  const params = {
    'service': 'mathml2accessible',
    'mml': mml,
    'metrics': 'true',
    'centerbaseline': 'false',
    'lang': lang,
    'ignoreStyles': 'true',
  }

  return callService(params, 'service', MethodType.Post, url)
}

/**
 * Calls the showImage service with the given MathML and returns the received Response object.
 * @param {string} mml MathML to render
 * @param {string} lang - Language.
 * @param {string} url - Url of the server where we want to call the service.
 * @return {Promise<Response>} the Response object to the petition made to showImage
 */
export async function showImage(mml: string, lang: string, url: string): Promise<any> {
  const params = {
    'mml': mml,
    'metrics': 'true',
    'centerbaseline': 'false',
    'lang':lang,
  }

  return callService(params, 'showimage', MethodType.Post, url);
};

/**
 * Calls the latex2mathml service with the given LaTeX and returns the received Response object.
 * @param {string} latex LaTeX to render
 * @param {string} url - Url of the server where we want to call the service.
 * @return {Promise<Response>} the Response object to the petition made to service
 */
export async function latexToMathml(latex: string, url: string): Promise<any> {
  const params = {
    'service': 'latex2mathml',
    'latex': latex,
  }

  return callService(params, 'service', MethodType.Post, url);
}

/**
 * Returns the configuration from the backend.
 * @param {string[]} variablekeys List of the key names of the variables to fetch
 * @returns {Promise<Response>} The configurationjson service response.
 */
export async function configurationJson(variablekeys: string[], url: string) : Promise<any> {
  const params = {
    'variablekeys': variablekeys.join(','),
  }

  return callService(params, 'configurationjson', MethodType.Get, url);
}
