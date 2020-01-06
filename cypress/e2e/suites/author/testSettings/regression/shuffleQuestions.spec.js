import TeacherSideBar from "../../../../framework/author/SideBarPage";
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import { assignmentButtonsText } from "../../../../framework/constants/assignmentStatus";
import AssignmentsPage from "../../../../framework/student/assignmentsPage";
import StudentTestPage from "../../../../framework/student/studentTestPage";
import FileHelper from "../../../../framework/util/fileHelper";

const { TEST_SETTING } = require("../../../../../fixtures/testAuthoring");
const questionData = require("../../../../../fixtures/questionAuthoring");

const students = {
  1: {
    email: "student1.regression.automation@snapwiz.com",
    stuName: "1, student1"
  },
  2: {
    email: "student2.regression.automation@snapwiz.com",
    stuName: "regression, student2"
  },
  3: {
    email: "student3.regression.automation@snapwiz.com",
    stuName: "regression, student3"
  }
};

function isSequenceMatch(itemSeq, attemptSeq) {
  let matched = true;
  for (const itemKey of itemSeq) {
    if (!attemptSeq[itemSeq.indexOf(itemKey)].includes(itemKey)) {
      matched = false;
      break;
    }
  }
  return matched;
}

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Test Settings`, () => {
  const assignmentPage = new AssignmentsPage();
  const studentTest = new StudentTestPage();
  const testLibrary = new TestLibrary();
  const teacherSidebar = new TeacherSideBar();

  const { itemKeys, name: assignmentName } = TEST_SETTING;
  const asgnstatus = {
    notstarted: "NOT STARTED",
    inprogress: "IN PROGRESS",
    sub: "SUBMITTED",
    graded: "GRADED"
  };
  const { start, retake, review } = assignmentButtonsText;

  const className = "Regression Automation Class";
  const teacher = "teacher1.regression.automation@snapwiz.com";
  const password = "automation";
  let testId;

  before(" > create new test set shuffle question", () => {
    cy.deleteAllAssignments(undefined, teacher, password);
    // creating test
    cy.login("teacher", teacher, password);
    testLibrary.createTest("TEST_SETTING").then(id => {
      testId = id;
      cy.contains("Share With Others");

      // update the settings
      cy.visit(`author/tests/tab/settings/id/${testId}`);
      testLibrary.header.clickOnEditButton(true);

      // set shuffle question to ON
      testLibrary.testSettings.getShuffleQuestionButton().click();
      testLibrary.header.clickOnPublishButton();
      cy.contains("Share With Others");

      //  assign as class assessment
      testLibrary.clickOnAssign();

      testLibrary.assignPage.selectClass(className);
      testLibrary.assignPage.clickOnAssign();
      teacherSidebar.clickOnAssignment();
    });
  });

  context(` > shuffle questions on`, () => {
    let originalSequence = itemKeys;
    let student1Sequence = [];
    let student2Sequence = [];
    let student3Sequence = [];

    beforeEach(() => studentTest.clickOnExitTest());

    it(` > attempt with -  ${students[1].email}`, () => {
      cy.login("student", students[1].email, password);
      assignmentPage.validateAssignment(assignmentName, asgnstatus.notstarted, start);
      assignmentPage.clickOnAssignmentButton();

      Object.keys(itemKeys).forEach(que => {
        cy.wait(1000);
        studentTest.getQuestionText().then(queText => student1Sequence.push(queText.text()));
        studentTest.clickOnNext();
      });

      studentTest.submitTest().then(() => {
        expect(isSequenceMatch(originalSequence, student1Sequence), "verify question seq is not same").to.eq(false);
      });
    });

    it(` > attempt with -  ${students[2].email}`, () => {
      cy.login("student", students[2].email, password);
      assignmentPage.validateAssignment(assignmentName, asgnstatus.notstarted, start);
      assignmentPage.clickOnAssignmentButton();

      Object.keys(itemKeys).forEach(que => {
        cy.wait(1000);
        studentTest.getQuestionText().then(queText => student2Sequence.push(queText.text()));
        studentTest.clickOnNext();
      });

      studentTest.submitTest().then(() => {
        expect(isSequenceMatch(originalSequence, student2Sequence), "verify question seq is not same").to.eq(false);
      });
    });

    it(` > attempt with -  ${students[3].email}`, () => {
      cy.login("student", students[3].email, password);
      assignmentPage.validateAssignment(assignmentName, asgnstatus.notstarted, start);
      assignmentPage.clickOnAssignmentButton();

      Object.keys(itemKeys).forEach(que => {
        cy.wait(1000);
        studentTest.getQuestionText().then(queText => student3Sequence.push(queText.text()));
        studentTest.clickOnNext();
      });

      studentTest.submitTest().then(() => {
        expect(isSequenceMatch(originalSequence, student3Sequence), "verify question seq is not same").to.eq(false);
      });
    });
  });
});
