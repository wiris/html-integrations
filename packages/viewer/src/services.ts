// TODO: methodType to be a enum with 2 options: POST & GET

enum Direction {
  Post = "POST",
  Get = "GET",
}

/**
 * Returns the alt text of the MathML passed as parameter.
 * @param mml MathML to be transformed into alt text.
 * @param {string} lang - Language of the accessible text.
 * @param {string} url - Url of the server where we want to call the service.
 * @returns {Promise<Response>} The mathml2accessible service response.
 */
export async function mathml2accessible(mml: string, lang: string, url: string) : Promise<Response> {
  // Set the needed params to retrieve the alt text.
  const params = {
    'service': 'mathml2accessible',
    'mml': mml,
    'metrics': 'true',
    'centerbaseline': 'false',
    'lang': lang,
    'ignoreStyles': 'true',
  }

  return callService(params, 'service', Direction.Post, url)
}
  
/**
 * Calls the ednpoint servicename and returns its response.
 * @param {object} params - Object of parameters to pass as the body request.
 * @param {string} servicename - Name of the service to be called.
 * @param {string} serverURL - Url of the server where we want to call the service.
 * @returns {Promise<Response>} The request response.
 */
export async function callService(params: object, servicename : string, methodType: Direction, serverURL: string) : Promise<Response> {
  try {
    const url = new URL(servicename, serverURL);
    const response = await fetch(url.toString(), {
        method: methodType,
        headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: new URLSearchParams({
          ...params,
        }),
    });
    return response;
  } catch(e) {
    // TODO manage network errors
    throw e;
  }
}
  
  
  
/**
 * Calls the showImage service with the given MathML and returns the received Response object.
 * @param {string} mml MathML to render
 * @param {string} lang - Language.
 * @param {string} url - Url of the server where we want to call the service.
 * @return {Promise<Response>} the Response object to the petition made to showImage
 */
export async function showImage(mml: string, lang: string, url: string): Promise<Response> {
  const params = {
    'mml': mml, // TODO No fa falta el encodeURL perquè és un POST i el econding el fa automàtic.
    'metrics': 'true',
    'centerbaseline': 'false',
    'lang':lang,
  }

  return callService(params, 'showimage', Direction.Post, url);
};


/**
 * Calls the latex2mathml service with the given LaTeX and returns the received Response object.
 * @param {string} latex LaTeX to render
 * @param {string} url - Url of the server where we want to call the service.
 * @return {Promise<Response>} the Response object to the petition made to service
 */
export async function latexToMathml(latex: string, url: string): Promise<Response> {
  const params = {
    'service': 'latex2mathml',
    'latex': latex,
  }

  return callService(params, 'service', Direction.Post, url);
}