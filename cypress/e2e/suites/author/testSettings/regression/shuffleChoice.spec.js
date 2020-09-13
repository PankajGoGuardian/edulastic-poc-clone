import TeacherSideBar from "../../../../framework/author/SideBarPage";
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import AssignmentsPage from "../../../../framework/student/assignmentsPage";
import StudentTestPage from "../../../../framework/student/studentTestPage";
import FileHelper from "../../../../framework/util/fileHelper";

const questionData = require("../../../../../fixtures/questionAuthoring");

const assignmentPage = new AssignmentsPage();
const studentTest = new StudentTestPage();
const testLibrary = new TestLibrary();
const teacherSidebar = new TeacherSideBar();

const students = {
  "1": {
    email: "student.1.shufflechoice@snapwiz.com",
    stuName: "shuffleChoice, student.1"
  },
  "2": {
    email: "student.2.shufflechoice@snapwiz.com",
    stuName: "shuffleChoice, student.2"
  },
  "3": {
    email: "student.3.shufflechoice@snapwiz.com",
    stuName: "shuffleChoice, student.3"
  }
};

const { choices: originalChoiceSequence } = questionData.MCQ_MULTI.default;

const className = "Automation Class - shuffleChoice teacher.1";
const teacher = "teacher.1.shufflechoice@snapwiz.com";
const password = "snapwiz";
let testId;

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Test Settings`, () => {
  before(" > create new test set shuffle question", () => {
    cy.deleteAllAssignments(undefined, teacher, password);
    // creating test
    cy.login("teacher", teacher, password);
    testLibrary.createTest("TEST_SETTING_1").then(id => {
      testId = id;
      cy.contains("Share With Others");

      // update the settings
      testLibrary.visitTestById(testId);
      testLibrary.header.clickOnSettings();
      testLibrary.header.clickOnEditButton(true);

      // set shuffle question to ON
      testLibrary.testSettings.getShuffleChoiceButton().click();
      testLibrary.header.clickOnPublishButton();
      cy.contains("Share With Others");

      //  assign as class assessment
      testLibrary.clickOnAssign();

      testLibrary.assignPage.selectClass(className);
      testLibrary.assignPage.clickOnAssign();
      teacherSidebar.clickOnAssignment();
    });
  });

  context(` > shuffle choice on`, () => {
    beforeEach(() => studentTest.clickOnExitTest());

    Object.keys(students).forEach(stu => {
      it(` > attempt and verify choice order with -${students[stu].email}`, () => {
        const student = students[stu];
        cy.login("student", student.email, password);
        assignmentPage.clickOnAssignmentButton();
        cy.wait(1000);
        const attemptChoiceOrder = [];
        studentTest.getAllChoices().then($ele => {
          cy.wrap($ele).each($ch => attemptChoiceOrder.push($ch.text()));
        });
        cy.wait(1).then(() =>
          expect(
            attemptChoiceOrder,
            `verify choice order is not same ,original-, ${originalChoiceSequence}, ${
              student.email
            } rendered - ${attemptChoiceOrder}`
          ).to.not.eq(originalChoiceSequence)
        );
      });
    });
  });
});
