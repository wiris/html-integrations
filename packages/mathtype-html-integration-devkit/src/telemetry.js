/**
* @classdesc
* Sends and receuives Wiris telemetry data.
*/
export default class TelemetryService {
  constructor() {

    /**
     * Telemetry sender uuid.
     * @type {String}
     */
    this.senderId = TelemetryService.composeUUID();

    /**
     * Telemetry sender uuid.
     * @type {String}
     */
    this.sessionId = TelemetryService.composeUUID();

    throw new Error('Static class StringManager can not be instantiated.');
  }

  /**
  * Sends the specified array of messages to the telemetry endpoint.
  */
  static send(messages) {
    const data = {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': '$api-key', // TODO
        'accept-version': '1', // TODO
      },
      // mode: 'cors', // TODO
      mode: 'no-cors',
      body: JSON.stringify(TelemetryService.composeBody(messages)),
    };

    // DEBUG
    console.log('TelemetryService.send - data:', data);

    return fetch(TelemetryService.endpoint, data)
      .then(response => response)
      .catch((error) => {
        // DEBUG
        console.error('TelemetryService.send - error:', error);
      });
  }

  /**
   * Composes the 'session' object for the Telemetry Service request call.
   */
  static get session() {
    return {
      id: this.sessionId,
      page: 0,
    };
  }

  /**
   * Composes the 'sender' object for the Telemetry Service request call.
   */
  static get sender() {
    return {
      // 1. Client related
      id: this.senderId,
      // This returns 'Linux x86_64'
      // Not as complete as the example 'Ubuntu; Linux x86_64'
      os: navigator.oscpu,
      user_agent: window.navigator.userAgent,

      // 2. Server related
      domain: window.location.hostname,

      // 3. Tech related
      // The deployment key id as defined on the specification.
      deployment: TelemetryService.deployment,
      // Backend: the server language of the service. The possible
      // values are: php, aspx, java or ruby.
      backend: WirisPlugin.currentInstance.serviceProviderProperties.server,
      backend_version: '', // TODO: next iteration.
      // The version of the current javascript package.
      product_version: WirisPlugin.currentInstance.version,
      // The version of the editor.
      editor_version: WirisPlugin.currentInstance.editorVersion,
      // The language of the editor.
      editor_language: WirisPlugin.currentInstance.language,
      // product_backend_version: '7.18.0', // TODO.
      // TODO: We can't know this, yet. This should be injected from the right package.
      // framework: WirisPlugin.currentInstance.environment.editor, // TODO
    };
  }

  /**
   * Composes the deployment id key for 'mathtype-web-*'.
   * It follows the convention defined at the 'doc/adr/XXX-telemetry-deployment-name-convention'
   * TODO: create the 'doc/adr'.
   */
  static get deployment() {
    const { editor } = WirisPlugin.currentInstance.environment;

    const prefix = 'mathtype-web-plugin-';
    let suffix = '';

    if (/Generic/.test(editor)) {
      suffix = 'generic';
    } else if (/Froala/.test(editor)) {
      suffix = 'froala';
    } else if (/CKEditor/.test(editor)) {
      suffix = 'ckeditor';
    } else if (/TinyMCE/.test(editor)) {
      suffix = 'tinymce';
    }

    return `${prefix}${suffix}`;
  }

  /**
  * Given 'messages', composes the Telemetry request body as a JSON.
  */
  static composeBody(messages) {
    const body = {
      messages,
      sender: TelemetryService.sender,
      session: TelemetryService.session,
    };
    return body;
  }

  /**
  * Helper function that generates a random UUID used to identify both the batch and the sender.
  * Wikipedia: A universally unique identifier (UUID) is an identifier standard
  * used in software construction. A UUID is simply a 128-bit value.
  * The meaning of each bit is defined by any of several variants. For human-readable display,
  * many systems use a canonical format using hexadecimal text with inserted hyphen characters.
  */
  static composeUUID() {
    let dt = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }
}

/**
 * TelemetryServer
 * The URL for the telemetry server host is hard-coded header.
 */
const telemetryHost = {
  local: 'http://localhost:4000',
  production: 'https://telemetry.wiris.net',
};

TelemetryService.endpoint = telemetryHost.local; // TODO set production 
