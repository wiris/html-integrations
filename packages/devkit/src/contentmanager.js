import Configuration from "./configuration";
import Core from "./core.src";
import Listeners from "./listeners";
import MathML from "./mathml";
import Util from "./util";
import Telemeter from "./telemeter";
import SDK from "@wiris/mathtype.integrations.sdk";

export default class ContentManager {
  /**
   * @classdesc
   * This class represents a modal dialog, managing the following:
   * - The insertion of content into the current instance of the {@link ModalDialog} class.
   * - The actions to be done once the modal object has been submitted
   *   (submitAction} method).
   * - The update of the content when the {@link ModalDialog} class is also updated,
   *   for example when ModalDialog is re-opened.
   * - The communication between the {@link ModalDialog} class and itself, if the content
   *   has been changed (hasChanges} method).
   * @constructs
   * @param {Object} contentManagerAttributes - Object containing all attributes needed to
   * create a new instance.
   */
  constructor(contentManagerAttributes) {
    /**
     * An object containing MathType editor parameters. See
     * http://docs.wiris.com/en/mathtype/mathtype_web/sdk-api/parameters for further information.
     * @type {Object}
     */
    this.editorAttributes = {};
    if ("editorAttributes" in contentManagerAttributes) {
      this.editorAttributes = contentManagerAttributes.editorAttributes;
    } else {
      throw new Error("ContentManager constructor error: editorAttributes property missed.");
    }

    /**
     * CustomEditors instance. Contains the custom editors.
     * @type {CustomEditors}
     */
    this.customEditors = null;
    if ("customEditors" in contentManagerAttributes) {
      this.customEditors = contentManagerAttributes.customEditors;
    }

    /**
     * Environment properties. This object contains data about the integration platform.
     * @type {Object}
     * @property {String} editor - Editor name. Usually the HTML editor.
     * @property {String} mode - Save mode. Xml by default.
     * @property {String} version - Plugin version.
     */
    this.environment = {};
    if ("environment" in contentManagerAttributes) {
      this.environment = contentManagerAttributes.environment;
    } else {
      throw new Error("ContentManager constructor error: environment property missed");
    }

    /**
     * ContentManager language.
     * @type {String}
     */
    this.language = "";
    if ("language" in contentManagerAttributes) {
      this.language = contentManagerAttributes.language;
    } else {
      throw new Error("ContentManager constructor error: language property missed");
    }

    /**
     * Tracks whether the editor content has been changed by the user.
     * Replaces the old EditorListener class.
     * @type {Boolean}
     */
    this.isContentChanged = false;

    /**
     * Whether the content manager is waiting for changes from the editor.
     * @type {Boolean}
     */
    this.waitingForChanges = false;

    /**
     * SDK Editor instance. This is the only editor reference needed.
     * Created via the SDK's createEditor() factory method.
     * @type {import("@wiris/mathtype.integrations.sdk").Editor}
     */
    this.editor = null;

    /**
     * Navigator user agent.
     * @type {String}
     */
    this.ua = navigator.userAgent.toLowerCase();

    /**
     * Mobile device properties object
     * @type {DeviceProperties}
     */
    this.deviceProperties = {};
    this.deviceProperties.isAndroid = this.ua.indexOf("android") > -1;
    this.deviceProperties.isIOS = ContentManager.isIOS();

    /**
     * Custom editor toolbar.
     * @type {String}
     */
    this.toolbar = null;

    /**
     * Custom editor toolbar.
     * @type {String}
     */
    this.dbclick = null;

    /**
     * Instance of the {@link ModalDialog} class associated with the current
     * {@link ContentManager} instance.
     * @type {ModalDialog}
     */
    this.modalDialogInstance = null;

    /**
     * ContentManager listeners.
     * @type {Listeners}
     */
    this.listeners = new Listeners();

    /**
     * MathML associated to the ContentManager instance.
     * @type {String}
     */
    this.mathML = null;

    /**
     * Indicates if the edited element is a new one or not.
     * @type {Boolean}
     */
    this.isNewElement = true;

    /**
     * {@link IntegrationModel} instance. Needed to call wrapper methods.
     * @type {IntegrationModel}
     */
    this.integrationModel = null;
  }

  /**
   * Adds a new listener to the current {@link ContentManager} instance.
   * @param {Object} listener - The listener to be added.
   */
  addListener(listener) {
    this.listeners.add(listener);
  }

