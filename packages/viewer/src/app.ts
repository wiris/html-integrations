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

import { Properties } from './properties';
import { renderLatex } from './latex';
import { renderMathML } from './mathml';

// This should be the only code executed outside of a function
// and the only code containing browser globals (e.g. window)
// TODO try to set up the linter to check these two constraints
main(window);

/**
 * Initial function called when loading the script.
 * @param w the window instance of the browser
 */
async function main(w: Window): Promise<void> {
  // Expose the globals to the browser
  (w as any).viewer = {
    Properties,
  };

  // Render formulas once the DOM content is loaded
  w.document.addEventListener('DOMContentLoaded', async () => {
    render(w.document.body);
  });

  // Dispatch an event notifying that the viewer has been loaded
  w.document.dispatchEvent(new Event('viewerLoaded'));
}

/**
 * Parse the DOM looking for LaTeX and <math> elements.
 * Replaces them with the corresponding rendered images within the given element.
 * @param {HTMLElement} root - DOM fragment to be rendered.
 */
async function render(root: HTMLElement) {
  if (Properties.viewer === 'image') {
    await renderLatex(root);
    await renderMathML(root);
  }
}
