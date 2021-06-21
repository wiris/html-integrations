/// <reference types="cypress" />
// ***********************************************************
// Test case: INT-STD-020
// Title:     User opens MT and closes it via ESC
// Document:  https://docs.google.com/document/d/1v6NyWfvoFrgX7CWufN12_tCzyO9ITvX3HTAXTIYWCSQ/edit
// Context:   E2E / Modal
// Issue:     -
// ***********************************************************
beforeEach(() => {
  // Visit page
  cy.visit('/');
});

it('User opens MT and closes it via ESC', () => {
  // Click the MT button in the HTML editor toolbar
  cy.clickButtonToOpenModal();

  // Press the ESC key
  cy.pressESCButton();

  // MT editor modal window is closed
  cy.get('.wrs_modal_dialogContainer')
    .should('not.be.visible');
});
