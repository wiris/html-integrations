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
        'x-api-key': '$api-key', // TODO
        'accept-version': '1', // TODO
      },
      // mode: 'cors', // TODO
      mode: 'no-cors',
      body: JSON.stringify(TelemetryService.composeBody(messages)),
    };

    return fetch(TelemetryService.endpoint, data)
      .then(response => response)
      .catch((error) => {
        console.error(error);
      });
  }

  /**
  * Sends asyncrhonously the specified array of messages to the telemetry endpoint.
  * Usage: try {
  *   TelemetryService.sendAsync([{...}]).then(data => console.log(data));
  *   }
  *   catch (error) { console.log(error) }
  */
  static async sendAsync() {
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

    const response = await fetch(TelemetryService.endpoint, data);
    console.log('response:', response);
    const result = await response.json();
    console.log('result:', result);
    return result;
  }

  /**
  * Given messages, composes the body as a JSON.
  */
  static composeBody(messages) {
    const body = {
      messages,
      test: '413',
      version: '1',
      sender: TelemetryService.sender,
      session: TelemetryService.session,
    };
    console.log(body);

    return body;
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

  // static get editorName() {
  //   const { editor } = WirisPlugin.currentInstance.environment;

  //   if (/Generic/.test(editor)) {
  //     return 'generic';
  //   } if (/Froala/.test(editor)) {
  //     return 'froala';
  //   } if (/CKEditor/.test(editor)) {
  //     return 'ckeditor';
  //   } if (/TinyMCE/.test(editor)) {
  //     return 'tinymce';
  //   }
  // }


  // static get EditorVersion() {
  //   const version = '';
  //   switch (editor) {
  //     case 'froala':
  //       // TODO: How we know for sure that FroalaEditor object is available
  //       // TODO: Support for versions 2 and 3
  //       // Froala 2:
  //       // $.FE.VERSION
  //       // Froala 3:
  //       // FroalaEditor.VERSION
  //       version = FroalaEditor.VERSION;
  //       break;
  //     case 'ckeditor':

  //       break;
  //     case 'tinymce':

  //       break;

  //     default:
  //       break;
  //   }
  //   return version;
  // }
}

// Telemetry server
// TODO: convert to an array and environment variables
const endPointLocal = 'http://localhost:4000';
const endPointDev = 'https://telemetry.formiga.net'; // Cal tenir VPN
const endPointTest = 'https://telemetry.wiris.test';
const endPointProduction = 'https://telemetry.wiris.net';

TelemetryService.endpoint = endPointLocal; // TODO
