export default class LCBHeader {
  getLCBTab = () => cy.get("[data-cy=Expressgrader]");

  getExpressGraderTab = () => cy.get("[data-cy=LiveClassBoard]");

  getStandardBasedReportTab = () => cy.get("[data-cy=StandardsBasedReport]");

  clickOnLCBTab = () => this.getLCBTab().click();

  clickOnExpressGraderTab = () => this.getExpressGraderTab().click();

  clickOnStandardBasedReportTab = () => this.getStandardBasedReportTab().click();
}
