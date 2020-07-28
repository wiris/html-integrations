import Accessibility from "../src/accessibility";

describe('e2e test to check that a formula is inserted',
  () => {

    // Checks that the mathtoaccessible function returns the correct expected value
    it('Check 1 + 2 accessible text return', async () => {
      const mathml = '<math><mn>1</mn><mo>+</mo><mn>2</mn></math>';
      const language = 'en';
      let data = {};
      data.centerbaseline = "false";
      data.metrics = "true";
      data.mml = '<math"><mn>1</mn><mo>+</mo><mn>2</mn></math>';
      const altProp = Accessibility.mathMLToAccessible(mathml, language, data);
      expect(altProp).toBe('straight x minus straight y');
    });
  });
