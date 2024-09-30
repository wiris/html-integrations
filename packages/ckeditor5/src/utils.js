import Parser from "@wiris/mathtype-html-integration-devkit/src/parser.js";
import MathML from "@wiris/mathtype-html-integration-devkit/src/mathml.js";

export function transformEditorContent(editorContent) {
  const parsedResult = Parser.endParse(editorContent);

  // Cleans all the semantics tag for safexml
  // including the handwritten data points
  const transformedContent = MathML.removeSafeXMLSemantics(parsedResult);
  return transformedContent;
}
