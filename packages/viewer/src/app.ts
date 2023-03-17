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

import { Properties, BackendConfig } from './properties';
import * as Services from './services';
import { renderLatex } from './latex';


// Data obtained when rendering image. Data needed to set the formula image parameters.
interface FormulaData {
  content: string,
  baseline: string,
  height: string,
  width: string,
}

async function getBackendConfig(): Promise<BackendConfig> {

  // Default values inherited from the old viewer code
  let backendConfig: BackendConfig = {
    wirispluginperformance: 'false',
    wiriseditormathmlattribute: 'data-mathml',
  };

  try {
    backendConfig = await Services.configurationJson(['wirispluginperformance', 'wiriseditormathmlattribute'], Properties.EDITOR_SERVICES_ROOT);
  } catch(e) {
    if (e instanceof Services.StatusError) {
      // Do nothing; return default values.
    } else {
      throw e;
    }
  }

  return backendConfig;

}

/**
 * Initial function called when loading the script.
 *
 * This function accesses the global `document`.
 */
async function main(): Promise<void> {
  document.addEventListener("DOMContentLoaded", async () => {
    render(document.body, await getBackendConfig());
  });
}

async function replaceAsync(str, regex, asyncFn) {
  const promises = [];
  str.replace(regex, (match, ...args) => {
      const promise = asyncFn(match, ...args);
      promises.push(promise);
  });
  const data = await Promise.all(promises);
  return str.replace(regex, () => data.shift());
}

/**
 * Parse the DOM looking for LaTeX and <math> elements.
 * Replaces them with the corresponding rendered images within the given element.
 * @param {HTMLElement} root - DOM fragment to be rendered.
 * @param {backendConfig} backendConfig - Config from the backend.
 */
async function render(root: HTMLElement, backendConfig: BackendConfig) {
  await renderLatex(root);
  await renderMathML(root, backendConfig);
}


/**
* Parse the DOM looking for <math> elements and replace them with the corresponding rendered images within the given element.
* @param {HTMLElement} root - Any DOM element that can contain MathML.
* @param {BackendConfig} backendConfig - Backend config.
*/
export async function renderMathML(root: HTMLElement, backendConfig: BackendConfig): Promise<void> {
  for(const mathElement of [...root.getElementsByTagName('math')]) {
    const mml = mathElement.outerHTML;

    let result;

    if (backendConfig.wirispluginperformance === 'true') {
      // Transform mml to img.
      result = await Services.showImage(mml, Properties.lang, Properties.EDITOR_SERVICES_ROOT);
    } else {

      // TODO call createImage instead of showImage

    }

    // Set img properties.
    const img = await setImageProperties(result, mml, backendConfig.wiriseditormathmlattribute);
    // const fragment = document.createRange().createContextualFragment(data.result.content);

    // Replace the MathML for the generated formula image.
    mathElement.parentNode?.replaceChild(img, mathElement);
  }
};

/**
 * Returns an image formula containing all MathType properties.
 * @param {FormulaData} data - Object containing image values.
 * @param {string} mml - The mml of the formula image it's beeing created.
 * @param {string} wiriseditormathmlattribute - The name of the HTML attribute to store the MathML in
 * @returns {HTMLImageElement} - Formula image.
 */
export async function setImageProperties(data: FormulaData, mml: string, wiriseditormathmlattribute: string): Promise<HTMLImageElement> {

  // Create imag element.
  let img = document.createElement('img');

  // Set image src. Encode the result svg.
  img.src = `data:image/svg+xml;charset=utf8,${encodeURIComponent(data.content)}`;

  // Set other image properties.
  img.setAttribute(wiriseditormathmlattribute, mml);
  img.setAttribute('class', 'Wirisformula');
  img.setAttribute('role', 'math');

  // If the render returns dimensions properties, set them to the image.
  if (+data.height > 0) {
    img.style.verticalAlign = "-" + (+data.height - +data.baseline) + "px";
    img.height = +data.height;
    img.width = +data.width;
  }

  // Set the alt text.
  const { text } = await Services.mathml2accessible(mml, Properties.lang, Properties.EDITOR_SERVICES_ROOT);
  img.alt = text;

  return img;

}

main();
