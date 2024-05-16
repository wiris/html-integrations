import git from "resources/git-data.json";
import "./static/style.css";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("content").value = document.getElementsByTagName("main")[0].innerHTML;
  document.getElementById("git_commit").innerText = git.hash;
});

// Show the version number of the viewer
fetch("node_modules/@wiris/mathtype-viewer/package.json")
  .then((response) => response.json())
  .then(({ version }) => {
    document.getElementById("version").innerText = version;
  });

document.getElementById("viewer_form").addEventListener("submit", () => {
  event.preventDefault(); // eslint-disable-line no-restricted-globals
  // Accessing form data using the event object
  const formData = new FormData(event.target); // eslint-disable-line no-restricted-globals

  const config = {
    backendConfig: {
      wiriseditormathmlattribute: wiriseditormathmlattribute.value,
      wirispluginperformance: wirispluginperformance.checked ? "true" : "false",
    },
    dpi: dpi.value,
    editorServicesExtension: "",
    editorServicesRoot: editorServicesRoot.value,
    element: element.value,
    lang: lang.value,
    viewer: viewer.value,
    zoom: zoom.value,
  };

  window.viewer.properties.config = config;

  document.getElementsByTagName("main")[0].innerHTML = document.getElementById("content").value;
  window.com.wiris.js.JsPluginViewer.parseElement(document.getElementsByTagName("main")[0]);
});
