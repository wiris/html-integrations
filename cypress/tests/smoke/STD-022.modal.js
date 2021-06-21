/// <reference types="cypress" />
// ***********************************************************
// Test case: INT-STD-022
// Title:     User opens MT, edits an equation and Cancels. Accepts the ‘are you sure you want to leave?’ dialog
// Document:  https://docs.google.com/document/d/11R4j3ZW0a50Lp02frqihtfZPeBFAYfN_xtqrs3AejdM/edit
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

it('User opens MT, edits an equation and Cancels. Accepts the ‘are you sure you want to leave?’ dialog', function () {
  // Click on the MT icon in the HTML editor toolbar
  cy.clickButtonToOpenModal();

  // Type the formula
  cy.typeInModal(this.formulas['formula-general']);

  // Click the Cancel button in the MT editor
  cy.clickModalButton('cancel');

  // Click the Close button from the ‘Are you sure you want to leave?’ dialog
  cy.clickModalButton('confirmationClose');

  // The MT editor modal window is closed and...
  cy.get('.wrs_modal_dialogContainer')
    .should('not.to.be.visible');

  // ... no formula is inserted to the HTML editor
  // We check for the 2nd formula, as currently the demos come with one formula by default
  // (So one .Wirisformula in the editor and one .Wirisformula in the preview)
  cy.get('.Wirisformula').eq(1).should('not.exist');
});
