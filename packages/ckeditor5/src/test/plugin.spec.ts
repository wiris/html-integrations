import { transformEditorContent } from "../utils";
import Configuration from "../../../devkit/src/configuration";

describe("Test CKEditor5", () => {
  const confJson = {
    versionPlatform: "unknown",
    editorParameters: {},
    imageFormat: "svg",
    CASEnabled: false,
    customHeaders: "",
    parseModes: ["latex"],
    editorToolbar: "",
    editorAttributes: "width=570, height=450, scroll=no, resizable=yes",
    base64savemode: "default",
    modalWindow: true,
    version: "8.11.0.1490",
    enableAccessibility: true,
    saveMode: "xml",
    saveHandTraces: false,
    editorUrl: "http://www.wiris.net/demo/",
  };

  Configuration.addConfiguration(confJson);

  it(`Test 1`, () => {
    const voidValue = "";
    const transformedValue = transformEditorContent(voidValue);
    expect(voidValue).toBe(transformedValue);
  });

  // Involucrea get data y set data
});
