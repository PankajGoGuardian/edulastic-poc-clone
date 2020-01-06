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

const { choices: originalChoiceSequence } = questionData.MCQ_MULTI.default;

const className = "Regression Automation Class";
const teacher = "teacher1.regression.automation@snapwiz.com";
const password = "automation";
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
      cy.visit(`author/tests/tab/settings/id/${testId}`);
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
        let attemptChoiceOrder = [];
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
