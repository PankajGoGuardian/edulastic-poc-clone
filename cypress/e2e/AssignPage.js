describe('Check Review Page', () => {
  beforeEach(() => {
    cy.setToken();
    cy.visit('/author/tests/create');
  });

  it('Assign Page UI Test', () => {
    // Review Tab Test
    cy.contains('ASSIGN')
      .click();

    cy.get('button').find('span').should('contain', 'Add new assignment');

    cy.get('div').should('contain', 'Class Name');
    cy.get('div').should('contain', 'Open Policy');
    cy.get('div').should('contain', 'Close Policy');
    cy.get('div').should('contain', 'Open Date');
    cy.get('div').should('contain', 'Close Date');
  });

  it('Assign Page Functional Test', () => {
    cy.contains('ASSIGN')
      .click();

    cy.get('button').contains('Add new assignment').click();

    cy.get('input').first().focus()
      .clear()
      .type('New Assignment');
  });
});
