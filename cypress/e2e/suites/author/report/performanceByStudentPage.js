import CypressHelper from "../../../framework/util/cypressHelpers";

export default class PerformanceByStudentReport {
  // *** ELEMENTS START ***

  getCheckBoxByStudentName = studentName =>
    cy
      .get(".ant-table-row-level-0")
      .contains("tr", studentName)
      .find('input[type="checkbox"]');

  getActionButton = () => cy.get('[data-cy="actions"]');

  getGroupSelect = () => cy.get('[data-cy="selectStudentGroup"]');

  getAddNewButton = () => cy.get('[data-cy="addNew"]');

  getGroupNameInput = () => cy.get('[data-cy="groupName"]');

  getGroupDescriptionInput = () => cy.get('[data-cy="groupDescription"]');

  getStudentsAlreadyInGroupContainer = () => cy.get('[data-cy="students-right"]');

  getSelectedStudentsContainer = () => cy.get('[data-cy="students-left"]');

  // *** ELEMENTS END ***

  // *** ACTIONS START ***

  clickOnReportLink = () => {
    cy.server();
    cy.route("**single-assessment**").as("single-assessment");
    cy.route("**performance-by-students**").as("pbs");
    cy.route("**/group/mygroups").as("groups");
    cy.get('[data-cy="performanceByStudents"]').click();
    // report takes time to load hence increaed timeout to 1 min
    cy.wait("@single-assessment", { timeout: 60000 });
    cy.wait("@pbs", { timeout: 60000 });
    cy.wait("@groups");
  };

  selectStudentByName = studentName => this.getCheckBoxByStudentName(studentName).check({ force: true });

  clickOnActionAddToGroup = () => {
    this.getActionButton().click({ force: true });
    cy.get(".ant-dropdown-menu-item")
      .contains("Add to Group")
      .click({ force: true });
    cy.contains("Add / Remove students from groups");
  };

  // new group
  clickOnAddNewButton = () => this.getAddNewButton().click();

  enterGroupName = groupName =>
    this.getGroupNameInput()
      .clear()
      .type(groupName);

  enterGroupDescription = groupDescription =>
    this.getGroupDescriptionInput()
      .clear()
      .type(groupDescription);

  clickOnCancel = () => cy.get('[data-cy="cancelButton"]').click();

  // existing group
  selectGroup = groupName => {
    cy.server();
    cy.route("GET", "**/enrollment/class/**").as("getEnrollment");
    CypressHelper.selectDropDownByAttribute("selectStudentGroup", groupName);
    cy.wait("@getEnrollment");
  };

  clickOnCancelGroupCreation = () => cy.get('[data-cy="cancelGroup"]').click();

  clickOnSaveUpdateGroup = (isNew = true) => {
    cy.server();
    cy.route("POST", "**/group").as("saveGroup");
    cy.get('[data-cy="createGroup"]').click();

    if (isNew) {
      cy.wait("@saveGroup").then(xhr => {
        expect(xhr.status).to.eq(200);
        const { _id, institutionId, districtId } = xhr.responseBody.result;
        const clazz = { districtId };
        clazz.groupIds = [_id];
        clazz.institutionIds = [institutionId];
        cy.saveClassDetailToDelete(clazz);
      });
    }
  };

  // *** ACTIONS END ***

  // *** APPHELPERS START ***

  verifyStudentInAddedList = studentName => {
    this.getStudentsAlreadyInGroupContainer()
      .find(`[data-cy="${studentName}"]`)
      .should("be.exist")
      .find('[data-cy="isSelected-true"]')
      .should("be.exist");
  };

  // *** APPHELPERS END ***
}
