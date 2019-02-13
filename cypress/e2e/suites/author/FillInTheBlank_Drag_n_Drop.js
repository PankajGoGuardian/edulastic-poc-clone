// / <reference types="Cypress" />
describe('Test Multiple Choice Flow', () => {
  before(() => {
    cy.setToken();
  });

  it('Visit Item List Page', () => {
    cy.visit('/author/Items');
  });

  it('Check Flow', () => {
    // click on create test
    cy.get('span')
      .contains('Create')
      .should('be.visible');
    cy.get('span').contains('Create').click();

    // add new test
    cy.contains('Add New').should('be.visible');
    cy.contains('Add New').click();
  });

  it('Cloze with Drag & Drop', () => {
    // Test Question Type - Cloze with Drag & Drop
    cy.get('li').contains('Fill in the Blanks').click();
    cy.get('div').should('contain', 'Cloze with Drag & Drop');
    cy.get('div')
      .contains('Cloze with Drag & Drop')
      .next()
      .click();

    // Create template
    cy.get('div')
      .find('[contenteditable]')
      .eq(2)
      .clear()
      .type('Fill the correct sequence fo months: JAN = ')
      .trigger('mousedown');
    cy.get('.ql-insertStar').click();

    cy.get(':nth-child(1) > .main > div > input').clear().type('First');


    // Choose correct ans
    cy.contains('Set Correct Answer(s)').scrollIntoView();
    cy.get('.responses_box')
      .find('div').contains('First')
      .trigger("mousedown", { which: 1 })

    cy.get('.Droppable')
      .trigger('mousemove',{force:true})
      .trigger('mouseup',{force:true});
  });
});
