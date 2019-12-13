import FileHelper from "../../../../framework/util/fileHelper";
import TeacherSideBar from "../../../../framework/author/SideBarPage";
import TeacherManageClassPage from "../../../../framework/author/manageClassPage";
import TeacherDashBoardPage from "../../../../framework/author/teacherDashboardPage";
import Helpers from "../../../../framework/util/Helpers";
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";

const sideBar = new TeacherSideBar();
const manageClass = new TeacherManageClassPage();
const dashboard = new TeacherDashBoardPage();
const testLibrary = new TestLibrary();

const random = Helpers.getRamdomString();
const teacher = { email: "teacher1.smoke.automation@snapwiz.com", password: "automation" };
const student = { email: "teacher1.smoke.automation@snapwiz.com", password: "automation" };
const classDetail = {
  name: "Smoke Automation Class",
  grades: "K",
  subject: "Mathematics",
  students: 4,
  assignments: 1,
  assignmentTitle: "Default Test Automation",
  asgnStatus: "IN PROGRESS"
};

const create = {
  className: `smoke create new class-${random}`,
  grade: "Grade 10",
  subject: "Mathematics",
  standardSet: "Math - Common Core"
};

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Dashboard`, () => {
  before(() => {
    cy.clearToken();
    cy.deleteAllAssignments(student.email, teacher.email, teacher.password);
    cy.login("teacher", teacher.email, teacher.password);
  });

  it("> verify existing CLASS details", () => {
    dashboard.verifyClassDetail(classDetail.name, classDetail.grades, classDetail.subject, classDetail.students);
  });

  it("> create new class and verify new class details on dashboard", () => {
    const { className, grade, subject, standardSet } = create;
    const name = `smokeaddstudent ${random}`;
    const username = Helpers.getRamdomEmail();
    sideBar.clickOnManageClass();
    manageClass.clickOnCreateClass();
    manageClass.fillClassDetails(className, undefined, undefined, grade, subject, standardSet);
    manageClass.clickOnSaveClass();

    sideBar.clickOnManageClass();
    manageClass.getClassDetailsByName(className);
    manageClass.clickOnAddStudent();
    manageClass.fillStudentDetails(username, name, teacher.password);
    manageClass.clickOnAddUserButton().then(() => {
      sideBar.clickOnDashboard();
      dashboard.verifyClassDetail(className, "10", subject, 1, 0);
    });
  });

  it("> verify recent assignment details on dashboard", () => {
    // remove old assignment if any
    cy.deleteAllAssignments(student.email, teacher.email, teacher.password);
    // create and assigne new assignment
    testLibrary.createTest().then(() => {
      testLibrary.clickOnAssign();
      testLibrary.assignPage.selectClass(classDetail.name);
      testLibrary.assignPage.clickOnAssign();
    });

    cy.login("teacher", teacher.email, teacher.password);
    dashboard.verifyClassDetail(
      classDetail.name,
      classDetail.grades,
      classDetail.subject,
      classDetail.students,
      classDetail.assignments,
      classDetail.assignmentTitle,
      classDetail.asgnStatus
    );
  });

  it("> verify dashboard after removing assignment", () => {
    // remove old assignment if any
    cy.deleteAllAssignments(student.email, teacher.email, teacher.password);
    cy.login("teacher", teacher.email, teacher.password);
    dashboard.verifyClassDetail(classDetail.name, classDetail.grades, classDetail.subject, classDetail.students);
  });

  it("> navigation to manage class by using 'Manage Class' button", () => {
    cy.login("teacher", teacher.email, teacher.password);
    dashboard.clickOnManageClass();
    cy.url().should("contain", "author/manageClass", "verify after clicking on manage class url is updated");
  });
});
