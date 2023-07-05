import MathML from '../src/mathml';
const constants = require('./const');

test('Validate Math Hand formula', () => {
  expect(MathML.removeSemantics(constants.mathHand)).toBe(constants.mathHandValid);
});

test('Validate Chem Hand formula', () => {
  expect(MathML.removeSemantics(constants.chemHand)).toBe(constants.chemHandValid);
});

test('Validate Math not Hand formula', () => {
  expect(MathML.removeSemantics(constants.mathNoMrow)).toBe(constants.mathNoMrowValid);
});

test('Validate Chem not Hand formula', () => {
  expect(MathML.removeSemantics(constants.chemNoMrow)).toBe(constants.chemNoMrowValid);
});
