import CKEditor5Integration from '../src/integration'

// Define a global integration to be assigned
let integration;

/**
 * This test is focused on checking the mathtype getLanguage function through the
 * editor language definition
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
          language: 'ar',
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
     * Retrieves the language from the CKEditor5 integration.
     * In this tests the editor language is defined and is the only one
     * so it has to equal 'ar'
     */
    it('Editor language defined', async () => {
      const lang = await integration.getLanguage();
      expect(lang).toBe('ar');
    });
  });
