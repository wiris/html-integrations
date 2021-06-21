/// <reference types="cypress" />
// ***********************************************************
// Test case: INT-STD-011
// Title:     Check Hand icon is visible.
// Document:  https://docs.google.com/document/d/12cxOZRwLVhE_Aby2Ckjjee2WWJcTuceOcXmuBgZBAlE/edit
// Context:   UI / Modal
// Issue:     KB-13069
// ***********************************************************
beforeEach(() => {
  // Visit the page.
  cy.visit('/');
});

it('Hand icon should be visible on the mathtype modal', () => {
  // Open the mathtype modal
  cy.clickButtonToOpenModal();

  // Check that the hand button is visible on mathtype modal
  cy.get('.wrs_handWrapper > input').should('be.visible');
});
