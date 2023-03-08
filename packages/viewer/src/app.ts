/* OBJECTES
  URL: wiris.net / user / ...
  Extension: php / java / ...
  Language: User defined / Browser language
  Metrics: ?
  Central base line: ?
  Zoom: ?
  RenderLatex: Yes / No
  RenderMathML: Yes / No
*/

const EDITOR_SERVICES_ROOT: string = 'https://www.wiris.net/demo/plugins/app/';

/**
 * Initial function called when loading the script.
 * 
 * This function accesses the global `window`.
 */
async function main(): Promise<void> {
  document.addEventListener("DOMContentLoaded", () => {
    render(document.documentElement);
  });
}

/**
 * Parse the DOM looking for LaTeX nodes and replaces them with the corresponding rendered images.
 */
async function renderLatex(root: HTMLElement) {
  // TODO convert to MathML and then call renderMathML
}

/**
 * Parse the DOM looking for LaTeX and <math> elements. 
 * Replaces them with the corresponding rendered images within the given element.
 * @param {HTMLElement} root - DOM fragment to be rendered.
 */
async function render(root: HTMLElement) {
  await renderMathML(root);
}


/**
* Parse the DOM looking for <math> elements and replace them with the corresponding rendered images within the given element.
* @param {HTMLElement} root - Any DOM element that can contain MathML.
*/
export async function renderMathML(root: HTMLElement): Promise<void> {
  for(const mathElement of [...root.getElementsByTagName('math')]) {
    const mml = mathElement.outerHTML;
    const response = await showImage(mml);
    const data = await response.json();
    const fragment = document.createRange().createContextualFragment(data.result.content);
    mathElement.parentNode?.replaceChild(fragment, mathElement);
  }
};

/**
 * Calls the showImage service with the given MathML and returns the received Response object.
 * @param {string} mml MathML to render
 * @return {Promise<Response>} the Response object to the petition made to showImage
 */
export async function showImage(mml: string): Promise<Response> {
  try {
    const url = new URL('showimage', EDITOR_SERVICES_ROOT);
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
      },
      body: new URLSearchParams({
        'mml': mml, // TODO No fa falta el encodeURL perquè és un POST i el econding el fa automàtic.
        'metrics': 'true',
        'centerbaseline': 'false',
        'lang': getBrowserLang(),
      }),
    });
    console.log(response)
    return response;
  } catch(e) {
    // TODO manage network errors
    throw e;
  }
};

/**
 * Calls the latex2mathml service with the given LaTeX and returns the received Response object.
 * @param {string} latex LaTeX to render
 * @return {Promise<Response>} the Response object to the petition made to service
 */
async function latexToMathml(latex: string): Promise<Response> {
  try {
    const url = new URL('service', EDITOR_SERVICES_ROOT);
    const response = await fetch(url.toString(), {
      method: 'POST',
      body: new URLSearchParams({
        'service': 'latex2mathml',
        'latex': latex,
      }),
    });
    
    return response;
  } catch(e) {
    // TODO manage network errors
    throw e;
  }
}

/**
 * Return the user's browser language.
 * @returns {string} Encoded Language string.
 */
function getBrowserLang(): string {
  // TODO contemplate case in which the lang parameter is not declared in the html tag
  // e.g. also consider taking the user's settings
  return document.getElementsByTagName('html')[0].lang;
}

main();
