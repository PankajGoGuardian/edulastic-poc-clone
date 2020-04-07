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

  // *** ELEMENTS END ***

  // *** ACTIONS START ***

  clickOnGroupTab = () => cy.get('[data-cy="group"]').click();

  clickOnGroupRowByName = () => this.getClassRowByName().click();

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