  /**
   * Sets an instance of {@link IntegrationModel} class to the current {@link ContentManager}
   * instance.
   * @param {IntegrationModel} integrationModel - The {@link IntegrationModel} instance.
   */
  setIntegrationModel(integrationModel) {
    this.integrationModel = integrationModel;
  }

  /**
   * Sets the {@link ModalDialog} instance into the current {@link ContentManager} instance.
   * @param {ModalDialog} modalDialogInstance - The {@link ModalDialog} instance
   */
  setModalDialogInstance(modalDialogInstance) {
    this.modalDialogInstance = modalDialogInstance;
  }

  /**
   * Inserts the content into the current {@link ModalDialog} instance updating
   * the title and inserting the JavaScript editor.
   */
  insert() {
    // Before insert the editor we update the modal object title to avoid weird render display.
    this.updateTitle(this.modalDialogInstance);
    this.insertEditor(this.modalDialogInstance);
  }

  /**
   * Inserts MathType editor into the {@link ModalDialog.contentContainer} using the SDK Editor.
   * The SDK handles script loading and JsEditor instantiation internally.
   */
  insertEditor() {
    const container = this.modalDialogInstance.contentContainer;

    // Ensure the container has an id so the SDK Editor can find it.
    if (!container.id) {
      container.id = "wrs_sdk_editor_container";
    }

    // Derive the SDK base URL from the configured editorUrl.
    const editorUrl = ContentManager.getEditorBaseUrl();

    // Map the current editorAttributes to the SDK EditorConfig.
    const sdkEditorConfig = {
      language: this.editorAttributes.language || this.language,
      toolbar: this.editorAttributes.toolbar || "general",
    };

    // Create the SDK instance and the SDK Editor.
    const sdkInstance = new SDK({ url: "patata" });
    console.log("Creating SDK Editor with config:", sdkEditorConfig);
    this.editor = sdkInstance.createEditor(sdkEditorConfig);

    // Use the SDK's ContentChanged event to track changes
    // (replaces the old EditorListener pattern).
    this.editor.on("ContentChanged", () => {
      if (this.waitingForChanges && !this.isContentChanged) {
        this.isContentChanged = true;
      }
    });

    // Listen for the EditorReady event to perform post-init setup.
    this.editor.on("EditorReady", () => {
      // iOS events.
      if (this.modalDialogInstance.deviceProperties?.isIOS) {
        setTimeout(function () {
          if (this.hasOwnProperty("modalDialogInstance")) this.modalDialogInstance.hideKeyboard(); // eslint-disable-line no-prototype-builtins
        }, 400);

        const formulaDisplayDiv = document.getElementsByClassName("wrs_formulaDisplay")[0];
        if (formulaDisplayDiv) {
          Util.addEvent(formulaDisplayDiv, "focus", this.modalDialogInstance.handleOpenedIosSoftkeyboard);
          Util.addEvent(formulaDisplayDiv, "blur", this.modalDialogInstance.handleClosedIosSoftkeyboard);
        }
      }

      // Fire onLoad event. Necessary to set the MathML into the editor after it is loaded.
      this.listeners.fire("onLoad", {});
    });

    // Kick off the SDK Editor initialization (loads script + creates editor in the container).
    this.editor.init(container.id);
  }

  /**
   * Returns the base URL for the SDK from the configured editorUrl.
   * Strips the trailing "/editor" segment if present.
   * @returns {String} The SDK-compatible base URL.
   */
  static getEditorBaseUrl() {
    let editorUrl = Configuration.get("editorUrl");

    // Normalize protocol.
    const anchorElement = document.createElement("a");
    ContentManager.setHrefToAnchorElement(anchorElement, editorUrl);
    ContentManager.setProtocolToAnchorElement(anchorElement);
    editorUrl = ContentManager.getURLFromAnchorElement(anchorElement);

    // The SDK appends "/editor" internally, so strip it from the configured URL.
    if (editorUrl.endsWith("/editor")) {
      editorUrl = editorUrl.slice(0, -"/editor".length);
    }

    return editorUrl;
  }

  /**
   * Initializes the current class.
   * With the SDK, script loading is handled by the SDK Editor's init() method,
   * so this method is now a no-op. The SDK will load the editor script
   * when insertEditor() calls sdkEditor.init().
   */
  init() {
    // Script loading is now deferred to insertEditor() via the SDK.
    // No pre-loading is needed.
  }

