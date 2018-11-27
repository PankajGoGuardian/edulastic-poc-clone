describe('Visit Create Test Page', () => {
  it('Visit Create Test Page', () => {
    cy.setToken().then(() => {
      cy.visit('/author/tests/create');
    });
  });
});

describe('Check Create Test Flow', () => {
  it('Visit Create Test Page', () => {
    cy.setToken().then(() => {
      cy.visit('/author/tests/create')
        .contains('ADD')
        .click();

      cy.contains('Summary')
        .click();

      cy.get('input').first().focus()
        .clear()
        .type('Nice Product!');

      cy.get('div').contains('Assign')
        .click();

      cy.contains('Save changes')
        .click();
    });
  });
});
