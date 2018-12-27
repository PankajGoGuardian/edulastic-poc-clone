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

  it('Select Correct Answer and set Advance Options', () => {
    cy.get('div')
      .find('label')
      .eq(2)
      .click();
    cy.get('div')
      .find('label')
      .eq(3)
      .click();

    //advance option --->

    //icon plus click
    cy.get('[data-cy=iconPlus]').should('be.visible');
    cy.get('[data-cy=iconPlus]').click();

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
    
    cy.get('[data-cy="partialMatch"]')
      .should('be.visible')
      .click()

    cy.get('[data-cy="orientationSelect"]')
      .get('.ant-select-selection-selected-value')
      .should('contain','Partial match');

    // minimum score attempted
    cy.get('[data-cy=minscore]').type('{uparrow}');
    cy.get('[data-cy=minscore]').type('{uparrow}');
    cy.get('[data-cy=minscore]').type('{downarrow}');

    // layout ---->

    //verify style

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
  

    // Save Multiple Choice - standard
    cy.contains('SAVE').should('be.visible');
    cy.contains('SAVE').click();
  });

  it('Visit Item Detail Page', () => {
    // cy.visit('/author/items/5c0ad0b2ef0a9d1535686fd1/item-detail');
    cy.wait(5000);
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
