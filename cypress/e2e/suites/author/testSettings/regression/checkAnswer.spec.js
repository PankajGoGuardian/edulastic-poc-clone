/* eslint-disable cypress/no-unnecessary-waiting */
import LiveClassboardPage from "../../../../framework/author/assignments/LiveClassboardPage";
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import { attemptTypes, questionTypeKey } from "../../../../framework/constants/questionTypes";
import AssignmentsPage from "../../../../framework/student/assignmentsPage";
import StudentTestPage from "../../../../framework/student/studentTestPage";
import FileHelper from "../../../../framework/util/fileHelper";

const { TEST_SETTING } = require("../../../../../fixtures/testAuthoring");
const questionData = require("../../../../../fixtures/questionAuthoring");

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Test Settings`, () => {
  const assignmentPage = new AssignmentsPage();
  const studentTest = new StudentTestPage();
  const testLibrary = new TestLibrary();
  const lcb = new LiveClassboardPage();

  const { itemKeys } = TEST_SETTING;

  const student = "student.1.settings@snapwiz.com";
  const teacher = "teacher.1.settings@snapwiz.com";
  const password = "snapwiz";
  const className = "Automation Class - settings teacher.1";
  const checkAns = 2;
  let testId;

  const attempts = { Q1: "wrong", Q2: "wrong", Q3: "wrong" };

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
      testLibrary.testSettings.setCheckAnswer(checkAns);
      testLibrary.header.clickOnPublishButton();
      cy.contains("Share With Others");

      //  assign as class assessment
      testLibrary.clickOnAssign();

      testLibrary.assignPage.selectClass(className);
      testLibrary.assignPage.clickOnAssign();
    });
  });

  context(` > check answer set to - ${checkAns}`, () => {
    before("login as student", () => {
      cy.login("student", student, password);
      assignmentPage.clickOnAssignmentButton();
    });

    after("exit test", () => studentTest.clickOnExitTest());

    Object.keys(attempts).forEach((queNum, i) => {
      it(` > verify check ans for question - ${queNum}`, () => {
        const [queType] = questionTypeMap[queNum].queKey.split(".");
        const { attemptData, points } = questionTypeMap[queNum];

        // attempt as right
        studentTest.getQuestionByIndex(i);
        cy.wait(500); // allow questions to render

        studentTest.attemptQuestion(queType, attemptTypes.RIGHT, attemptData);
        studentTest.checkAnsValidateAsRight(points);

        // attempt as wrong
        // if multiple select , first resetting the attempt
        if (queType === questionTypeKey.MULTIPLE_CHOICE_MULTIPLE)
          cy.get("label")
            .find("input:checked")
            .each(ele => cy.wrap(ele).click({ force: true }));

        studentTest.attemptQuestion(queType, attemptTypes.WRONG, attemptData);
        studentTest.checkAnsValidateAsWrong(points);

        // check ans and verify it is exhausted
        studentTest.clickOnCheckAns(true);
      });
    });
  });
});
