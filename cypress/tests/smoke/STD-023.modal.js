/// <reference types="cypress" />
// ***********************************************************
// Test case: INT-STD-023
// Title:     User opens MT, edits an equation and closes the modal via X button. Denies the ‘are you sure you want to leave?’ dialog and inserts the formula
// Document:  https://docs.google.com/document/d/1EaC9zB9eIADTk06j3TyPouOwzIp3AHael5zV39kOMyM/edit
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

it('User opens MT, edits an equation and closes the modal via X button. Denies the ‘are you sure you want to leave?’ dialog and inserts the formula', function () {
  // Click on the MT icon in the HTML editor toolbar
  cy.clickButtonToOpenModal();

  // Type the formula
  cy.typeInModal(this.formulas['formula-general']);

  // Click the ‘X’ button of the MT modal window in order to close it
  cy.clickModalButton('xClose');

  // Click the Cancel button from the ‘Are you sure you want to leave?’ dialog
  cy.clickModalButton('confirmationCancel');

  // Click the Insert button in the MT modal window
  cy.clickModalButton('insert');

  // The formula is rendered in the HTML editor
  // We check for the 3rd formula, as currently the demos come with one formula by default
  // (So one .Wirisformula in the editor and one .Wirisformula in the preview)
  cy.getFormula(0)
    .should('be.visible');
});
