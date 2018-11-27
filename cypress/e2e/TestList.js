describe('Create a new test', () => {
  it('Visit Create Test Page', () => {
    cy.setToken().then(() => {
      cy.visit('/author/tests')
        .contains('Create Test')
        .click();
    });
  });
});
