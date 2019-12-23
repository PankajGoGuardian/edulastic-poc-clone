import CypressHelper from "../../../util/cypressHelpers";

export default class TestAssignPage {
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

  selectClass = className => {
    cy.get('[data-cy="selectClass"]').click();
    this.clickOnDropDownOptionByText(className);
    cy.focused().blur();
  };

  selectTestType = type => {
    cy.get('[data-cy="testType"]').click({ force: true });
    this.clickOnDropDownOptionByText(type);
  };

  selectStudent = students => {
    cy.get('[data-cy="selectStudent"]').click();
    cy.wait(1000);
    if (Cypress._.isArray(students)) {
      students.forEach(student => {
        this.clickOnDropDownOptionByText(student);
      });
    } else {
      this.clickOnDropDownOptionByText(students);
    }
    cy.focused().blur();
  };

  clickOnEntireClass = () => cy.get('[data-cy="radioEntireClass"]').click();

  clickOnSpecificStudent = () => cy.get('[data-cy="radioSpecificStudent"]').click();

  getCalenderOk = () => cy.get(".ant-calendar-ok-btn");

  // start , end => new Date() instance
  setStartAndCloseDate = (start, end) => {
    this.getStartDate().click({ force: true });
    CypressHelper.setDateInCalender(start);
    // cy.get('[data-cy="closeDate"]').click({ force: true });
    CypressHelper.setDateInCalender(end);
  };

  getStartDate = () => cy.get('[data-cy="startDate"]');

  getCloseDate = () => cy.get('[data-cy="closeDate"]');

  // start - new Date() instance
  setStartDate = start => {
    this.getStartDate().click({ force: true });
    CypressHelper.setDateInCalender(start);
  };

  setEndDate = end => {
    this.getCloseDate().click({ force: true });
    CypressHelper.setDateInCalender(end);
  };

  clickOnAssign = () => {
    cy.wait(1000);
    cy.server();
    cy.route("POST", "**/assignments").as("assigned");
    cy.contains("ASSIGN").click();
    cy.wait("@assigned").then(xhr => {
      assert(
        xhr.status === 200,
        `assigning the assignment - ${xhr.status === 200 ? "success" : JSON.stringify(xhr.responseBody)}`
      );
    });
  };

  // OVER RIDE TEST SETTING

  showOverRideSetting = () => {
    if (Cypress.$('[inputfeatures="assessmentSuperPowersMarkAsDone"]').length === 0) {
      cy.contains("OVERRIDE TEST SETTINGS").click({ force: true });
    }
  };

  // MARK AS DONE
  setMarkAsDoneToManual = () =>
    cy
      .get('[inputfeatures="assessmentSuperPowersMarkAsDone"]')
      .find('[value="manually"]')
      .check();

  setMarkAsDoneToAutomatic = () =>
    cy
      .get('[inputfeatures="assessmentSuperPowersMarkAsDone"]')
      .find('[value="automatically"]')
      .check();

  // MAXIMUM ATTEMPTS ALLOWED
  getMaxAttempt = () => cy.get('[inputfeatures="maxAttemptAllowed"]').find("input");

  setMaxAttempt = attempt => this.getMaxAttempt().type(`{selectall}${attempt}`);
}
