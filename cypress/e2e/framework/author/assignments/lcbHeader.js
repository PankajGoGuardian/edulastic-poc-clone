export default class LCBHeader {
  // *** ELEMENTS START ***

  getLCBTab = () => cy.get("[data-cy=LiveClassBoard]");

  getExpressGraderTab = () => cy.get("[data-cy=Expressgrader]");

  getStandardBasedReportTab = () => cy.get("[data-cy=StandardsBasedReport]");

  getDropDown = () => cy.get('[data-cy="headerDropDown"]');

  getConfirmationInput = () => cy.get('[data-cy="confirmationInput"]');

  getAssignmentStatus = () => cy.get('[data-cy="assignmentStatusForDisplay"]');

  getSettingsTab = () => cy.get('[data-cy="LCBAssignmentSettings"]');

  getStudentReportButton = () => cy.get('[data-cy="studentReportCard"]');

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

  clickOnClose = (IsCloseAllowed = true) => {
    cy.server();
    cy.route("PUT", /close/i).as("close");
    cy.route("GET", /assignments/).as("assignment");
    cy.get('[data-cy="closeButton"]').click();
    this.getConfirmationInput().type("CLOSE");
    this.submitConfirmationInput();
    cy.wait("@close").then(xhr =>
      // TODO: below line need to be refactored(cy.wait("@assignment"),status code and msg displayed) once app starts behaving expected manner
      expect(xhr.status, `verify close request`).to.eq(IsCloseAllowed ? 200 : 403)
    );
    if (IsCloseAllowed) cy.wait("@assignment");
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

  clickLCBSettings = () => {
    cy.server();
    cy.route("GET", "**/default-test-settings/*").as("load-settings");
    this.getSettingsTab().click();
    cy.wait("@load-settings");
    cy.contains("TEST LEVEL SETTINGS");
  };

  clickStudentReportInDropDown = () => {
    this.getDropDown().click();
    this.getStudentReportButton().click();
  };

  // *** ACTIONS END ***

  // *** APPHELPERS START ***

  verifyAssignmentStatus = status => this.getAssignmentStatus().should("contain", status);

  verifyAssignmentDueDate = dueDate =>
    this.getAssignmentStatus().should("contain", `Due on ${Cypress.moment(dueDate).format("MMM DD, YYYY")}`);

  // *** APPHELPERS END ***
}
