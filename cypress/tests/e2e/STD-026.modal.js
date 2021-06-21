/// <reference types="cypress" />
// ***********************************************************
// Test case: INT-STD-026
// Title:     Validate Hand formulas open Hand directly when edited
// Document:  https://docs.google.com/document/d/10nBVV0y3O5Eo7hEHtok8-s8zsZqVId7s_jwT5vziy7g/edit
// Context:   E2E / Modal
// Issue:     -
// ***********************************************************
beforeEach(() => {
  // Load fixtures
  cy.fixture('formulas.json').as('formulas');

  // Visit page
  cy.visit('/');

  // Clear the editor content in order to reduce noise
  cy.getTextEditor().clear();
});

it('Validate Hand formulas open Hand directly when edited', function () {
  // Click the MT button on the HTML editor toolbar
  cy.clickButtonToOpenModal();

  // Switch to Hand editing mode by clicking the Hand icon in the MT modal window
  // Draw a formula
  // Instead of drawing the formula by hand, we type them in and let Hand transform them
  cy.typeInModal(this.formulas['formula-general']);
  cy.clickModalButton('hand');

  // Click the OK button in the MT modal window
  cy.clickModalButton('insert');

  // Double-click the created Hand formula
  cy.getFormula(0)
    .dblclick();

  // MT modal window opens and Hand editing mode is already displayed with the formula
  cy.get('canvas')
    .should('be.visible');
});
