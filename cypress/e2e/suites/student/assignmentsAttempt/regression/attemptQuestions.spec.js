import LiveClassboardPage from "../../../../framework/author/assignments/LiveClassboardPage";
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import { attemptTypes } from "../../../../framework/constants/questionTypes";
import AssignmentsPage from "../../../../framework/student/assignmentsPage";
import StudentTestPage from "../../../../framework/student/studentTestPage";
import CypressHelper from "../../../../framework/util/cypressHelpers";
import FileHelper from "../../../../framework/util/fileHelper";

const questionData = require("../../../../../fixtures/questionAuthoring");
const { STUDENT_ATTEMPT } = require("../../../../../fixtures/testAuthoring");

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Attempt Questions`, () => {
  const assignmentPage = new AssignmentsPage();
  const testLibrary = new TestLibrary();
  const studentTestPage = new StudentTestPage();
  const lcb = new LiveClassboardPage();

  const { RIGHT } = attemptTypes;
  const student = "student1.t2.automation@snapwiz.com";
  const teacher = "teacher2.regression.automation@snapwiz.com";
  const password = "snapwiz";
  const className = "Automation Class Teacher 2";

  const { itemKeys } = STUDENT_ATTEMPT;
  const questionTypeMap = lcb.getQuestionTypeMap(itemKeys, questionData, {});

  context(" > Assignment attempt", () => {
    before("create test and assign", () => {
      cy.deleteAllAssignments(student, teacher);
      cy.login("teacher", teacher, password);
      testLibrary.createTest("STUDENT_ATTEMPT").then(() => {
        testLibrary.clickOnAssign();
        testLibrary.assignPage.selectClass(className);
        testLibrary.assignPage.clickOnAssign();
      });
    });

    context(" > attempt,exit,review question navigation by student", () => {
      before("login as student", () => {
        cy.login("student", student, password);
      });

      beforeEach(() => {
        studentTestPage.clickOnExitTest();
        assignmentPage.clickOnAssignmentButton();
      });

      Object.keys(questionTypeMap).forEach((que, i) => {
        it(` > Attempt ${que} - ${itemKeys[i]} `, () => {
          const queNum = que;
          // navigate to que
          CypressHelper.selectDropDownByAttribute("options", `Question ${i + 1}/ ${itemKeys.length}`);
          cy.contains(queNum).should("be.visible");
          const [queType] = questionTypeMap[queNum].queKey.split(".");
          const { attemptData } = questionTypeMap[queNum];
          // attempt que
          studentTestPage.attemptQuestion(queType, RIGHT, attemptData);
          // verify response
          studentTestPage.verifyQuestionResponseRetained(queType, RIGHT, attemptData);
          studentTestPage.clickOnExitTest();

          // verify response retained after exit
          assignmentPage.clickOnAssignmentButton();
          CypressHelper.selectDropDownByAttribute("options", `Question ${i + 1}/ ${itemKeys.length}`);
          studentTestPage.verifyQuestionResponseRetained(queType, RIGHT, attemptData);

          // navigate to question from review
          studentTestPage.getQuestionByIndex(itemKeys.length - 1);
          studentTestPage.clickOnNext();
          studentTestPage.clickOnReviewQuestion(queNum);
          cy.contains(queNum).should("be.visible");
          studentTestPage.verifyQuestionResponseRetained(queType, RIGHT, attemptData);
        });
      });
    });
  });
});
