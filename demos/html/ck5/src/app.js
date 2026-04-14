import { ClassicEditor, Essentials, Paragraph, Bold, Italic } from "ckeditor5";
import MathType from "@wiris/mathtype-ck5";
import "ckeditor5/ckeditor5.css";

ClassicEditor.create(document.querySelector("#editor"), {
  licenseKey: "GPL",
  plugins: [Essentials, Paragraph, Bold, Italic, MathType],
  toolbar: ["bold", "italic", "MathType"],
})
  .then((editor) => {
    window.editor = editor;
  })
  .catch((error) => {
    console.error(error.stack);
  });
