import CKEditor5Integration from '../src/integration'

// Define a global integration to be assigned
let integration;

/**
 * This tests is focused on check the mathtype getLanguage function 
 * through the mathtypeParameters
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
          mathTypeParameters: {
            editorParameters: { language: 'es' },
          },
          get : function(param) { return this[param]; }
        }
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
     * Retrieves the language from the CKEditor5 integration definition.
     * It has to be retrieved from editorParameters.
     */
    it('MathtypeParameters: language defined', async () => {
      const lang = await integration.getLanguage();
      expect(lang).toBe('es');
    });
  });
