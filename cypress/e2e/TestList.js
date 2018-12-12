describe('Create a new test', () => {
  it('Visit Create Test Page', () => {
    cy.setToken().then(() => {
      cy.visit('/author/tests');
      cy.get('button')
        .contains('Create Test')
        .should('be.visible');
      cy.contains('Create Test').click();
    });
  });
});