  /**
   * Sets the specified url to the anchor element.
   * @param {HTMLAnchorElement} anchorElement - Element where set 'url'.
   * @param {String} url - URL to set.
   */
  static setHrefToAnchorElement(anchorElement, url) {
    anchorElement.href = url;
  }

  /**
   * Sets the current protocol to the anchor element.
   * @param {HTMLAnchorElement} anchorElement - Element where set its protocol.
   */
  static setProtocolToAnchorElement(anchorElement) {
    // Change to https if necessary.
    if (window.location.href.indexOf("https://") === 0) {
      // It check if browser is https and configuration is http.
      // If this is so, we will replace protocol.
      if (anchorElement.protocol === "http:") {
        anchorElement.protocol = "https:";
      }
    }
  }

  /**
   * Returns the url of the anchor element adding the current port
   * if it is needed.
   * @param {HTMLAnchorElement} anchorElement - Element where extract the url.
   * @returns {String}
   */
  static getURLFromAnchorElement(anchorElement) {
    // Check protocol and remove port if it's standard.
    const removePort = anchorElement.port === "80" || anchorElement.port === "443" || anchorElement.port === "";
    return `${anchorElement.protocol}//${anchorElement.hostname}${removePort ? "" : `:${anchorElement.port}`}${anchorElement.pathname.startsWith("/") ? anchorElement.pathname : `/${anchorElement.pathname}`}`; // eslint-disable-line max-len
  }

  /**
   * Returns object with editor stats.
   *
   * @typedef {Object} EditorStatsObject
   * @property {string} editor - Editor name.
   * @property {string} mode - Current configuration for formula save mode.
   * @property {string} version - Current plugins version.
   * @returns {EditorStatsObject}
   */
  getEditorStats() {
    // Editor stats. Use environment property to set it.
    const stats = {};
    if ("editor" in this.environment) {
      stats.editor = this.environment.editor;
    } else {
      stats.editor = "unknown";
    }

    if ("mode" in this.environment) {
      stats.mode = this.environment.mode;
    } else {
      stats.mode = Configuration.get("saveMode");
    }

    if ("version" in this.environment) {
      stats.version = this.environment.version;
    } else {
      stats.version = Configuration.get("version");
    }

    return stats;
  }

  /**
   * Returns true if device is iOS. Otherwise, false.
   * @returns {Boolean}
   */
  static isIOS() {
    return (
      ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(navigator.platform) ||
      // iPad on iOS 13 detection
      (navigator.userAgent.includes("Mac") && "ontouchend" in document)
    );
  }

  /**
   * Returns true if device is Mobile. Otherwise, false.
   * @returns {Boolean}
   */
  static isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  /**
   * Returns true if editor is loaded. Otherwise, false.
   * With the SDK, the editor script loading is handled internally by the SDK Editor.
   * This always returns false since the SDK uses async init — callers should
   * rely on the 'onLoad' listener event instead.
   * @returns {Boolean}
   */
  static isEditorLoaded() {
    return false;
  }

  /**
   * Sets the {@link ContentManager.editor} initial content.
   */
  setInitialContent() {
    if (!this.isNewElement) {
      this.setMathML(this.mathML);
    }
  }

  /**
   * Sets a MathML into the SDK Editor instance.
   * @param {String} mathml - MathML string.
   * @param {Boolean} focusDisabled - If true editor doesn't get focus after the MathML is set.
   * False by default.
   */
  setMathML(mathml, focusDisabled) {
    if (typeof focusDisabled === "undefined") {
      focusDisabled = false;
    }
    // The SDK Editor's setMathML is synchronous.
    // We manage the change tracking state directly.
    this.editor.setMathML(mathml);
    this.waitingForChanges = true;

    // We need to wait a little to allow the editor to settle before
    // resetting the content changed flag (same timing as the original).
    setTimeout(() => {
      this.isContentChanged = false;
    }, 500);

    if (!focusDisabled) {
      this.onFocus();
    }
  }

  /**
   * Sets the focus to the current instance of {@link ContentManager.editor}. Triggered by
   * {@link ModalDialog.focus}.
   */
  onFocus() {
    if (typeof this.editor !== "undefined" && this.editor != null) {
      this.editor.focus();

      // On WordPress integration, the focus gets lost right after setting it.
      // To fix this, we enforce another focus some milliseconds after this behaviour.
      setTimeout(() => {
        this.editor.focus();
      }, 100);
    }
  }

