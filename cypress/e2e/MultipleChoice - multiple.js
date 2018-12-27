/// <reference types="Cypress" />
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
    cy.contains('Add New').should('be.visible');
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

    // reordering list

    // delete choice
    cy.get('[data-cy=deleteprefix2]').should('be.visible');
    cy.get('[data-cy=deleteprefix2]').click();

    // Add new choice
    cy.contains('Add New Choice').should('be.visible');
    cy.contains('Add New Choice').click();

    cy.get('div').should('contain', 'Set Correct Answer(s)');

    //points
    cy.get('[data-cy=points]').type('{uparrow}');
    cy.get('[data-cy=points]').type('{uparrow}');
    cy.get('[data-cy=points]').type('{downarrow}');

    //select answer1
    cy.get('div')
      .find('label')
      .eq(0)
      .click();

    //select answer2
    cy.get('div')
      .find('label')
      .eq(1)
      .click();

    //click on alternate
    cy.get('[data-cy=alternate]').should('be.visible');
    cy.get('[data-cy=alternate]').click();

    //select answer2
    cy.get('div')
      .find('label')
      .eq(1)
      .click();

    //select answer3
    cy.get('div')
      .find('label')
      .eq(2)
      .click();

    // advanced option click

    cy.contains('Advanced Options')
      .should('be.visible')
      .click();
  
    //check enable auto scoring

    cy.contains('Enable auto scoring').click();

    //penalty points
    cy.get('[data-cy=penalty]').type('{uparrow}');
    cy.get('[data-cy=penalty]').type('{uparrow}');
    cy.get('[data-cy=penalty]').type('{downarrow}');

    //check answer attempts
    cy.get('[data-cy=feedback]').type('{uparrow}');
    cy.get('[data-cy=feedback]').type('{uparrow}');
    cy.get('[data-cy=feedback]').type('{downarrow}');

    // check answer button
    cy.contains('Check answer button').click();

    // select scoring type
    cy.get('[data-cy="scoringType"]')
        .should('be.visible')
        .click();
    
    cy.get('[data-cy="exactMatch"]')
      .should('be.visible')
      .click()

    cy.get('[data-cy="orientationSelect"]')
      .get('.ant-select-selection-selected-value')
      .should('contain','Exact match');

    // minimum score attempted
    cy.get('[data-cy=minscore]').type('{uparrow}');
    cy.get('[data-cy=minscore]').type('{uparrow}');
    cy.get('[data-cy=minscore]').type('{downarrow}');

    // layout ---->

    //select style

    // number of columns
    cy.get('[data-cy=columns]').type('{uparrow}');
    cy.get('[data-cy=columns]').type('{uparrow}');
    cy.get('[data-cy=columns]').type('{downarrow}');

    // select orientation

    cy.get('[data-cy="orientationSelect"]')
      .should('be.visible')
      .click();
    
    cy.get('[data-cy="horizontal"]')
      .should('be.visible')
      .click()

    cy.get('[data-cy="orientationSelect"]')
      .get('.ant-select-selection-selected-value')
      .should('contain','Horizontal');

    // select font 

    cy.get('[data-cy="fontSizeSelect"]')
      .should('be.visible')
      .click()
    
    cy.get('[data-cy="small"]')
      .should('be.visible')
      .click()
    
    cy.get('[data-cy="fontSizeSelect"]')
      .get('.ant-select-selection-selected-value')
      .should('contain','Small');

    //click on source
    cy.get('[data-cy=source]').should('be.visible');
    cy.get('[data-cy=source]').click();

    //close source modal
    cy.get('[data-cy=close]').click();

    // Save Multiple Choice - multiple response
    cy.contains('SAVE').should('be.visible');
    cy.contains('SAVE').click();
  });

  it('Visit Item Detail Page', () => {
    cy.wait(5000);
    cy.contains('PREVIEW').should('be.visible');
    cy.contains('PREVIEW').click();

    //check answer
    cy.contains('White').click();
    cy.contains('Check Answer').should('be.visible');
    cy.contains('Check Answer').click();
    cy.contains('Clear').should('be.visible');
    cy.contains('Clear').click();

    cy.contains('Black').click();
    cy.contains('Check Answer').should('be.visible');
    cy.contains('Check Answer').click();
    cy.contains('Clear').should('be.visible');
    cy.contains('Clear').click();

    //show answer
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
