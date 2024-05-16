// Import styles.
import "./design.css";
import indexString from "./index.html?raw";

// Export generic functions.
// eslint-disable-next-line import/extensions
export * from "./common.js";

// Display html content.
document.body.innerHTML = indexString;

// Generate scripts.
const jsDemoImagesTransform = document.createElement("script");
jsDemoImagesTransform.type = "text/javascript";
jsDemoImagesTransform.src = "https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image";

// Load generated scripts.
document.head.appendChild(jsDemoImagesTransform);
