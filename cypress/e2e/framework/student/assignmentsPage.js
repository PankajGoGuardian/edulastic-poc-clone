import studentTestPage from './studentTestPage';
class AssignmentsPage {
  isVisible() {
    cy.contains('Assignments').should('be.visible');
    // cy.contains(' ALL').should('be.visible');
    // cy.contains(' IN PROGRESS').should('be.visible');
    // cy.contains(' NOT STARTED').should('be.visible');
    // cy.contains(' SUBMITTED').should('be.visible');
    // cy.contains(' GRADED').should('be.visible');
    // cy.get('[data-cy=breadcrumb]')
    //   .contains('ASSIGNMENTS')
    //   .should('be.visible');
  }
  validateAssignment(status, assignmentButton) {
    cy.contains('Auto Test Assignment').should('be.visible');
    cy.contains(status).should('be.visible');
    cy.contains(assignmentButton).should('be.visible');
  }

  //attempts validation
  // correct answer
  // score
  // click on attempts

  onClickStartAssignment() {
    cy.get('[data-cy=assignmentButton]')
      .eq(0)
      .should('be.visible')
      .click({ force: true });
    return new studentTestPage();
  }

  onClickRetake() {
    cy.contains('RESUME')
      .should('be.visible')
      .click();
    return new studentTestPage();
  }

  //
}
export default AssignmentsPage;
