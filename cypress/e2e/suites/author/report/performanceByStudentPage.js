import CypressHelper from "../../../framework/util/cypressHelpers";
import ManageGroupPage from "../../../framework/author/groups/manageGroupPage";
import GroupPopup from "../../../framework/author/groups/groupPopup";

export default class PerformanceByStudentReport {
  constructor() {
    this.groupPopup = new GroupPopup();
  }

  // *** ELEMENTS START ***

  getCheckBoxByStudentName = studentName =>
    cy
      .get(".ant-table-row-level-0")
      .contains("tr", studentName)
      .find('input[type="checkbox"]');

  getActionButton = () => cy.get('[data-cy="actions"]');

  getGroupSelect = () => cy.get('[data-cy="selectStudentGroup"]');

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

  // *** ACTIONS END ***

  // *** APPHELPERS START ***
  // *** APPHELPERS END ***
}