  /**
   * Updates the edition area by calling {@link IntegrationModel.updateFormula}.
   * Triggered by {@link ModalDialog.submitAction}.
   */
  submitAction() {
    if (!this.editor.isEmpty()) {
      let mathML = this.editor.getMathMLWithSemantics();
      // Add class for custom editors.
      if (this.customEditors.getActiveEditor() !== null) {
        const { toolbar } = this.customEditors.getActiveEditor();
        mathML = MathML.addCustomEditorClassAttribute(mathML, toolbar);
      } else {
        // We need - if exists - the editor name from MathML
        // class attribute.
        Object.keys(this.customEditors.editors).forEach((key) => {
          mathML = MathML.removeCustomEditorClassAttribute(mathML, key);
        });
      }
      const mathmlEntitiesEncoded = MathML.mathMLEntities(mathML);
      this.integrationModel.updateFormula(mathmlEntitiesEncoded);
    } else {
      this.integrationModel.updateFormula(null);
    }

    this.customEditors.disable();
    this.integrationModel.notifyWindowClosed();

    // Set disabled focus to prevent lost focus.
    this.setEmptyMathML();
    this.customEditors.disable();
  }

  /**
   * Sets an empty MathML as editor content.
   * This will open the MT/CT editor with the hand mode.
   * It adds dir rtl in case of it's activated.
   */
  setEmptyMathML() {
    const isMobile = this.deviceProperties.isAndroid || this.deviceProperties.isIOS;
    // Use the RTL flag from the modal dialog instance (set during integration init).
    const isRTL = this.modalDialogInstance?.rtl || false;

    if (isMobile || this.integrationModel.forcedHandMode) {
      // For mobile devices or forced hand mode, set an empty annotation MATHML to maintain the editor in Hand mode.
      const mathML = `<math${isRTL ? ' dir="rtl"' : ""}><semantics><annotation encoding="application/json">[]</annotation></semantics></math>`;
      this.setMathML(mathML, true);
    } else {
      // For non-mobile devices or not forced hand mode, set the empty MathML without an annotation.
      const mathML = `<math${isRTL ? ' dir="rtl"' : ""}/>`;
      this.setMathML(mathML, true);
    }
  }

  /**
   * Open event. Triggered by {@link ModalDialog.open}. Does the following:
   * - Updates the {@link ContentManager.editor} content
   *   (with an empty MathML or an existing formula),
   * - Updates the {@link ContentManager.editor} toolbar.
   * - Recovers the the focus.
   */
  onOpen() {
    if (this.isNewElement) {
      this.setEmptyMathML();
    } else {
      this.setMathML(this.mathML);
    }
    const toolbar = this.updateToolbar();
    this.onFocus();

    if (this.deviceProperties.isIOS) {
      const zoom = document.documentElement.clientWidth / window.innerWidth;

      if (zoom !== 1) {
        // Open editor in Keyboard mode if user use iOS, Safari and page is zoomed.
        this.setKeyboardMode();
      }
    }

    const trigger = this.dbclick ? "formula" : "button";

    // Call Telemetry service to track the event.
    try {
      Telemeter.telemeter.track("OPENED_MTCT_EDITOR", {
        toolbar,
        trigger,
      });
    } catch (error) {
      console.error("Error tracking OPENED_MTCT_EDITOR", error);
    }

    Core.globalListeners.fire("onModalOpen", {});

    if (this.integrationModel.forcedHandMode) {
      this.hideHandModeButton();

      // In case we have a keyboard written formula, we still want it to be opened with handMode.
      if (this.mathML && !this.mathML.includes('<annotation encoding="application/json">') && !this.isNewElement) {
        this.openHandOnKeyboardMathML(this.mathML, this.editor);
      }
    }
  }

  /**
   * Change Editor in keyboard mode when is loaded
   */
  setKeyboardMode() {
    const wrsEditor = document.getElementsByClassName("wrs_handOpen wrs_disablePalette")[0];
    if (wrsEditor) {
      wrsEditor.classList.remove("wrs_handOpen");
      wrsEditor.classList.remove("wrs_disablePalette");
    } else {
      setTimeout(ContentManager.prototype.setKeyboardMode.bind(this), 100);
    }
  }

