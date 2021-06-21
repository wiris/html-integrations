/// <reference types="cypress" />
// ***********************************************************
// Test case: INT-STD-011
// Title:     Check Minimize, Maximize, and Close icons are visible in the modal.
// Document:  https://docs.google.com/document/d/1soW156YvORb3TIumKmlIjhpRccme5c_YyQhVLypIh0s/edit
// Context:   UI / Modal
// Issue:     KB-13069
// ***********************************************************
describe('Resize modal icons are visible', () => {
  beforeEach(() => {
    // Visit the page.
    cy.visit('/');

    // Open the mathtype modal
    cy.clickButtonToOpenModal();
  });

  it('minimize icon should be visible on mathtype modal', () => {
    // Check that minimize button is visible on mathtype modal
    cy.get('.wrs_modal_minimize_button').should('be.visible');
  });

  it('maximize icon should be visible on mathtype modal', () => {
    // Check that minimize button is visible on mathtype modal
    cy.get('.wrs_modal_maximize_button').should('be.visible');
  });

  it('close icon should be visible on mathtype modal', () => {
    // Check that minimize button is visible on mathtype modal
    cy.get('.wrs_modal_close_button').should('be.visible');
  });
});
