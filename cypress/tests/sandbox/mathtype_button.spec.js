/// <reference types="cypress" />

import { clickMathTypeButton } from '../../page-objects/mathtype_button';

context('MathType button', () => {
  beforeEach(() => {
    // Uses base url setting from cypress.json
    // which right now points at "localhost:8007",
    // the html5+generic example demo app.
    cy.visit('/');
  });

  it('should open MathType when clicked (INT-STD-014)', () => {
    // Assemble: no need in this case.

    // Act
    cy.clickMathType();

    // cy.get('.wrs_modal_dialogContainer')
    //   .should('be.visible');

    // Write formula inside MathType
    cy.fixture('formulas').then((formulas) => {
      cy.get('.wrs_focusElement')
        .wait(2000)
        .type(formulas['formula-string-simple']);
    });

    // Insert formula
    // cy.wait(2000)
    cy.clickModalButton('insert');
    // cy.wait(1000);
    // cy.clickModalButton('hand')
    // cy.wait(1000);
    // cy.clickModalButton('hand')
    cy.editMathFormula('doubleClick', 1);

    // Assert
    // cy.fixture('formulas').then((formulas) => {
    //   cy.get(`[alt="${formulas['formula-string-simple-accessible-es']}"]`)
    //     .should('be.visible');
    // });
  });
});
