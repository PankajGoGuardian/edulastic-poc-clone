export default class LCBHeader {
  // *** ELEMENTS START ***

  getLCBTab = () => cy.get("[data-cy=LiveClassBoard]");

  getExpressGraderTab = () => cy.get("[data-cy=Expressgrader]");

  getStandardBasedReportTab = () => cy.get("[data-cy=StandardsBasedReport]");

  getDropDown = () => cy.get('[data-cy="headerDropDown"]');

  getConfirmationInput = () => cy.get('[data-cy="confirmationInput"]');

  getAssignmentStatus = () => cy.get('[data-cy="assignmentStatusForDisplay"]');

  // *** ELEMENTS END ***

  // *** ACTIONS START ***

  clickOnLCBTab = () => {
    this.getLCBTab().click({ force: true });
    cy.get('[data-cy="studentName"]').should("have.length.greaterThan", 0);
  };

  clickOnExpressGraderTab = () =>
    this.getExpressGraderTab()
      .first()
      .click();

  submitConfirmationInput = () => cy.get('[data-cy="submitConfirm"]').click();

  clickOnStandardBasedReportTab = () => this.getStandardBasedReportTab().click({ force: true });

  clickOnOpenPause = isPause => {
    cy.server();
    cy.route("PUT", /toggle-pause/i).as("togglePause");
    cy.get('[data-cy="openPauseButton"]').click();
    if (isPause) {
      this.getConfirmationInput().type("PAUSE");
      this.submitConfirmationInput();
    }
    cy.wait("@togglePause").then(xhr => assert(xhr.status === 200, `verify pause-open request ${xhr.status}`));
  };

  clickOnClose = () => {
    cy.server();
    cy.route("PUT", /close/i).as("close");
    cy.get('[data-cy="closeButton"]').click();
    this.getConfirmationInput().type("CLOSE");
    this.submitConfirmationInput();
    cy.wait("@close").then(xhr => assert(xhr.status === 200, `verify close request ${xhr.status}`));
    cy.wait("@assignment");
  };

  clickOnOpen = () => {
    cy.server();
    cy.route("PUT", /open/i).as("open");
    cy.get('[data-cy="openButton"]').click();
    return cy.wait("@open").then(xhr => assert(xhr.status === 200, `verify open request ${xhr.status}`));
  };

  clickOnUnassign = () => {
    cy.server();
    cy.route("DELETE", "**/assignments/**").as("unassign");
    this.getDropDown().click({ force: true });
    cy.get('[data-cy="unAssign"]').click({ force: true });
    this.getConfirmationInput().type("UNASSIGN");
    this.submitConfirmationInput();
    cy.wait("@unassign").then(xhr => assert(xhr.status === 200, `verify close request ${xhr.status}`));
  };

  clickOnMarkAsDone = () => {
    cy.server();
    cy.route("PUT", /mark-as-done/i).as("markDone");
    this.getDropDown().click({ force: true });
    cy.get('[data-cy="markAsDone"]').click({ force: true });
    cy.wait("@markDone").then(xhr => assert(xhr.status === 200, `verify mark as done request ${xhr.status}`));
  };

  clickOnViewPassword = () => {
    this.getDropDown().click({ force: true });
    cy.get('[data-cy="viewPassword"]').click();
  };

  // *** ACTIONS END ***

  // *** APPHELPERS START ***

  verifyAssignmentStatus = status => this.getAssignmentStatus().should("contain", status);

  // *** APPHELPERS END ***
}