  /**
   * Hides the hand <-> keyboard mode switch.
   *
   * This method relies completely on the classes used on different HTML elements within the editor itself, meaning
   * any change on those classes will make this code stop working properly.
   *
   * On top of that, some of those classes are changed on runtime (for example, the one that makes some buttons change).
   * This forces us to use some delayed code (this is, a timeout) to make sure everything exists when we need it.
   * @param {*} forced (boolean) Forces the user to stay in Hand mode by hiding the keyboard mode button.
   */
  hideHandModeButton(forced = true) {
    if (this.handSwitchHidden) {
      return; // hand <-> keyboard button already hidden.
    }

    // "Open hand mode" button takes a little bit to be available.
    // This selector gets the hand <-> keyboard mode switch
    const handModeButtonSelector =
      "div.wrs_editor.wrs_flexEditor.wrs_withHand.wrs_animated .wrs_handWrapper input[type=button]";

    // If in "forced mode", we hide the "keyboard button" so the user can't can't change between hand and keyboard modes.
    // We use an observer to ensure that the button it hidden as soon as it appears.
    if (forced) {
      const mutationInstance = new MutationObserver((mutations) => {
        const handModeButton = document.querySelector(handModeButtonSelector);
        if (handModeButton) {
          handModeButton.hidden = true;
          this.handSwitchHidden = true;
          mutationInstance.disconnect();
        }
      });
      mutationInstance.observe(document.body, {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true,
      });
    }
  }

