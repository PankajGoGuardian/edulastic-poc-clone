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

    // points
    cy.get('[data-cy=points]').type('{uparrow}');
    cy.get('[data-cy=points]').type('{uparrow}');
    cy.get('[data-cy=points]').type('{downarrow}');

    // Set Answers
    cy.get('div')
      .find('label')
      .eq(1)
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

    // Save Multiple Choice - True or False
    cy.contains('SAVE').should('be.visible');
    cy.contains('SAVE').click();
  });

  it('Check Answer', () => {
    // cy.wait(5000);
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
