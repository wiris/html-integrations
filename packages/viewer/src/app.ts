import { Properties } from "./properties";
import { renderLatex } from "./latex";
import { renderAMathML } from "./mathml";
import { bypassEncapsulation } from "./retro";
import packageInformation from "../../../node_modules/@wiris/mathtype-viewer/package.json";

declare global {
  interface Window {
    viewer: {
      properties: Properties;
      isLoaded: boolean;
      version: string;
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
      version: packageInformation.version,
    };
  } else {
    w.viewer.properties = properties;
    w.viewer.isLoaded = false;
    w.viewer.version = packageInformation.version;
  }

  const document = w.document;

  // Initial function to call once document is loaded
  // Renders formulas and sets observer
  const start = async () => {
    // Check if the viewer is already loaded
    if (w.viewer.isLoaded) return;

    w.viewer.isLoaded = true;

    // Interaction Observer
    const mathobserver = new IntersectionObserver(async (entries, observer) => {

      let latexPromises = [];

      const maxMmlPetition = properties.simultaneousmml;
      let mmlPromises = [];
      for (const entry of entries) {

        if (entry.isIntersecting && entry.target instanceof MathMLElement && entry.target.matches('math')) {
          const promise = renderAMathML(properties, entry.target);
          mmlPromises.push(promise);
          observer.unobserve(entry.target);

          // To not saturate service, not make all render petition at once
          if (mmlPromises.length >= maxMmlPetition) {
            await Promise.all(mmlPromises);
            mmlPromises = [];
          }
        }

        if (entry.isIntersecting && entry.target instanceof HTMLElement) {
          const promise = renderLatex(properties, entry.target);
          latexPromises.push(promise);
          observer.unobserve(entry.target);
        }
      }
      await Promise.all(latexPromises);
      await Promise.all(mmlPromises);
    }, {
      rootMargin: `${properties.vieweroffset}px`
    });

    const allElements = document.querySelectorAll('*');
    window.addEventListener("load", function () {
      let counter = 0;
      allElements.forEach(function (element) {
        mathobserver.observe(element);
        counter++;
      });
      console.log(counter);
    });

    //MutationObserver
    // Callback called every time there is a mutation in the watched DOM element
    new MutationObserver(async (mutationList) => {
      for (const mutation of mutationList) {
        for (const node of mutation.addedNodes) {
          // If was a htmlelement, decompose to child element to find posible latex or mathml
          if (node instanceof HTMLElement) {
            const allElements = node.querySelectorAll('*');

            allElements.forEach(function (element) {
              mathobserver.observe(element);
            });
          }
          // Observe mathml
          else if (node instanceof MathMLElement) {
            mathobserver.observe(node);
          }
          // If it was a pure text, observe their parent in order to find posible latex
          else if (node.nodeType == Node.TEXT_NODE) {
            mathobserver.observe(node.parentElement);
          }
        }
      }
    })
      // We need to watch over the whole document, in case the Properties.element is inserted
      // e.g. we set Properties.element = '#renderArea' and then we append <div id="renderArea">$$2+2=4$$</div> to the document
      .observe(document, {
        attributes: true, // In case an attribute is changed in a <math> node, for instance
        childList: true, // In case a new <math> or $$latex$$ node is added, for instance
        subtree: true, // In case a <math> node is added as a descendant of the observed element, for instance
      });
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
  document.dispatchEvent(new Event("viewerLoaded"));
}
