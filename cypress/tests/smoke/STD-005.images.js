/// <reference types="cypress" />
// ***********************************************************
// Test case: INT-STD-005
// Title:     Validate formula height and width is correct.
// Document:  https://docs.google.com/document/d/167zTPA2JxtbPaxdCp8kBKIEHoRyjHZnIWYmOPLEEMY4/edit
// Context:   UI / Image
// Issue:     KB-13069
// ***********************************************************
beforeEach(() => {
  // Visit the page.
  cy.visit('/');

  // Clear the editor content in order to reduce noise
  cy.getTextEditor().clear();
});

it('The inserted formula should have the correct width and height', () => {
  // Open the mathtype modal
  cy.clickButtonToOpenModal();

  // Write a mathtype formula: x/3
  cy.typeInModal('{ctrl}/').type('x').type('{downarrow}3');

  // Insert the written formula by clicking the insert button on the modal
  cy.clickModalButton('insert');

  // Get the previous inserted formula
  cy.getFormula(0).then(($formula) => {
    const formula = $formula[0];

    // Assert that the width and height are the ones writen in the test case for the inserted formula
    expect(formula.width).to.equal(18);
    expect(formula.height).to.equal(41);
  });
});
