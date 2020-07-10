import Telemetry from '../src/telemetry';

describe('Check the correct format of the Telemetry compose UUID function',
  () => {
    it('Check UUID format', () => {
      const uuidV4Regex = /^[A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12}$/i; // Save the uuid regex
      const UUID = Telemetry.composeUUID(); // Call the telemetry compose UUID function
      expect(uuidV4Regex.test(UUID)).toBeTruthy(); // Assert that the UUID fits correctly the regex
    });
  });
