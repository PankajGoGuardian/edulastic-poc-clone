describe('Test Multiple Choice Flow', () => {
  beforeEach(() => {
    cy.setToken();
  });

  it('Visit Item List Page', () => {
    cy.visit('/author/Items');
  });

  it('Check Flow', () => {
    cy.get('button')
      .contains('Create')
      .should('be.visible');
    cy.contains('Create').click();
    cy.contains('Add New').click();

    cy.get('li').should('contain', 'Multiple Choice');
    cy.get('li').should('contain', 'Fill in the Blanks');
    cy.get('li').should('contain', 'Classify, Match & Order');
    cy.get('li').should('contain', 'Written & Spoken');
    cy.get('li').should('contain', 'Highlight');
    cy.get('li').should('contain', 'Math');
    cy.get('li').should('contain', 'Graphing');
    cy.get('li').should('contain', 'Charts');
    cy.get('li').should('contain', 'Chemistry');
    cy.get('li').should('contain', 'Other');
  });

  it('Multiple choice - multiple response Test', () => {
    // Test Each Question Type
    cy.get('div').should('contain', 'Multiple choice - multiple response');
    cy.get('div')
      .contains('Multiple choice - multiple response')
      .next()
      .click();

    cy.get('div')
      .find('[contenteditable]')
      .eq(0)
      .clear()
      .type('What is your favorite color?');

    cy.get('div')
      .find('[contenteditable]')
      .eq(2)
      .clear()
      .type('White');

    cy.get('div')
      .find('[contenteditable]')
      .eq(4)
      .clear()
      .type('Black');

    cy.get('div')
      .find('[contenteditable]')
      .eq(6)
      .clear()
      .type('Blue');

    cy.get('div')
      .find('[contenteditable]')
      .eq(6)
      .trigger('mouseup');

    // Add new choice

    cy.contains('Add New Choice').should('be.visible');
    cy.contains('Add New Choice').click();

    // Save Multiple Choice - standard

    cy.contains('SAVE').should('be.visible');
    cy.contains('SAVE').click();
  });

  it('Visit Item Detail Page', () => {
    cy.visit('/author/items/5c094fe34be5af0d7fe9ba83/item-detail');
    /* eslint-disable */
    cy.wait(2000);
    cy.contains('PREVIEW').should('be.visible');
    cy.contains('PREVIEW').click();
  });

  it('Check Answers', () => {
    cy.contains('Show Answers').should('be.visible');
    cy.contains('Show Answers').click();
  });

  it('Edit Answers', () => {
    cy.contains('EDIT').should('be.visible');
    cy.contains('EDIT').click();
  });
});
