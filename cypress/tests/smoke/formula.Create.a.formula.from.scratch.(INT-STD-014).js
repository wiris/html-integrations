/// <reference types="cypress" />

describe('HTML editor', () => {
  beforeEach(() => {
    cy
      .visit('/');
  });

  it('should be able to open MathType', () => {
    cy
      .clickMathType();
  });

  it('should be able to be written in', () => {
    cy
      .typeInTextEditor('Hello');
  });

  it('should be able to allow writing in MathType', () => {
    cy
      .clickMathType()
      .typeInMathType('2+2');
  });
});
