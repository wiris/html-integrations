/**
* @classdesc
* Sends and receuives Wiris telemetry data.
*/
export default class TelemetryService {

  constructor() {
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
        'x-api-key': "$api-key", // TODO
        'accept-version': "1", // TODO
      },
      // mode: 'cors',
      body: JSON.stringify(TelemetryService.composeBody(messages)),
    };

    return fetch(TelemetryService.endpoint, data)
    .then(response => {
      return response;
    })
    .catch(error => {
      console.error(error);
    });
  }

  /**
  * Given messages, composes the body as a JSON.
  */
  static composeBody(messages) {
    return {
      messages,
      sender: TelemetryService.sender,
      session: TelemetryService.session,
    };
  }

  static get session() {
    return {
      id: '3ed99c27-82ca-4774-92ee-0574eb770527', // TODO
      page: 1, // TODO
    };
  }

  static get sender() {
    return {
      // Client related
      id: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx', // TODO
      // This returns 'Linux x86_64'
      // Not as complete as the example 'Ubuntu; Linux x86_64'
      os: navigator.oscpu,
      user_agent: window.navigator.userAgent,

      // Server related
      domain: window.location.hostname,

      // Tech related
      deployment: TelemetryService.deployment, // TODO
      editor_version: '0.0.0', // TODO
      product_version: WirisPlugin.currentInstance.version,
      product_backend_version: '7.18.0', // TODO
      backend: WirisPlugin.currentInstance.serviceProviderProperties.server, // TODO
      framework: WirisPlugin.currentInstance.environment.editor, // TODO
    };
  }

  static get deployment() {
    const editor = WirisPlugin.currentInstance.environment.editor;

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

}

// Telemetry server
TelemetryService.endpoint = 'http://localhost:4000'; // TODO
