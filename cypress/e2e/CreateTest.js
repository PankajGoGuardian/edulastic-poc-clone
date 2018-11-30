describe('Visit Create Test Page', () => {
  it('Visit Create Test Page', () => {
    cy.setToken().then(() => {
      cy.visit('/author/tests/create');
    });
  });
});

describe('Check Create Test Flow', () => {
  beforeEach(() => {
    cy.setToken();
  });

  it('Visit Create Test Page', () => {
    cy.visit('/author/tests/create');
    cy.server();
    cy.route('GET', '/api/testitem/limit=10&skip=0&data=true&validation=true')
      .as('load');

    cy.wait(2000);

    // Add test items

    cy.get('button').eq(3).find('span').should('contain', 'ADD');
    cy.get('button').eq(3).click();

    cy.get('button').eq(4).find('span').should('contain', 'ADD');
    cy.get('button').eq(4).click();

    cy.get('button').eq(5).find('span').should('contain', 'ADD');
    cy.get('button').eq(5).click();

    cy.get('button').eq(6).find('span').should('contain', 'ADD');
    cy.get('button').eq(6).click();

    // Summary Tab Test

    cy.contains('Summary')
      .click();

    cy.get('input').first().focus()
      .clear()
      .type('Nice Product!');

    cy.get('textarea').eq(0).focus()
      .clear()
      .type('This is a description for test!');

    // Review Tab Test

    cy.contains('Review')
      .click();

    // Review tab should contain expected buttons

    cy.get('button').eq(3).find('span').should('contain', 'Remove Selected');
    cy.get('button').eq(4).find('span').should('contain', 'Move to');
    cy.get('button').eq(6).find('span').should('contain', 'Collapse Rows');


    cy.contains('Save changes')
      .click();
  });
});
