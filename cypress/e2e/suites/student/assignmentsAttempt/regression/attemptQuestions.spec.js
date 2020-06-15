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
  const student = "student.1.attemptquestions@snapwiz.com";
  const teacher = "teacher.1.attemptquestions@snapwiz.com";
  const password = "snapwiz";
  const className = "Automation Class - attemptQuestions teacher.1";

  const { itemKeys } = STUDENT_ATTEMPT;
  const questionTypeMap = lcb.getQuestionTypeMap(itemKeys, questionData, {});
  before("> test creation", () => {
    cy.deleteAllAssignments(student, teacher);
    cy.login("teacher", teacher, password);
    // TODO : test creation to be enable
    // testLibrary.createTest("STUDENT_ATTEMPT").then(() => {
    // testLibrary.clickOnAssign();
  });

  context(" > Assignment attempt- class assignment", () => {
    before("create test and assign", () => {
      cy.visit("/author/assignments/5ee71329afcc8800076f0ebd");
      cy.wait(5000);
      testLibrary.assignPage.selectClass(className);
      testLibrary.assignPage.clickOnAssign();
      // });
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
          const isLastQuestion = i === itemKeys.length - 1;
          // navigate to que
          studentTestPage.getQuestionByIndex(i, true);
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
          // cy.server();
          // cy.route("POST", "**/test-item/*").as("load-question");

          studentTestPage.getQuestionByIndex(i, !isLastQuestion);
          // CypressHelper.selectDropDownByAttribute("options", `Question ${i + 1}/${itemKeys.length}`);
          /*    if (!isLastQuestion) {
            studentTestPage.clickOnSkipOnPopUp();
            cy.wait("@load-question");  
          } */
          studentTestPage.verifyQuestionResponseRetained(queType, RIGHT, attemptData);

          // navigate to question from review
          studentTestPage.getQuestionByIndex(itemKeys.length - 1);
          /*    if (!(i === itemKeys.length - 1)) {
            cy.wait("@load-question");
            studentTestPage.clickOnNext(false, true);
          } else studentTestPage.clickOnNext();
 */
          studentTestPage.clickOnNext(false, !isLastQuestion);
          studentTestPage.clickOnReviewQuestion(queNum);
          cy.contains(queNum).should("be.visible");
          studentTestPage.verifyQuestionResponseRetained(queType, RIGHT, attemptData);
        });
      });
    });
  });
});
