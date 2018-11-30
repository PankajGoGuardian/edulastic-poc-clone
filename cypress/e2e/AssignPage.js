describe('Check Review Page', () => {
  beforeEach(() => {
    cy.setToken();
  });

  it('Assign Page UI Test', () => {
    cy.visit('/author/tests/create');

    // Review Tab Test
    cy.contains('Assign')
      .click();
  });
});
