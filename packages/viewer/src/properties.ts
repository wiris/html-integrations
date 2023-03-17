// This class will handle the parameters defined by the user. Those will be used ...

// Expect mtconfig.json // configuration.ini (for the previouw viewer) // default params.
export type BackendConfig = {
  wirispluginperformance?: 'true' | 'false',
  wiriseditormathmlattribute?: string,
};

export type Config = {
  EDITOR_SERVICES_ROOT: string,
  lang: string,
  backendConfig: BackendConfig,
};

export abstract class Properties {
  // Back-end default url.
  public static EDITOR_SERVICES_ROOT: string = 'https://www.wiris.net/demo/plugins/app/';

  // Default language
  public static lang: string = Properties.getBrowserLang();

  /**
  * Return the user's browser language.
  * @returns {string} Encoded Language string.
  */
  private static getBrowserLang(): string {
    // TODO contemplate case in which the lang parameter is not declared in the html tag
    // e.g. also consider taking the user's settings
    return document.getElementsByTagName('html')[0].lang;
  }

  private static getURLParams() {
    const pluginName = "WIRISplugins.js";
    let scripts:any = document.getElementsByTagName("script");
    for (let i = 0; i < scripts.length; ++i) {
      scripts = scripts[i].src.includes(pluginName) ? scripts[i] : scripts;
    }
    const urlParams = new URLSearchParams(scripts);
  }
}
