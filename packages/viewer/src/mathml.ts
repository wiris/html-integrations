import { Properties } from "./properties";
import { showImage, createImage, mathml2accessible, processJsonResponse } from './services';

/**
 * Data obtained when rendering image. Data needed to set the formula image parameters.
 */
interface FormulaData {
  content: string,
  baseline: string,
  height: string,
  width: string,
}

/**
 * Parse the DOM looking for <math> elements and replace them with the corresponding rendered images within the given element.
 * @param {HTMLElement} root - Any DOM element that can contain MathML.
 */
export async function renderMathML(root: HTMLElement): Promise<void> {

  if (Properties.viewer !== 'image') {
    return;
  }

  for(const mathElement of [...root.getElementsByTagName('math')]) {
    const mml = mathElement.outerHTML;

    let result;

    if (Properties.wirispluginperformance === 'true') {
      // Transform mml to img.
      result = await showImage(mml, Properties.lang, Properties.editorServicesRoot, Properties.editorServicesExtension);
    } else {
      // createimage returns the URL to showimage of the corresponding image
      let url = await createImage(mml, Properties.lang, Properties.editorServicesRoot, Properties.editorServicesExtension);
      // This line is necessary due to a bug in how the services interoperate.
      // TODO fix the causing bug
      url = url.replace('pluginsapp', 'plugins/app');
      result = await processJsonResponse(fetch(url));
    }

    // Set img properties.
    const img = await setImageProperties(result, mml, Properties.wiriseditormathmlattribute);
    // const fragment = document.createRange().createContextualFragment(data.result.content);

    // Replace the MathML for the generated formula image.
    mathElement.parentNode?.replaceChild(img, mathElement);
  }
};

/**
 * Returns an image formula containing all MathType properties.
 * @param {FormulaData} data - Object containing image values.
 * @param {string} mml - The MathML of the formula image beeing created.
 * @param {string} wiriseditormathmlattribute - The name of the HTML attribute to store the MathML in.
 * @returns {Promise<HTMLImageElement>} - Formula image.
 */
async function setImageProperties(data: FormulaData, mml: string, wiriseditormathmlattribute: string): Promise<HTMLImageElement> {

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
  const { text } = await mathml2accessible(mml, Properties.lang, Properties.editorServicesRoot, Properties.editorServicesExtension);
  img.alt = text;

  return img;

}