  /**
   * It will open any formula written in Keyboard mode with the hand mode with the default hand trace.
   *
   * @param {String} mathml The original KeyBoard MathML
   * @param {Object} editor The SDK Editor instance.
   */
  async openHandOnKeyboardMathML(mathml, editor) {
    // Set the MathML first via the SDK Editor (synchronous).
    editor.setMathML(mathml);

    // Use the SDK's getHand() to access the hand editor.
    const handAccessor = editor.getHand();
    if (!handAccessor) {
      // Wait for the hand editor to become available.
      await new Promise((resolve) => {
        const interval = setInterval(() => {
          if (editor.getHand()) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
      });
    }

    // Switch to handwriting input mode via the SDK.
    editor.setInputMode("handwriting");
  }

  /**
   * Waits until the hand editor object exists.
   * @param {Object} editor The SDK Editor instance.
   */
  async waitForHand(editor) {
    while (!editor.getHand()) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  /**
   * Sets the correct toolbar depending if exist other custom toolbars
   * at the same time (e.g: Chemistry).
   */
  updateToolbar() {
    this.updateTitle(this.modalDialogInstance);
    const customEditor = this.customEditors.getActiveEditor();

    let toolbar;
    if (customEditor) {
      toolbar = customEditor.toolbar ? customEditor.toolbar : _wrs_int_wirisProperties.toolbar;

      if (this.toolbar == null || this.toolbar !== toolbar) {
        this.setToolbar(toolbar);
      }
    } else {
      toolbar = this.getToolbar();
      if (this.toolbar == null || this.toolbar !== toolbar) {
        this.setToolbar(toolbar);
        this.customEditors.disable();
      }
    }

    return toolbar;
  }

  /**
   * Updates the current {@link ModalDialog.title}. If a {@link CustomEditors} is enabled
   * sets the custom editor title. Otherwise sets the default title.
   */
  updateTitle() {
    const customEditor = this.customEditors.getActiveEditor();
    if (customEditor) {
      this.modalDialogInstance.setTitle(customEditor.title);
    } else {
      this.modalDialogInstance.setTitle("MathType");
    }
  }

  /**
   * Returns the editor toolbar, depending on the configuration local or server side.
   * @returns {String} - Toolbar identifier.
   */
  getToolbar() {
    let toolbar = "general";
    if ("toolbar" in this.editorAttributes) {
      ({ toolbar } = this.editorAttributes);
    }
    // TODO: Change global integration variable for integration custom toolbar.
    if (toolbar === "general") {
      // eslint-disable-next-line camelcase
      toolbar =
        typeof _wrs_int_wirisProperties === "undefined" || typeof _wrs_int_wirisProperties.toolbar === "undefined"
          ? "general"
          : _wrs_int_wirisProperties.toolbar;
    }

    return toolbar;
  }

  /**
   * Sets the current editor toolbar.
   * Note: With the SDK Editor, the toolbar is set at creation time via EditorConfig.
   * Runtime toolbar changes require re-creating the editor. For now, we store the value
   * for reference but it will only take effect on the next editor creation.
   * @param {String} toolbar - The toolbar name.
   */
  setToolbar(toolbar) {
    this.toolbar = toolbar;
    // The SDK Editor does not support runtime toolbar changes via setParams.
    // The toolbar is applied when the editor is created in insertEditor().
    console.warn("ContentManager.setToolbar: Runtime toolbar change is not supported by the SDK Editor. It will take effect on next editor open.");
  }

  /**
   * Sets the custom headers added on editor requests.
   * Note: With the SDK Editor, custom headers are not supported via setParams.
   * @returns {Object} headers - key value headers.
   */
  setCustomHeaders(headers) {
    let headersObj = {};

    // We control that we only get String or Object as the input.
    if (typeof headers === "object") {
      headersObj = headers;
    } else if (typeof headers === "string") {
      headersObj = Util.convertStringToObject(headers);
    }

    // The SDK Editor does not support setParams for custom headers.
    console.warn("ContentManager.setCustomHeaders: Custom headers are not supported by the SDK Editor.");
    return headersObj;
  }

  /**
   * Returns true if the content of the editor has been changed. The logic of the changes
   * is tracked via the SDK Editor's ContentChanged event.
   * @returns {Boolean} True if the editor content has been changed. False otherwise.
   */
  hasChanges() {
    return !this.editor.isEmpty() && this.isContentChanged;
  }

  /**
   * Handle keyboard events detected in modal when elements of this class intervene.
   * @param {KeyboardEvent} keyboardEvent - The keyboard event.
   */
  onKeyDown(keyboardEvent) {
    if (keyboardEvent.key !== undefined && keyboardEvent.repeat === false) {
      if (keyboardEvent.key === "Escape" || keyboardEvent.key === "Esc") {
        // Code to detect Esc event.
        // There should be only one element with class name 'wrs_pressed' at the same time.
        let list = document.getElementsByClassName("wrs_expandButton wrs_expandButtonFor3RowsLayout wrs_pressed");
        if (list.length === 0) {
          list = document.getElementsByClassName("wrs_expandButton wrs_expandButtonFor2RowsLayout wrs_pressed");
          if (list.length === 0) {
            list = document.getElementsByClassName("wrs_select wrs_pressed");
            if (list.length === 0) {
              this.modalDialogInstance.cancelAction();
              keyboardEvent.stopPropagation();
              keyboardEvent.preventDefault();
            }
          }
        }
      } else if (keyboardEvent.shiftKey && keyboardEvent.key === "Tab") {
        // Code to detect shift Tab event.
        if (document.activeElement === this.modalDialogInstance.submitButton) {
          // Focus is on OK button.
          this.editor.focus();
          keyboardEvent.stopPropagation();
          keyboardEvent.preventDefault();
        } else if (document.querySelector('[title="Manual"]') === document.activeElement) {
          // Focus is on minimize button (_).
          this.modalDialogInstance.closeDiv.focus();
          keyboardEvent.stopPropagation();
          keyboardEvent.preventDefault();
        } else if (document.activeElement === this.modalDialogInstance.minimizeDiv) {
          // Focus on cancel button.
          if (!(this.modalDialogInstance.properties.state === "minimized")) {
            this.modalDialogInstance.cancelButton.focus();
            keyboardEvent.stopPropagation();
            keyboardEvent.preventDefault();
          }
        }
      } else if (keyboardEvent.key === "Tab") {
        // Code to detect Tab event.
        if (document.activeElement === this.modalDialogInstance.cancelButton) {
          // Focus is on X button.
          this.modalDialogInstance.minimizeDiv.focus();
          keyboardEvent.stopPropagation();
          keyboardEvent.preventDefault();
        } else if (document.activeElement === this.modalDialogInstance.closeDiv) {
          // Focus on help button.
          if (!(this.modalDialogInstance.properties.state === "minimized")) {
            const element = document.querySelector('[title="Manual"]');
            element.focus();
            keyboardEvent.stopPropagation();
            keyboardEvent.preventDefault();
          }
        } else {
          // There should be only one element with class name 'wrs_formulaDisplay'.
          const element = document.getElementsByClassName("wrs_formulaDisplay")[0];
          if (element.getAttribute("class") === "wrs_formulaDisplay wrs_focused") {
            // Focus is on formuladisplay.
            this.modalDialogInstance.submitButton.focus();
            keyboardEvent.stopPropagation();
            keyboardEvent.preventDefault();
          }
        }
      }
    }
  }
}
