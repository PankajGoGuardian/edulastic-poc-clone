import LiveClassboardPage from "../../../../framework/author/assignments/LiveClassboardPage";
import TeacherSideBar from "../../../../framework/author/SideBarPage";
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import { assignmentButtonsText } from "../../../../framework/constants/assignmentStatus";
import AssignmentsPage from "../../../../framework/student/assignmentsPage";
import ReportsPage from "../../../../framework/student/reportsPage";
import SidebarPage from "../../../../framework/student/sidebarPage";
import StudentTestPage from "../../../../framework/student/studentTestPage";
import FileHelper from "../../../../framework/util/fileHelper";

const { TEST_SETTING } = require("../../../../../fixtures/testAuthoring");
const questionData = require("../../../../../fixtures/questionAuthoring");

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Test Settings`, () => {
  const sideBarPage = new SidebarPage();
  const assignmentPage = new AssignmentsPage();
  const studentTest = new StudentTestPage();
  const testLibrary = new TestLibrary();
  const teacherSidebar = new TeacherSideBar();
  const lcb = new LiveClassboardPage();
  const gradesPage = new ReportsPage();

  const { itemKeys, name: assignmentName } = TEST_SETTING;
  const asgnstatus = {
    notstarted: "NOT STARTED",
    inprogress: "IN PROGRESS",
    sub: "SUBMITTED",
    graded: "GRADED"
  };
  const { start, retake, review } = assignmentButtonsText;

  const student = "student1.t2.automation@snapwiz.com";
  const teacher = "teacher2.regression.automation@snapwiz.com";
  const password = "snapwiz";
  const className = "Automation Class Teacher 2";
  const maxAttempt = 3;
  let testId;

  const attempt1 = { Q1: "wrong", Q2: "wrong", Q3: "wrong" };
  const attempt2 = { Q1: "right", Q2: "wrong", Q3: "right" };
  const attempt3 = { Q1: "right", Q2: "right", Q3: "right" };

  const questionTypeMap = lcb.getQuestionTypeMap(itemKeys, questionData, {});

  before(" > create new test set max attempt", () => {
    cy.login("teacher", teacher, password);
    // creating test
    cy.deleteAllAssignments(student, teacher, password);
    testLibrary.createTest("TEST_SETTING").then(id => {
      testId = id;
      cy.contains("Share With Others");

      // update the settings
      cy.visit(`author/tests/tab/settings/id/${testId}`);
      testLibrary.header.clickOnEditButton(true);
      // set max attempt
      testLibrary.testSettings.setMaxAttempt(maxAttempt);
      testLibrary.header.clickOnPublishButton();
      cy.contains("Share With Others");

      //  assign as class assessment
      testLibrary.clickOnAssign();

      testLibrary.assignPage.selectClass(className);
      testLibrary.assignPage.clickOnAssign();
      teacherSidebar.clickOnAssignment();
    });
  });

  context(` > max attempt set to - ${maxAttempt}`, () => {
    before("login as student", () => cy.login("student", student, password));

    beforeEach(() => studentTest.clickOnExitTest());

    it(" > 1st attempt", () => {
      assignmentPage.validateAssignment(assignmentName, asgnstatus.notstarted, start);
      assignmentPage.clickOnAssignmentButton();

      Object.keys(attempt1).forEach(queNum => {
        const [queType] = questionTypeMap[queNum].queKey.split(".");
        const { attemptData } = questionTypeMap[queNum];
        studentTest.attemptQuestion(queType, attempt1[queNum], attemptData);
        studentTest.clickOnNext();
      });
      studentTest.submitTest();

      // validate stats
      assignmentPage.validateAssignment(assignmentName, asgnstatus.inprogress, retake);
      gradesPage.validateStats(1, "1/3", undefined, undefined);
    });

    it(" > 2nd attempt", () => {
      assignmentPage.clickOnAssignmentButton();

      Object.keys(attempt2).forEach(queNum => {
        const [queType] = questionTypeMap[queNum].queKey.split(".");
        const { attemptData } = questionTypeMap[queNum];
        studentTest.attemptQuestion(queType, attempt2[queNum], attemptData);
        studentTest.clickOnNext();
      });
      studentTest.submitTest();

      sideBarPage.clickOnAssignment();

      // validate stats
      assignmentPage.validateAssignment(assignmentName, asgnstatus.inprogress, retake);
      gradesPage.validateStats(2, "2/3", undefined, undefined);
    });

    it(" > 3rd attempt", () => {
      assignmentPage.clickOnAssignmentButton();

      Object.keys(attempt3).forEach(queNum => {
        const [queType] = questionTypeMap[queNum].queKey.split(".");
        const { attemptData } = questionTypeMap[queNum];
        studentTest.attemptQuestion(queType, attempt3[queNum], attemptData);
        studentTest.clickOnNext();
      });
      studentTest.submitTest();

      // grades page
      sideBarPage.clickOnGrades();

      // validate stats
      gradesPage.validateAssignment(assignmentName, asgnstatus.graded, review);
      gradesPage.validateStats(3, "3/3", undefined, 100);
      gradesPage.validateAttemptLinkStats(3, 1, undefined, 0);
      gradesPage.validateAttemptLinkStats(3, 2, undefined, 67);
    });
  });
});
