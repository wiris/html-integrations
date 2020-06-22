/**
* @classdesc
* Sends and receuives Wiris telemetry data.
*/
export default class TelemetryService {
  constructor() {
    throw new Error('Static class StringManager can not be instantiated.');
  }

  /**
  * Static property.
  * The sender uuid..
  * @private
  * @type {String}
  */
  static get senderId() {
    if (!this._senderId) {
      this._senderId = TelemetryService.composeSenderUUID();
    }
    return this._senderId;
  }

  /**
  * Static property.
  * The session uuid.
  * @private
  * @type {String}
  */
  static get sessionId() {
    if (!this._sessionId) {
      this._sessionId = TelemetryService.composeUUID();
    }
    return this._sessionId;
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
    // console.log('TelemetryService.send - data:', data);
    return fetch(TelemetryService.endpoint, data)
      .then(response => response)
      .catch((error) => {
        // DEBUG
        // console.error('TelemetryService.send - error:', error);
      });
  }

  /**
   * Composes the 'session' object for the Telemetry Service request call.
   */
  static get session() {
    return {
      id: TelemetryService.sessionId,
      page: 0,
    };
  }

  /**
   * Composes the 'sender' object for the Telemetry Service request call.
   */
  static get sender() {
    return {
      // 1. Client related.
      id: TelemetryService.senderId,
      // This returns 'Linux x86_64'.
      // Not as complete as the example 'Ubuntu; Linux x86_64'.
      os: navigator.oscpu,
      user_agent: window.navigator.userAgent,

      // 2. Server related.
      domain: window.location.hostname,

      // 3. Tech related.
      // The deployment key id as defined on the specification.
      deployment: TelemetryService.deployment,
      // The version of the editor.
      editor_version: (WirisPlugin.currentInstance.environment.editorVersion ? WirisPlugin.currentInstance.environment.editorVersion : ''),
      // The configured language of the editor.
      language: WirisPlugin.currentInstance.language,
      // The version of the current javascript package.
      product_version: WirisPlugin.currentInstance.version,
      // product_backend_version: '7.18.0', // TODO: next iteration.
      backend: (WirisPlugin.currentInstance.serviceProviderProperties.server ? WirisPlugin.currentInstance.serviceProviderProperties.server : ''),

      // TODOs:
      // 1. Backend version, the server language of the service.
      // The possible values are: php, aspx, java or ruby.
      // eslint-disable-next-line max-len
      // backend_version: (WirisPlugin.currentInstance.environment.backend_version ? WirisPlugin.currentInstance.environment.backend_version : ''), // TODO: next iteration.
      // 2. Framework & platform. We can't know this, yet. 
      // This should be injected from the right package.
      // eslint-disable-next-line max-len
      // framework: (WirisPlugin.currentInstance.serviceProviderProperties.framework ? WirisPlugin.currentInstance.serviceProviderProperties.framework : ''), // TODO: next iteration.
      // eslint-disable-next-line max-len
      // platform: (WirisPlugin.currentInstance.serviceProviderProperties.platform ? WirisPlugin.currentInstance.serviceProviderProperties.platform : ''), // TODO: next iteration.
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

  // TODO: generate an anonymous unique sender footprint based on the local configuration
  static composeSenderUUID() {
    return this.composeUUID();
  }
}

/**
 * TelemetryServer
 * The URL for the telemetry server host is hard-coded.
 */
const telemetryHost = {
  local: 'http://localhost:4000',
  production: 'https://telemetry.wiris.net',
};

/**
 * Stores the Telemetry endpoint host URL.
 * @private
 * @type {String}
 */
TelemetryService.endpoint = telemetryHost.local;

/**
 * Stores the sender uuid.
 * @private
 * @type {String}
 */
TelemetryService._senderId = '';

/**
 * Stores the session uuid.
 * @private
 * @type {String}
 */
TelemetryService._sessionId = '';
