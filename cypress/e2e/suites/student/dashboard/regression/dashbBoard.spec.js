import AssignmentsPage from "../../../../framework/student/assignmentsPage";
import FileHelper from "../../../../framework/util/fileHelper";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Test Assignment Page`, () => {
  const assignmentPage = new AssignmentsPage();
  const student = { email: "student3@automation.com", password: "automation" };
  before(() => {
    cy.clearToken();
    cy.login("student", student.email, student.password);
  });

  context(" >Active assignments in all classes", () => {
    before("All class", () => {
      assignmentPage.getclass("All classes");
    });

    it(" >TC01 All Assignments", () => {
      assignmentPage.getAllAssignments().click({ force: true });
      assignmentPage.verifyAssignmentCount("ALL");
    });

    it(" >TC02 Verify assignments in Not Started", () => {
      assignmentPage.getNotStarted().click({ force: true });
      assignmentPage.verifyAssignmentCount("NOT_STARTED");
    });

    it(" >TC03 Verify assignments In Progress", () => {
      assignmentPage.getInProgress().click({ force: true });
      assignmentPage.verifyAssignmentCount("IN_PROGRESS");
    });
  });

  context(" > Active assignments in Automation_class", () => {
    before("Automation_class", () => {
      assignmentPage.getclass("Automation_class");
    });

    it(" >TC01 Verify ALL assignments", () => {
      assignmentPage.getAllAssignments().click({ force: true });
      assignmentPage.verifyAssignmentCount("ALL");
    });

    it(" >TC02 Verify assignments in Not Started", () => {
      assignmentPage.getNotStarted().click({ force: true });
      assignmentPage.verifyAssignmentCount("NOT_STARTED");
    });

    it(" >TC03 Verify assignments In Progress", () => {
      assignmentPage.getInProgress().click({ force: true });
      assignmentPage.verifyAssignmentCount("IN_PROGRESS");
    });
  });
  context(" > Active assignments in automation_class2", () => {
    before("Automation_class2", () => {
      assignmentPage.getclass("automation_class2");
    });

    it(" >TC01 Verify ALL assignments", () => {
      assignmentPage.getAllAssignments().click({ force: true });
      assignmentPage.verifyAssignmentCount("ALL");
    });

    it(" >TC02 Verify assignments in Not Started", () => {
      assignmentPage.getNotStarted().click({ force: true });
      assignmentPage.verifyAssignmentCount("NOT_STARTED");
    });

    it(" >TC03 Verify assignments In Progress", () => {
      assignmentPage.getInProgress().click({ force: true });
      assignmentPage.verifyAssignmentCount("IN_PROGRESS");
    });
  });
});
