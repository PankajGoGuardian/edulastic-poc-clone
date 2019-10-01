import CypressHelper from "../../../util/cypressHelpers";

export default class TestAssignPage {
  selectClass = className => {
    cy.get('[data-cy="selectClass"]').click();

    cy.get(".ant-select-dropdown-menu-item").then($ele => {
      $ele
        // eslint-disable-next-line func-names
        .filter(function() {
          return Cypress.$(this).text() === className;
        })
        .click();
    });
    cy.focused().blur();
  };

  selectTestType = type => {
    cy.get('[data-cy="testType"]').click({ force: true });
    cy.get(".ant-select-dropdown-menu-item").then($ele => {
      $ele
        // eslint-disable-next-line func-names
        .filter(function() {
          return Cypress.$(this).text() === type;
        })
        .click();
    });
  };

  selectStudent = student => {
    cy.get('[data-cy="selectStudent"]').click();
    cy.get(".ant-select-dropdown-menu-item")
      .contains(student)
      .click();
    cy.focused().blur();
  };

  clickOnEntireClass = () => cy.get('[data-cy="radioEntireClass"]').click();

  clickOnSpecificStudent = () => cy.get('[data-cy="radioSpecificStudent"]').click();

  getCalenderOk = () => cy.get(".ant-calendar-ok-btn");

  // start , end => new Date() instance
  setStartAndCloseDate = (start, end) => {
    cy.get('[data-cy="startDate"]').click({ force: true });
    CypressHelper.setDateInCalender(start);
    // cy.get('[data-cy="closeDate"]').click({ force: true });
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
}
