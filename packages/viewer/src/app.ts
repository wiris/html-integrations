import { Properties } from './properties';
import { renderLatex } from './latex';
import { renderMathML } from './mathml';
import { bypassEncapsulation } from './retro';
import packageInformation from '../../../node_modules/@wiris/mathtype-viewer/package.json'

declare global {
  interface Window {
    viewer: {
      properties: Properties,
      isLoaded: boolean,
      version: string
    };
  }
}

// This should be the only code executed outside of a function
// and the only code containing browser globals (e.g. window)
// TODO try to set up the linter to check these two constraints
main(window);

/**
 * Initial function called when loading the script.
 * @param {Window} w - The window instance of the browser.
 */
async function main(w: Window): Promise<void> {

  const properties: Properties = await Properties.getInstance();

  // Expose the globals to the browser
  if (!w.viewer) {
    w.viewer = {
      properties,
      isLoaded: false,
      version: packageInformation.version
    };
  } else {
    w.viewer.properties = properties;
    w.viewer.isLoaded = false;
    w.viewer.version = packageInformation.version;
  }

  const document = w.document;

  /**
   * Parse the DOM looking for LaTeX and <math> elements.
   * Replaces them with the corresponding rendered images within the given element.
   * @param {Document} document - The DOM document in which to search for the rendering root.
   * @param {MutationObserver} observer - Mutation observer to activate or reactivate every time the rendering root changes.
   */
  properties.render = async () => {
    const element: HTMLElement | null = document.querySelector(properties.element);
    if (element) {
      await renderLatex(properties, element);
      await renderMathML(properties, element);
    }
  };

  // Initial function to call once document is loaded
  // Renders formulas and sets observer
  const start = async () => {
    // Check if the viewer is alredy loaded
    if (w.viewer.isLoaded) return;

    w.viewer.isLoaded = true;

    // First render
    properties.render();

    // Callback called every time there is a mutation in the watched DOM element
    // Feature temporarily disabled due to KB-37834
    // new MutationObserver(async (mutationList, observer) => {
    //   for (const mutation of mutationList) {
    //     for (const node of mutation.addedNodes) {
    //       if (node instanceof HTMLElement) {
    //         await properties.render();
    //       }
    //     }
    //   }
    // })
    // // We need to watch over the whole document, in case the Properties.element is inserted
    // // e.g. we set Properties.element = '#renderArea' and then we append <div id="renderArea">$$2+2=4$$</div> to the document
    // .observe(document, {
    //   attributes: true, // In case an attribute is changed in a <math> node, for instance
    //   childList: true, // In case a new <math> or $$latex$$ node is added, for instance
    //   subtree: true, // In case a <math> node is added as a descendant of the observed element, for instance
    // });
  };

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event#checking_whether_loading_is_already_complete
  if (document.readyState === "loading") {
    // Loading hasn't finished yet
    document.addEventListener("DOMContentLoaded", start);
  } else {
    // `DOMContentLoaded` has already fired
    start();
  }

  // Expose the old Viewer API as a global
  bypassEncapsulation(properties, w);

  // Dispatch an event notifying that the viewer has been loaded
  document.dispatchEvent(new Event('viewerLoaded'));
}
