import { Plugin, ButtonView } from "ckeditor5";
import SDK from "@wiris/mathtype.integrations.sdk";
import mathIcon from "../theme/icons/ckeditor5-formula.svg";

export default class MathType extends Plugin {
  static get pluginName() {
    return "MathType";
  }

  init() {
    this.sdk = new SDK();
    this.editorModal = this.sdk.createEditorModal();
    this.editorModal.init();

    this.editor.ui.componentFactory.add("MathType", (locale) => {
      const view = new ButtonView(locale);

      view.set({
        label: "Insert a math equation - MathType",
        icon: mathIcon,
        tooltip: true,
      });

      view.on("execute", () => {
        this.editorModal.show();
      });

      return view;
    });
  }

  destroy() {
    this.editorModal?.destroy();
    super.destroy();
  }
}
