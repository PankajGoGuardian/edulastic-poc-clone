import FileHelper from "../../framework/util/fileHelper";
import TeacherSideBar from "../../framework/author/SideBarPage";
import TeacherManageClassPage from "../../framework/author/manageClassPage";
import TeacherDashBoardPage from "../../framework/author/teacherDashboardPage";
import Helpers from "../../framework/util/Helpers";

const sideBar = new TeacherSideBar();
const manageClass = new TeacherManageClassPage();
const dashboard = new TeacherDashBoardPage();

const random = Helpers.getRamdomString();
const user = { email: "teacher1.smoke.automation@snapwiz.com", password: "automation" };
const classDetail = {
  name: "Smoke Automation Class",
  grades: "K",
  subject: "Mathematics",
  students: 4,
  assignments: 1,
  assignmentTitle: "Smoke Test",
  asgnStatus: "IN"
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
    cy.login("teacher", user.email, user.password);
  });

  it("> verify existing class details", () => {
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
    manageClass.fillStudentDetails(username, name, user.password);
    manageClass.clickOnAddUserButton().then(() => {
      sideBar.clickOnDashboard();
      dashboard.verifyClassDetail(className, "10", subject, 1, 0);
    });
  });
});
