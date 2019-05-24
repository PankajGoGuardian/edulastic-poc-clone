export default class LCBHeader {
  getLCBTab = () => cy.get("[data-cy=LiveClassBoard]");

  getExpressGraderTab = () => cy.get("[data-cy=Expressgrader]");

  getStandardBasedReportTab = () => cy.get("[data-cy=StandardsBasedReport]");

  clickOnLCBTab = () => this.getLCBTab().click({ force: true });

  clickOnExpressGraderTab = () =>
    this.getExpressGraderTab()
      .first()
      .click();

  clickOnStandardBasedReportTab = () => this.getStandardBasedReportTab().click();
}
