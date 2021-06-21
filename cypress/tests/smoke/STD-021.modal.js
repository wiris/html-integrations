/// <reference types="cypress" />
// ***********************************************************
// Test case: INT-STD-021
// Title:     Open and close the mathtype modal without adding any formula.
// Document:  https://docs.google.com/document/d/1MloNEApADlavZHfODqScyGCNUrZyMgiGYrPx46c4waQ/edit
// Context:   E2E / Modal
// Issue:     KB-13069
// ***********************************************************
beforeEach(() => {
  // Visit the page.
  cy.visit('/');
});

it('should be able to edit and existing formula and cancel the edition', () => {
  // Open the mathtype modal bu clicking the mathtype button
  cy.clickButtonToOpenModal();

  // Click the cancel button on the mathtype modal to close the modal
  cy.clickModalButton('cancel');

  // Verify the modal is closed
  cy
    .get('.wrs_focusElement')
    .should('not.be.visible');
});
