import { latexToMathml } from './services';
import { Properties } from './properties';

interface LatexPosition {
  start: number,
  end: number,
}

/**
 * Parse the DOM looking for LaTeX nodes and replaces them with the corresponding rendered images.
 * @param {HTMLElement} root - Any DOM element that can contain MathML.
 */
export async function renderLatex(root: HTMLElement) {
  const latexNodes = findLatexTextNodes(root);

  for (const latexNode of latexNodes) {
    await replaceLatexInTextNode(latexNode);
  }
}

/**
 * Replace LaTeX instances inside 'node' for mathml.
 * @param node textnode
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
      const response = await latexToMathml(latex, Properties.editorServicesRoot);
      // Insert mathml node.
      const fragment = document.createRange().createContextualFragment(response.text);
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
  const nodeIterator: NodeIterator = document.createNodeIterator(
    root,
    NodeFilter.SHOW_TEXT,
    node => /(\$\$)(.*)(\$\$)/.test(node.nodeValue || '') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
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
