describe('Test Multiple Choice Flow', () => {
  before(() => {
    cy.setToken();
  });

  it('Visit Item List Page', () => {
    cy.visit('/author/Items');
  });

  it('Check Flow', () => {
    //create test
    cy.get('span')
      .contains('Create')
      .should('be.visible');
    cy.contains('Create').click();

    //add new test
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

  it('Multiple choice - standard Test', () => {
    // Test Each Question Type
    cy.get('div').should('contain', 'Multiple choice - standard');
    cy.get('div')
      .contains('Multiple choice - standard')
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
      .type('Red');

    cy.get('div')
      .find('[contenteditable]')
      .eq(4)
      .clear()
      .type('Green');

    cy.get('div')
      .find('[contenteditable]')
      .eq(6)
      .clear()
      .type('Violet');

    cy.get('div')
      .find('[contenteditable]')
      .eq(6)
      .trigger('mouseup');

    // reordering list
    // cy.get('div[toolbarId=idprefix0]').trigger('mousedown');

    //delete
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

    //select answer
    cy.get('div')
      .find('label')
      .eq(0)
      .click();

    //click on alternate
    cy.get('[data-cy=alternate]').should('be.visible');
    cy.get('[data-cy=alternate]').click();

    //select answer
    cy.get('div')
      .find('label')
      .eq(1)
      .click();

    // multiple responses
    cy.contains('Multiple Responses').click();
    cy.contains('Multiple Responses').click();

    //advance option --->

    //icon plus click
    cy.get('[data-cy=iconPlus]').should('be.visible');
    cy.get('[data-cy=iconPlus]').click();
    cy.get('.fdOowS').click();
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

    // select font size

    //click on source
    cy.get('[data-cy=source]').should('be.visible');
    cy.get('[data-cy=source]').click();

    //close source modal
    cy.get('.gEyPor').click();

    // Save Multiple Choice - standard
    cy.contains('SAVE').should('be.visible');
    cy.contains('SAVE').click();
  });

  it('Visit Item Detail Page', () => {
    cy.wait(2000);
    cy.contains('PREVIEW').should('be.visible');
    cy.contains('PREVIEW').click();

    //check answer
    cy.contains('Violet').click();
    cy.contains('Check Answer').should('be.visible');
    cy.contains('Check Answer').click();
    cy.contains('Clear').should('be.visible');
    cy.contains('Clear').click();

    cy.contains('Red').click();
    cy.contains('Check Answer').should('be.visible');
    cy.contains('Check Answer').click();
    cy.contains('Clear').should('be.visible');
    cy.contains('Clear').click();

    //show answer
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
