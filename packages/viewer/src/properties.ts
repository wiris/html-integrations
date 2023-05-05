import { configurationJson, StatusError } from './services';

// Helper types for Config below
type Viewer = 'image' | 'none';
type Wirispluginperformance = 'true' | 'false';

/**
 * Type representing all the configuration for the viewer.
 */
export type Config = {
  editorServicesRoot?: string,
  editorServicesExtension?: string,
  backendConfig?: {
    wirispluginperformance?: Wirispluginperformance,
    wiriseditormathmlattribute?: string,
  },
  dpi?: number,
  element?: string,
  lang?: string,
  viewer?: Viewer,
  zoom?: number,
};

/**
 * Fallback values for the configurations that are not set.
 */
const defaultValues: Config = {
  editorServicesRoot: 'https://www.wiris.net/demo/plugins/app/',
  editorServicesExtension: '',
  backendConfig: {
    wirispluginperformance: 'true',
    wiriseditormathmlattribute: 'data-mathml'
  },
  dpi: 96,
  element: 'body',
  lang: 'en',
  viewer: 'none',
  zoom: 1,
}

/**
 * This class will handle the parameters defined by the user.
 */
export abstract class Properties {

  static render: () => Promise<void> = async () => {};

  // Flag for the static parameters that access the backend.
  private static backendObtained: boolean = false;

  private static waitForBackend() {
    while (!this.backendObtained);
  }

  // Get URL properties (retrocompatibility).
  static config: Config = defaultValues;
  static {

    // Get URL parameters from <script>
    const pluginName = 'WIRISplugins.js';
    const script: HTMLScriptElement = document.querySelector(`script[src*="${pluginName}"]`);

    if (!!script) {

      const pluginNamePosition: number = script.src.lastIndexOf(pluginName);
      const params: string = script.src.substring(pluginNamePosition + pluginName.length);
      const urlParams = new URLSearchParams(params);

      if (urlParams.get('dpi') !== null && urlParams.get('dpi') !== undefined) {
        this.config.dpi = +urlParams.get('dpi');
      }
      if (urlParams.get('element') !== null && urlParams.get('element') !== undefined) {
        this.config.element = urlParams.get('element');
      }
      if (urlParams.get('lang') !== null && urlParams.get('lang') !== undefined) {
        this.config.lang = urlParams.get('lang');
      }
      if (urlParams.get('viewer') !== null && urlParams.get('viewer') !== undefined) {
        this.config.viewer = (urlParams.get('viewer') as Viewer);
      }
      if (urlParams.get('zoom') !== null && urlParams.get('zoom') !== undefined) {
        this.config.zoom = +urlParams.get('zoom');
      }

    }

    // Get backend parameters calling the configurationjson service
    (async () => {
      try {
        this.config.backendConfig = await configurationJson(
          ['wirispluginperformance', 'wiriseditormathmlattribute'],
          Properties.editorServicesRoot,
          Properties.editorServicesExtension,
        );
      } catch(e) {
        if (e instanceof StatusError) {
          // Do nothing; leave default values.
          console.error(e);
        } else {
          throw e;
        }
      } finally {
        // Stop looking for the backend (even if the request fails)
        this.backendObtained = true;
      }
    })();

  }

  /**
   * Set the config values manually.
   */
  static init(config: Config) {
    Properties.config = {...defaultValues, ...config};
  }

  static get editorServicesRoot(): string {
    return this.config.editorServicesRoot ||
      defaultValues.editorServicesRoot;
  }

  static set editorServicesRoot(editorServicesRoot: string) {
    this.config.editorServicesRoot = editorServicesRoot;
    this.render();
  }

  static get editorServicesExtension(): string {
    return this.config.editorServicesExtension ||
      defaultValues.editorServicesExtension;
  }

  static set editorServicesExtension(editorServicesExtension: string) {
    this.config.editorServicesExtension = editorServicesExtension;
    this.render();
  }

  /**
   * Return the language.
   * In order of priority, the first of the following that is set is returned:
   * - The lang parameter set in the <script> (WIRISplugin.js?lang=...)
   * - The HTML document language (<html lang=...>).
   * - The language of the browser.
   * - English, by default.
   * @returns {string} Encoded language string.
   */
  static get lang(): string {
    const configLang = (this.config.lang === 'inherit') ? null : this.config.lang;
    return configLang ||
      document.getElementsByTagName('html')[0].lang ||
      navigator.language ||
      defaultValues.lang;
  }

  static set lang(lang: string) {
    this.config.lang = lang;
    this.render();
  }

  /**
   * Return the viewer mode for the MathML.
   * In order of priority, the first of the following that is set is returned:
   * - The viewer parameter set in the <script> (WIRISplugin.js?viewer=...)
   * - none, by default.
   */
  static get viewer(): Viewer {
    return this.config.viewer ||
      defaultValues.viewer;
  }

  static set viewer(viewer: Viewer) {
    this.config.viewer = viewer;
    this.render();
  }

  /**
   * Return the dpi of the images.
   * In order of priority, the first of the following that is set is returned:
   * - The dpi parameter set in the <script> (WIRISplugin.js?dpi=...)
   * - 96, by default.
   */
  static get dpi(): number {
    return this.config.dpi ||
      defaultValues.dpi;
  }

  static set dpi(dpi: number) {
    this.config.dpi = dpi;
    this.render();
  }

  /**
   * Return the zoom of the images.
   * In order of priority, the first of the following that is set is returned:
   * - The zoom parameter set in the <script> (WIRISplugin.js?zoom=...)
   * - 1, by default.
   */
  static get zoom(): number {
    return this.config.zoom ||
      defaultValues.zoom;
  }

  static set zoom(zoom: number) {
    this.config.zoom = zoom;
    this.render();
  }

  /**
   * Return the element in which to render formulas.
   * In order of priority, the first of the following that is set is returned:
   * - The zoom parameter set in the <script> (WIRISplugin.js?element=...)
   * - 'body', by default.
   */
  static get element(): string {
    return this.config.element ||
      defaultValues.element;
  }

  static set element(element: string) {
    this.config.element = element;
    this.render();
  }

  /**
   * Return the Wiris plugin performance.
   * In order of priority, the first of the following that is set is returned:
   * - The backend configuration of the parameter.
   * - true, by default.
   */
  static get wirispluginperformance(): Wirispluginperformance {
    this.waitForBackend();
    return this.config.backendConfig.wirispluginperformance ||
      defaultValues.backendConfig.wirispluginperformance;
  }

  static set wirispluginperformance(wirispluginperformance: Wirispluginperformance) {
    this.config.backendConfig.wirispluginperformance = wirispluginperformance;
    this.render();
  }

  /**
   * Return the Wiris MathML attribute.
   * In order of priority, the first of the following that is set is returned:
   * - The backend configuration of the parameter.
   * - data-mathml, by default.
   */
  static get wiriseditormathmlattribute(): string {
    this.waitForBackend();
    return this.config.backendConfig.wiriseditormathmlattribute ||
      defaultValues.backendConfig.wiriseditormathmlattribute;
  }

  static set wiriseditormathmlattribute(wiriseditormathmlattribute: string) {
    this.config.backendConfig.wiriseditormathmlattribute = wiriseditormathmlattribute;
    this.render();
  }
}
