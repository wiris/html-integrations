// eslint-disable-next-line no-unused-vars
Cypress.Commands.add('isRendered', { prevSubject: 'element' }, (subject, preview = false) => {
  cy.wrap(subject)
    .should('be.visible');
});
