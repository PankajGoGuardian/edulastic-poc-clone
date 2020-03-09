export default class RediectPopup {
  // *** ELEMENTS START ***

  getExpressGraderTab = () => cy.get("[data-cy=Expressgrader]");

  getStandardBasedReportTab = () => cy.get("[data-cy=StandardsBasedReport]");

  // *** ELEMENTS END ***

  // *** ACTIONS START ***

  clickOnDropDownOptionByText = option => {
    cy.get(".ant-select-dropdown-menu-item").then($ele => {
      cy.wrap(
        $ele
          // eslint-disable-next-line func-names
          .filter(function() {
            return Cypress.$(this).text() === option;
          })
      ).click({ force: true });
    });
  };

  clickOnEntireClass = () => cy.get('[data-cy="entireClass"]').click();

  clickOnAbsentStudents = () => cy.get('[data-cy="absentStudents"]').click();

  clickOnSpecificStudents = () => cy.get('[data-cy="specificStudents"]').click();

  selectQuestionDelivey = option => {
    cy.get('[data-cy="questionDelivery"]').click({ force: true });
    this.clickOnDropDownOptionByText(option);
  };

  selectRedirectPolicy = option => {
    cy.get('[data-cy="previousAttempt"]').click({ force: true });
    this.clickOnDropDownOptionByText(option);
  };

  clickOnLCBTab = () => this.getLCBTab().click({ force: true });

  clickOnExpressGraderTab = () =>
    this.getExpressGraderTab()
      .first()
      .click();

  clickOnStandardBasedReportTab = () => this.getStandardBasedReportTab().click({ force: true });
  // *** ACTIONS END ***

  // *** APPHELPERS START ***
  // *** APPHELPERS END ***
}
