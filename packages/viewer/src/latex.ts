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
      if (leftText) {
        const leftTextNode = document.createTextNode(leftText);
        // Create a node with left text.
        node.parentNode?.insertBefore(leftTextNode, node);
      }

      // Get LaTeX text.
      const latex = textContent.substring(nextLatexPosition.start + "$$".length, nextLatexPosition.end);
      // Convert LaTeX to MathML.
      const response = await latexToMathml(latex, properties.editorServicesRoot, properties.editorServicesExtension);
      // Insert MathML node.
      const fragment = document.createRange().createContextualFragment(response.text);
      node.parentNode?.insertBefore(fragment, node);

      // Update pos to search for next LaTeX instance.
      pos = nextLatexPosition.end + "$$".length;
    } else {
      // If no more LaTeX found, append the rest of the text as a new text node and break the loop.
      const remainingText = textContent.substring(pos);
      if (remainingText) {
        const remainingTextNode = document.createTextNode(remainingText);
        node.parentNode?.insertBefore(remainingTextNode, node);
      }
      break; // Exit the loop as we've processed all text.
    }
  }
  // Remove the original node after processing.
  node.parentNode?.removeChild(node);
}

/**
 * Returns an array with all HTML LaTeX nodes.
 * @param {Node} root - Any DOM element that can contain LaTeX.
 * @returns {Node[]} Array with all HTML LaTeX nodes inside root.
 */
function findLatexTextNodes(root: Node): Node[] {
  const nodeIterator: NodeIterator = document.createNodeIterator(root, NodeFilter.SHOW_TEXT, (node) => {
    // Use a regex pattern to match LaTeX formulas.
    const latexRegex = /(\$\$.*?\$\$)/;
    return latexRegex.test(node.nodeValue || "") ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
  });
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
