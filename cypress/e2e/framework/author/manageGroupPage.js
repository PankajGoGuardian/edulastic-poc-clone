import CypressHelper from "../util/cypressHelpers";
import TeacherSideBar from "./SideBarPage";
import TeacherManageClassPage from "./manageClassPage";

export default class ManageGroupPage extends TeacherManageClassPage {
  // *** ELEMENTS START ***
  getGroupRowDetails = groupName =>
    this.getClassRowByName(groupName)
      .find("td")
      .then($ele => {
        const name = $ele.eq(0).text();
        const students = $ele.eq(1).text();
        const assignments = $ele.eq(2).text();
        return { name, students, assignments };
      });

  removeStudentButton = () => cy.get(".ant-dropdown-menu-item").contains("Remove Student");

  getStudentRow = email => cy.get(`[data-row-key="${email}"]`);

  // *** ELEMENTS END ***

  // *** ACTIONS START ***

  clickOnGroupTab = () => cy.get('[data-cy="group"]').click();

  clickOnGroupRowByName = groupname => this.getClassRowByName(groupname).click();

  clickOnCreateGroupButton = () => cy.get('[data-cy="createClass"]').click();

  clickOnActionButton = email =>
    cy
      .get(`[data-row-key="${email}"]`)
      .contains("ACTIONS")
      .click();

  clickonRemoveStudentButton = () => this.removeStudentButton().click();

  clickOnRemoveStudentPopupTextbox = () => cy.get('[class *= "ant-input styled"]').click();

  clickOnRemoveButtonInPopUp = () =>
    cy
      .get(".ant-modal-footer")
      .contains("span", "Yes, Remove Student(s)")
      .click({ force: true });

  // *** ACTIONS END ***

  // *** APPHELPERS START ***

  verifyGroupRowDetails = (groupName, studentCount, assignmentCount) => {
    this.getGroupRowDetails(groupName).then(({ name, students, assignments }) => {
      expect(name, "verify groupName on manage group tab").to.eq(groupName);
      expect(students, "verify studentcount on manage group tab").to.eq(`${studentCount}`);
      expect(assignments, "verify assignment count on manage group tab").to.eq(`${assignmentCount}`);
    });
  };

  // *** APPHELPERS END ***
}
