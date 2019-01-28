import ReportsPage from './reportsPage';
class StudentTestPage {
  //click check answer
  onClickWrongCheckAnswer() {
    cy.get('[data-cy=checkAnswer]')
      .should('be.visible')
      .click();
    // cy.contains('Score: 0/1').should('be.visible');
  }

  //click check answer
  onClickRightCheckAnswer() {
    cy.get('[data-cy=checkAnswer]')
      .should('be.visible')
      .click();
    // cy.contains('Score: 1/1').should('be.visible');
  }

  //  next click
  onClickNext() {
    cy.wait(2000);
    cy.get('[data-cy=next]')
      .should('be.visible')
      .click();
  }

  // prev click
  onClickPrev() {
    cy.wait(2000);
    cy.get('[data-cy=prev]')
      .should('be.visible')
      .click();
  }

  //  click on  finish test
  onClickFinishTest() {
    cy.wait(2000);
    cy.get('[data-cy=finishTest]')
      .should('be.visible')
      .click();
  }

  onClickCancel() {
    cy.wait(2000);
    cy.get('[data-cy=cancel]')
      .should('be.visible')
      .click();
  }

  onClickApply() {
    cy.wait(2000);
    cy.get('[data-cy=proceed]')
      .should('be.visible')
      .click();
  }

  onClickSubmit() {
    cy.wait(2000);
    cy.contains('SUBMIT')
      .should('be.visible')
      .click();
    cy.contains('Cancel')
      .should('be.visible')
      .click();
    cy.contains('SUBMIT')
      .should('be.visible')
      .click();
    cy.get('[data-cy=submit]')
      .should('be.visible')
      .click();
    cy.url().should('include', '/home/reports');
    return new ReportsPage();
  }

  //  ------------------------>

  // select question
  onClickQuestion() {
    cy.get('[data-cy=options]')
      .should('be.visible')
      .click();
  }

  //setting
  onClickSetting() {
    cy.wait(2000);
    cy.get('[data-cy=setting]')
      .should('be.visible')
      .click();
    cy.contains('Check Answer')
      .should('be.visible')
      .click();
  }

  onClickHint() {
    cy.contains('hint').should('be.visible');
  }

  onClickBookmark() {
    cy.contains('bookmark').should('be.visible');
  }
}
export default StudentTestPage;
