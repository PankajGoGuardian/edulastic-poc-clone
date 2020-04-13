import CypressHelper from "../../util/cypressHelpers";
import TeacherSideBar from "../SideBarPage";
import TeacherManageClassPage from "../manageClassPage";

export default class GroupPopup {
  // *** ELEMENTS START ***

  getGroupSelect = () => cy.get('[data-cy="selectStudentGroup"]');

  getAddNewButton = () => cy.get('[data-cy="addNew"]');

  getGroupNameInput = () => cy.get('[data-cy="groupName"]');

  getGroupDescriptionInput = () => cy.get('[data-cy="groupDescription"]');

  getStudentsAlreadyInGroupContainer = () => cy.get('[data-cy="students-right"]');

  getSelectedStudentsContainer = () => cy.get('[data-cy="students-left"]');

  getSelectedStudentByName = studentName => this.getSelectedStudentsContainer().find(`[data-cy="${studentName}"]`);

  getGroupStudentByName = studentName => this.getStudentsAlreadyInGroupContainer().find(`[data-cy="${studentName}"]`);

  // *** ELEMENTS END ***

  // *** ACTIONS START ***

  // new group
  clickOnAddNewButton = () => this.getAddNewButton().click();

  clickOnCancel = () => cy.get('[data-cy="cancelButton"]').click();

  // existing group
  selectGroup = groupName => {
    cy.server();
    cy.route("GET", "**/enrollment/class/**").as("getEnrollment");
    CypressHelper.selectDropDownByAttribute("selectStudentGroup", groupName);
    cy.wait("@getEnrollment");
  };

  clickOnCancelGroupCreation = () => cy.get('[data-cy="cancelGroup"]').click();

  clickOnUpdate = (isNew = true) => {
    cy.server();
    cy.route("POST", "**/group").as("saveGroup");
    cy.route("POST", "**/enrollment/student").as("addEnrollment");
    cy.route("DELETE", "**/enrollment/student").as("deleteEnrollment");
    cy.get('[data-cy="createGroup"]').click();
    cy.get("body").contains("successfully");
    cy.contains("Add / Remove students from groups").should("not.be.visible");
  };

  clickOnAddedStudentByName = studentName => {
    this.getGroupStudentByName(studentName).click();
  };

  // *** ACTIONS END ***

  // *** APPHELPERS START ***

  verifyStudentInAddedList = studentName => {
    this.getGroupStudentByName(studentName)
      .should("be.exist")
      .find('[data-cy="isSelected-true"]')
      .should("be.exist");
  };

  verifyStudentInToAddList = studentName => {
    this.getSelectedStudentByName(studentName)
      .should("be.exist")
      .find('[data-cy="isSelected-true"]')
      .should("be.exist");
  };

  // *** APPHELPERS END ***
}
