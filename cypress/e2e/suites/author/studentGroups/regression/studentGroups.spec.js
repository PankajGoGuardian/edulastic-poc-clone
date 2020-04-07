/* eslint-disable cypress/no-unnecessary-waiting */
import AuthorAssignmentPage from "../../../../framework/author/assignments/AuthorAssignmentPage";
import LiveClassboardPage from "../../../../framework/author/assignments/LiveClassboardPage";
import TeacherManageClassPage from "../../../../framework/author/manageClassPage";
import ManageGroupPage from "../../../../framework/author/manageGroupPage";
import TeacherSideBar from "../../../../framework/author/SideBarPage";
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import AssignmentsPage from "../../../../framework/student/assignmentsPage";
import FileHelper from "../../../../framework/util/fileHelper";
import PerformanceByStudentReport from "../../report/performanceByStudentPage";

const { _ } = Cypress;

const sideBar = new TeacherSideBar();
const manageClass = new TeacherManageClassPage();
const pbsReport = new PerformanceByStudentReport();
const lcb = new LiveClassboardPage();
const manageGroup = new ManageGroupPage();

const authorAssignmentPage = new AuthorAssignmentPage();
const testLibrary = new TestLibrary();
const teacherSidebar = new TeacherSideBar();
const studentAssignment = new AssignmentsPage();

const students = {
  1: {
    email: "student.1.studentgroup@automation.com",
    stuName: "studentGroup, student.1"
  },
  2: {
    email: "student.2.studentgroup@automation.com",
    stuName: "studentGroup, student.2"
  },
  3: {
    email: "student.3.studentgroup@automation.com",
    stuName: "studentGroup, student.3"
  },
  4: {
    email: "student.4.studentgroup@automation.com",
    stuName: "studentGroup, student.4"
  },
  5: {
    email: "student.5.studentgroup@automation.com",
    stuName: "studentGroup, student.5"
  }
};

const groups = {
  1: {
    name: "Group1",
    description: "This is custom group 1"
  },
  2: {
    name: "Group2",
    description: "This is custom group 2"
  }
};

const teacher = "teacher.1.studentgroup@automation.com";
const password = "snapwiz";
const classNameEdit = "Automation Class - studentGroup teacher.1";
const testIdForReport = "5e8af25af51ccb00082a12a6";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Student Groups`, () => {
  before(() => {
    cy.deleteAllAssignments(undefined, teacher, password, [testIdForReport]);
    cy.login("teacher", teacher, password);
  });

  context("> create new group", () => {
    const studentGroup1 = [students[1], students[2]];
    let testId = "5e8c53790691c40007551a97";

    before("get report", () => {
      sideBar.clickOnReport();
      pbsReport.clickOnReportLink();
    });

    it("> select student from report and create group", () => {
      //selecting student 1 and 2 and creatin new group
      pbsReport.selectStudentByName(students[1].stuName);
      pbsReport.selectStudentByName(students[2].stuName);
      pbsReport.clickOnActionAddToGroup();
      pbsReport.clickOnAddNewButton();
      pbsReport.enterGroupName(groups[1].name);
      pbsReport.enterGroupDescription(groups[1].description);
      pbsReport.clickOnSaveUpdateGroup();
    });

    it("> verify group details on create group pop up", () => {
      //selecting student 1 and 2 and creatin new group
      pbsReport.clickOnActionAddToGroup();
      pbsReport.clickOnCancel(); // TODO: to be removed ,currenty popup model persist previous data UI issue
      pbsReport.selectGroup(groups[1].name);
      studentGroup1.forEach(stu => pbsReport.verifyStudentInAddedList(stu.stuName));
      pbsReport.clickOnCancelGroupCreation();
    });

    it("> verify group details on manage group", () => {
      sideBar.clickOnManageClass();
      manageGroup.clickOnGroupTab();
      manageGroup.verifyGroupRowDetails(groups[1].name, studentGroup1.length, 0);
    });

    it("> use groups to assign a test and verify teacher assignemnt/lcb", () => {
      // testLibrary.createTest().then(_id => {
      // testId = _id;
      // testLibrary.clickOnAssign();
      //TODO: to be remove and uncomment above
      cy.visit(`author/assignments/${testId}`);
      cy.wait(5000);

      testLibrary.assignPage.selectClass(groups[1].name);
      testLibrary.assignPage.clickOnAssign();
      // })

      sideBar.clickOnAssignment();
      // TODO : to be generalise below and move to page
      authorAssignmentPage.getAssignmentRowsTestById(testId).then($row => {
        cy.wrap($row)
          .find('[data-cy="class"]')
          .should("have.text", groups[1].name);

        cy.wrap($row)
          .find('[data-cy="submitted"]')
          .should("have.text", "0 of 2");
      });

      // lcb
      authorAssignmentPage.clickOnLCBbyTestId(testId);
      cy.get('[data-cy="studentName"]')
        .should("have.length", studentGroup1.length)
        .each(($ele, i) => {
          expect($ele.text()).to.eq(studentGroup1[i].stuName);
        });
    });

    it("> verify group details after assign on manage group", () => {
      sideBar.clickOnManageClass();
      manageGroup.clickOnGroupTab();
      manageGroup.verifyGroupRowDetails(groups[1].name, studentGroup1.length, 1);
    });
  });

  // TODO: edit the group from pop up and verify in all places

  // TODO: test cases from MANAGE GROUPs
});
