import { latexToMathml } from "./services";
import { Properties } from "./properties";

interface LatexPosition {
  start: number;
  end: number;
}

/**
 * Parse the DOM looking for LaTeX nodes and replaces them with the corresponding rendered images.
 * @param {Properties} properties - Properties of the viewer.
 * @param {HTMLElement} root - Any DOM element that can contain MathML.
 */
export async function renderLatex(properties: Properties, root: HTMLElement) {
  if (properties.viewer !== "image" && properties.viewer !== "latex") {
    return;
  }
  const latexNodes = findLatexTextNodes(root);

  for (const latexNode of latexNodes) {
    await replaceLatexInTextNode(properties, latexNode);
  }
}

/**
 * Replace LaTeX instances with MathML inside a given node.
 * @param {Properties} properties - Properties of the viewer.
 * @param {Node} node - Text node in which to search and replace LaTeX instances.
 */
async function replaceLatexInTextNode(properties: Properties, node: Node) {
  const textContent: string = node.textContent ?? "";
  let pos: number = 0;

  while (pos < textContent.length) {
    const nextLatexPosition = getNextLatexPos(pos, textContent);
    if (nextLatexPosition) {
      // Get left non LaTeX text.
      const leftText: string = textContent.substring(pos, nextLatexPosition.start);
      const leftTextNode = document.createTextNode(leftText);
      // Create a node with left text.
      node.parentNode?.insertBefore(leftTextNode, node);
      node.nodeValue = node.nodeValue?.substring(pos, nextLatexPosition.start) ?? "";

      // Get LaTeX text.
      const latex = textContent.substring(nextLatexPosition.start + "$$".length, nextLatexPosition.end);
      // Convert LaTeX to mathml.
      const response = await latexToMathml(latex, properties.editorServicesRoot, properties.editorServicesExtension);
      // Insert mathml node.
      const fragment = document.createRange().createContextualFragment(response.text);

      node.parentNode?.insertBefore(fragment, node);
      node.nodeValue = node.nodeValue.substring(nextLatexPosition.start, nextLatexPosition.end);

      pos = nextLatexPosition.end + "$$".length;
    } else {
      // No more LaTeX node found.
      const text = textContent.substring(pos);
      const textNode = document.createTextNode(text);
      node.parentNode?.insertBefore(textNode, node);
      node.nodeValue = "";
      pos = textContent.length;
    }
  }

  // Delete original text node.
  node.parentNode?.removeChild(node);
}

/**
 * Returns an array with all HTML LaTeX nodes.
 * @param {HTMLElement} root - Any DOM element that can contain LaTeX.
 * @returns {Node[]} Array with all HTML LaTeX nodes inside root.
 */
function findLatexTextNodes(root: any): Node[] {
  const nodeIterator: NodeIterator = document.createNodeIterator(root, NodeFilter.SHOW_TEXT, (node) =>
    /(\$\$)(.*)(\$\$)/.test(node.nodeValue || "") ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT,
  );
  const latexNodes: Node[] = [];

  let currentNode: Node | null;
  while ((currentNode = nodeIterator.nextNode())) {
    latexNodes.push(currentNode);
  }

  return latexNodes;
}

/**
 * Returns an object {start, end} with the start and end latex position.
 * @param {number} pos - Current position inside the text.
 * @param {string} text - Text where the next latex it will be searched.
 * @
 */
function getNextLatexPos(pos: number, text: string): LatexPosition | null {
  const firstLatexTags = text.indexOf("$$", pos);
  const secondLatexTags = firstLatexTags == -1 ? -1 : text.indexOf("$$", firstLatexTags + "$$".length);
  return firstLatexTags != -1 && secondLatexTags != -1 ? { start: firstLatexTags, end: secondLatexTags } : null;
}
