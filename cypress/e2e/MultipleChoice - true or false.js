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

  it('Multiple choice - True or False Test', () => {
    // Test Each Question Type
    cy.get('div').should('contain', 'True or false');
    cy.get('div')
      .contains('True or false')
      .next()
      .click();

    cy.get('div')
      .find('[contenteditable]')
      .eq(0)
      .clear()
      .type('Do you like flower?');

    cy.get('div').should('contain', 'Set Correct Answer(s)');

    // Set Answers
    cy.get('div')
      .find('label')
      .eq(1)
      .click();

    // Save Multiple Choice - True or False
    cy.contains('SAVE').should('be.visible');
    cy.contains('SAVE').click();
  });

  it('Check Answer', () => {
    cy.wait(2000);
    cy.contains('PREVIEW').should('be.visible');
    cy.contains('PREVIEW').click();

    // Check Answers
    cy.get('div')
      .find('label')
      .eq(0)
      .click();

    cy.contains('Check Answer').should('be.visible');
    cy.contains('Check Answer').click();

    cy.get('div')
      .find('label')
      .eq(1)
      .click();

    cy.contains('Check Answer').should('be.visible');
    cy.contains('Check Answer').click();

    // Show Answers
    cy.contains('Show Answers').should('be.visible');
    cy.contains('Show Answers').click();
  });

  it('Edit Answer', () => {
    cy.contains('EDIT').should('be.visible');
    cy.contains('EDIT').click();

    // Source Button Test
    cy.contains('Source').should('be.visible');
    cy.contains('Source').click();
  });
});
