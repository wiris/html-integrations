import Telemetry from '../src/telemetry';

/**
 * This test is docused on checking one isolated Telemetry function
 */
describe('Check the correct format of the Telemetry compose UUID function. TAG = Telemetry',
  () => {
    /**
     * To check that the format is correct,
     * it has to compare the REGEX expected with the value that returns the function
     */
    it('Check UUID format', () => {
      const uuidV4Regex = /^[A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12}$/i; // Save the uuid regex
      const UUID = Telemetry.composeUUID(); // Call the telemetry compose UUID function
      expect(uuidV4Regex.test(UUID)).toBeTruthy(); // Assert that the UUID fits correctly the regex
    });
  });
