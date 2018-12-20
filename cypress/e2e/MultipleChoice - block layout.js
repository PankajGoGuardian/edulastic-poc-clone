describe('Test Multiple Choice Flow', () => {
  before(() => {
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

  it('Multiple choice - block layout Test', () => {
    // Test Each Question Type
    cy.get('div').should('contain', 'Multiple choice - block layout');
    cy.get('div')
      .contains('Multiple choice - block layout')
      .next()
      .click();

    cy.get('div')
      .find('[contenteditable]')
      .eq(0)
      .clear()
      .type('How many days are there in a week?');

    cy.get('div')
      .find('[contenteditable]')
      .eq(2)
      .clear()
      .type('5');

    cy.get('div')
      .find('[contenteditable]')
      .eq(4)
      .clear()
      .type('6');

    cy.get('div')
      .find('[contenteditable]')
      .eq(6)
      .clear()
      .type('7');

    cy.contains('Add New Choice').should('be.visible');
    cy.contains('Add New Choice').click();

    cy.get('div')
      .find('[contenteditable]')
      .eq(8)
      .clear()
      .type('8');
  });

  it('Select Correct Answer', () => {
    cy.get('div')
      .find('label')
      .eq(2)
      .click();
    cy.get('div')
      .find('label')
      .eq(3)
      .click();

    // Save Multiple Choice - standard
    cy.contains('SAVE').should('be.visible');
    cy.contains('SAVE').click();
  });

  it('Visit Item Detail Page', () => {
    // cy.visit('/author/items/5c0ad0b2ef0a9d1535686fd1/item-detail');
    cy.wait(2000);
    cy.contains('PREVIEW').should('be.visible');
    cy.contains('PREVIEW').click();
  });

  it('Check Answers', () => {
    cy.get('div')
      .find('label')
      .eq(3)
      .click();

    cy.contains('Check Answer').should('be.visible');
    cy.contains('Check Answer').click();

    // Show Answers
    cy.contains('Show Answers').should('be.visible');
    cy.contains('Show Answers').click();
  });

  it('Edit Answer', () => {
    cy.wait(2000);
    cy.contains('EDIT').should('be.visible');
    cy.contains('EDIT').click();

    // Source Button Test
    cy.contains('Source').should('be.visible');
    cy.contains('Source').click();
  });
});
