import { Properties } from "./properties";
import { showImage, createImage, mathml2accessible, processJsonResponse } from './services';
import { htmlEntitiesToXmlEntities, corruptMathML } from './utils';
import MathML from '@wiris/mathtype-html-integration-devkit/src/mathml';

/**
 * Data obtained when rendering image. Data needed to set the formula image parameters.
 */
interface FormulaData {
  content: string,
  baseline: string,
  height: string,
  width: string,
  alt?: string,
}

/**
 * Look for safe MathML «math» formulas.
 * @param {HTMLElement} root - Any DOM element that can contain MathML.
 */
function findSafeMathMLTextNodes(root: HTMLElement): Node[] {
  const nodeIterator: NodeIterator = document.createNodeIterator(
    root,
    NodeFilter.SHOW_TEXT,
    node => /«math(.*?)«\/math»/g.test(node.nodeValue || '') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
  );
  const safeNodes : Node[] = [];

  let currentNode: Node | null;
  while (currentNode = nodeIterator.nextNode()) {
    safeNodes.push(currentNode);
  }

  return safeNodes;
}

/**
 * Parse the DOM looking for «math» formulas and replace them with the corresponding rendered images within the given element.
 * @param {HTMLElement} root - Any DOM element that can contain MathML.
 */
function decodeSafeMathML(root: HTMLElement) {
  const safeNodes = findSafeMathMLTextNodes(root);

  for (const safeNode of safeNodes) {
    const mathml = MathML.safeXmlDecode(safeNode.textContent);
    // Insert mathml node.
    const fragment = document.createRange().createContextualFragment(mathml);

    safeNode.parentNode?.insertBefore(fragment, safeNode);
    safeNode.parentNode?.removeChild(safeNode);
  }
}

/**
 * Parse the DOM looking for <math> elements and replace them with the corresponding rendered images within the given element.
 * @param {Properties} properties - Properties of the viewer.
 * @param {HTMLElement} root - Any DOM element that can contain MathML.
 */
export async function renderMathML(properties: Properties, root: HTMLElement): Promise<void> {

  if (properties.viewer !== 'image' && properties.viewer !== 'mathml') {
    return;
  }

  decodeSafeMathML(root);

  for(const mathElement of [...root.getElementsByTagName('math')]) {
    const mml = htmlEntitiesToXmlEntities(mathElement.outerHTML);

    let result;

    if (properties.wirispluginperformance === 'true') {
      // Transform mml to img.
      result = await showImage(mml, properties.lang, properties.editorServicesRoot, properties.editorServicesExtension);
    } else {
      // createimage returns the URL to showimage of the corresponding image
      let url = await createImage(mml, properties.lang, properties.editorServicesRoot, properties.editorServicesExtension);
      // This line is necessary due to a bug in how the services interoperate.
      // TODO fix the causing bug
      url = url.replace('pluginsapp', 'plugins/app');
      result = await processJsonResponse(fetch(url));
    }

    // Set img properties.
    const img = await setImageProperties(properties, result, mml);
    // const fragment = document.createRange().createContextualFragment(data.result.content);

    // Replace the MathML for the generated formula image.
    mathElement.parentNode?.replaceChild(img, mathElement);
  }
};

/**
 * Returns an image formula containing all MathType properties.
 * @param {Properties} properties - Properties of the viewer.
 * @param {FormulaData} data - Object containing image values.
 * @param {string} mml - The MathML of the formula image beeing created.
 * @returns {Promise<HTMLImageElement>} - Formula image.
 */
async function setImageProperties(properties: Properties, data: FormulaData, mml: string): Promise<HTMLImageElement> {

  // Create imag element.
  let img = document.createElement('img');

  // Set image src. Encode the result svg.
  img.src = `data:image/svg+xml;charset=utf8,${encodeURIComponent(data.content)}`;

  // Set other image properties.
  img.setAttribute(properties.wiriseditormathmlattribute, mml);
  img.setAttribute('class', 'Wirisformula');
  img.setAttribute('role', 'math');

  // If the render returns dimensions properties, set them to the image.
  if (+data.height > 0) {
    img.style.verticalAlign = "-" + (+data.height - +data.baseline) + "px";
    img.height = +data.height;
    img.width = +data.width;
  }

  // Set the alt text whenever there's a translation for the characters and MathML on the mml.
  if (!corruptMathML.some(corruptMathML => mml.includes(corruptMathML))) {
    try {
      if (!data.alt) {
        const { text } = await mathml2accessible(mml, properties.lang, properties.editorServicesRoot, properties.editorServicesExtension);
        data.alt = text;
      }
      img.alt = data.alt || '';
    } catch {
      img.alt = 'Alternative text not available';
    }
  }

  return img;

}
