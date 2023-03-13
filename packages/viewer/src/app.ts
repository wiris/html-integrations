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

interface LatexPosition {
  start: number,
  end: number,
}

// Data obtained when rendering image. Data needed to set the formula image parameters.
interface formulaData {
  content: string,
  baseline: string,
  height: string,
  width: string,
}

import * as Services from './services';
import * as Properties from './properties';

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
  const latexNodes = findLatexTextNodes(root);

  for (const latexNode of latexNodes) {
    await replaceLatexInTextNode(latexNode);
  }
}

/**
 * Parse the DOM looking for LaTeX and <math> elements.
 * Replaces them with the corresponding rendered images within the given element.
 * @param {HTMLElement} root - DOM fragment to be rendered.
 */
async function render(root: HTMLElement) {
  await renderLatex(root);
  await renderMathML(root);
}


/**
* Parse the DOM looking for <math> elements and replace them with the corresponding rendered images within the given element.
* @param {HTMLElement} root - Any DOM element that can contain MathML.
*/
export async function renderMathML(root: HTMLElement): Promise<void> {
  for(const mathElement of [...root.getElementsByTagName('math')]) {
    const mml = mathElement.outerHTML;

    // Transform mml to img.
    const response = await Services.showImage(mml, Properties.lang, Properties.EDITOR_SERVICES_ROOT);
    const data = await response.json();

    // Set img properties.
    const img = await setImageProperties(data.result, mml);
    // const fragment = document.createRange().createContextualFragment(data.result.content);

    // Replace the MathML for the generated formula image.
    mathElement.parentNode?.replaceChild(img, mathElement);
  }
};

/**
 * Returns an image formula containing all MathType properties.
 * @param {data} data - Object containing image values.
 * @param {string} mml - The mml of the formula image it's beeing created.
 * @returns {HTMLImageElement} - Formula image.
 */
export async function setImageProperties (data: formulaData, mml: string) {
  // Create imag element.
  let img = document.createElement("img");

  // Set image src. Encode the result svg.
  img.src = `data:image/svg+xml;charset=utf8,${encodeURIComponent(data.content)}`;

  // Set other image properties.
  img.setAttribute("data-mathml", mml);
  img.setAttribute("class","Wirisformula");
  img.setAttribute("role","math");

  // If the render returns dimensions properties, set them to the image.
  if (+data.height > 0) {
    img.style.verticalAlign = "-" + (+data.height - +data.baseline) + "px";
    img.height = +data.height;
    img.width = +data.width;
  }

  // Set the alt text.
  const response = await Services.mathml2accessible(mml, Properties.lang, Properties.EDITOR_SERVICES_ROOT);
  const accessibility = await response.json();
  if (accessibility !== null) {
    img.alt = accessibility.result.text;
  }

  return img;
}

/**
 *  Replace LaTeX instances inside 'node' for mathml.
 *  @param pos current position inside the text in textnode
 *  @param node textnode
 */
async function replaceLatexInTextNode(node: Node) {
  const textContent: string = node.textContent || '';
  let pos: number = 0;

  while (pos < textContent.length) {
    const nextLatexPosition: LatexPosition = getNextLatexPos(pos, textContent);
    if (nextLatexPosition) {
      // Get left non LaTeX text.
      const leftText: string = textContent.substring(pos, nextLatexPosition.start);
      const leftTextNode = document.createTextNode(leftText);
      // Create a node with left text.
      node.parentNode?.insertBefore(leftTextNode, node);

      // Get LaTeX text.
      const latex = textContent.substring(nextLatexPosition.start + '$$'.length, nextLatexPosition.end);
      // Convert LaTeX to mathml.
      const response = await Services.latexToMathml(latex, Properties.EDITOR_SERVICES_ROOT);
      const data = await response.json();
      // Insert mathml node.
      const fragment = document.createRange().createContextualFragment(data.result.text);
      node.parentNode?.insertBefore(fragment, node);

      pos = nextLatexPosition.end + '$$'.length;
    } else {
      // No more LaTeX node found.
      const text = textContent.substring(pos);
      const textNode = document.createTextNode(text);
      node.parentNode?.insertBefore(textNode, node);
      pos = textContent.length;
    }
  }

  // Delete original text node.
  node.parentNode?.removeChild(node);
}


/**
 *  Returns an array of with all HTML LaTeX nodes.
 *  @param {HTMLElement} root - Any DOM element that can contain LaTeX.
 */
function findLatexTextNodes(root: any): Array<Node>{
  const latexRegEx = /(\$\$)(.*)(\$\$)/
  const nodeIterator: NodeIterator = document.createNodeIterator(
    root,
    NodeFilter.SHOW_ALL,
    (node) => {
      return latexRegEx.test(node.nodeValue || '') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  );
  const latexNodes : Array<Node> = [];

  let currentNode: Node | null;
  while (currentNode = nodeIterator.nextNode()) {
    latexNodes.push(currentNode);
  }

  return latexNodes;
}

/**
 *  Returns an object {start, end} with the start and end latex position.
 *  @param pos current position inside the text.
 *  @param text text where the next latex it will be searched.
 */
function getNextLatexPos(pos : number, text : String): LatexPosition {
	var firstLatexTags = text.indexOf('$$', pos);
	var secondLatexTags = firstLatexTags == -1 ? -1 : text.indexOf('$$', firstLatexTags + '$$'.length);
	return firstLatexTags != -1 && secondLatexTags != -1 ? {'start': firstLatexTags, 'end': secondLatexTags} : null;
}

main();
