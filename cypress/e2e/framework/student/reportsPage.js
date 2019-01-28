class ReportsPage {
  isVisible() {
    cy.contains('Reports').should('be.visible');
  }
  validateAssignment() {
    cy.contains('REVIEW')
      .should('be.visible')
      .click();
  }
  //for reports
  // create test, start assignment, goto reports
}
export default ReportsPage;
