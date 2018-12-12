describe('Create a new test', () => {
  it('Visit Create Test Page', () => {
    cy.setToken().then(() => {
      cy.visit('/author/tests');
      cy.contains('Create Test').should('be.visible');
      cy.contains('Create Test').click();
    });
  });
});
