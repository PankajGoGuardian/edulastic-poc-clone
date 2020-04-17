import CypressHelper from "../../util/cypressHelpers";
import TeacherSideBar from "../SideBarPage";
import TeacherManageClassPage from "../manageClassPage";

export default class ManageGroupPage extends TeacherManageClassPage {
  // *** ELEMENTS START ***

  getDescription = () => cy.get("#description");

  getGroupRowDetails = groupName =>
    this.getClassRowByName(groupName)
      .find("td")
      .then($ele => {
        const name = $ele.eq(0).text();
        const students = $ele.eq(1).text();
        const assignments = $ele.eq(2).text();
        return { name, students, assignments };
      });

  getStudentRow = email => cy.get(`[data-row-key="${email}"]`);

  // *** ELEMENTS END ***

  // *** ACTIONS START ***

  clickOnGroupTab = () => cy.get('[data-cy="group"]').click();

  clickOnClassTab = () => cy.get('[data-cy="class"]').click();

  clickOnGroupRowByName = groupname => this.getClassRowByName(groupname).click();

  clickOnCreateGroupButton = () => cy.get('[data-cy="createClass"]').click();

  setDescription = description =>
    this.getDescription()
      .clear()
      .type(description);

  fillGroupDetail({ name, description, grade, subject }) {
    this.setName(name);
    if (description) {
      this.setDescription(description);
    }
    if (grade) {
      this.selectGrade(grade);
    }
    if (subject) {
      this.selectSubject(subject);
    }
  }

  clickOnSaveGroup = () => this.clickOnSaveClass(true);

  verifyGroupDetails({ name, description, grade, subject }) {
    if (name) {
      this.getClassName().should("have.value", name);
    }
    if (description) {
      this.getDescription().should("have.value", description);
    }
    if (grade) {
      this.verifyGrade(grade);
    }
    if (subject) {
      this.verifySubject(subject);
    }
  }
  // *** ACTIONS END ***

  // *** APPHELPERS START ***

  verifyGroupRowDetails = (groupName, studentCount, assignmentCount) => {
    this.getGroupRowDetails(groupName).then(({ name, students, assignments }) => {
      expect(name, "verify groupName on manage group tab").to.eq(groupName);
      expect(students, "verify studentcount on manage group tab").to.eq(`${studentCount}`);
      if (assignmentCount)
        expect(assignments, "verify assignment count on manage group tab").to.eq(`${assignmentCount}`);
    });
  };

  // *** APPHELPERS END ***
}
