import CKEditor5Integration from '../src/integration'

// Define a global integration to be assigned
let integration;

/**
 * This tests is focused on check if the browser language is corretly getted
 * when there's not a mathtype or editor language defined.
 */
describe('CKEditor5: Test the language property. TAG = Language',
  () => {
    /**
     * Before the execution of the test is necessary to:
     * initialyze the integration of the CKEditor5 wiris plugin with
     * the parameters to be tested
     */
    beforeAll(async () => {
      const editorObject = {
        config: {
          get : function(param) { return this[param]; }
        },
      };
      const ckeditorIntegrationModelProperties = { 
        editorObject,
        target: {
          tagName: '<html></html>'
        }
      };

      // Start the integration
      integration = await new CKEditor5Integration(ckeditorIntegrationModelProperties);
    });

    /**
     * Retrieves the language from the browser if
     * there's not a language definition on the editor
     */
    it('No language defined', async () => {
      const lang = await integration.getLanguage();
      const browserLang = await integration.getBrowserLanguage();
      expect(lang).toEqual(browserLang);
    });
  });
