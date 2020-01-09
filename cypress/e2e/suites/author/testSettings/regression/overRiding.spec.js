/* eslint-disable prefer-const */
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import TestReviewTab from "../../../../framework/author/tests/testDetail/testReviewTab";
import TestAssignPage from "../../../../framework/author/tests/testDetail/testAssignPage";
import AssignmentsPage from "../../../../framework/student/assignmentsPage";
import StudentTestPage from "../../../../framework/student/studentTestPage";
import TestSettings from "../../../../framework/author/tests/testDetail/testSetting";
import { CALCULATOR, attemptTypes } from "../../../../framework/constants/questionTypes";
import FileHelper from "../../../../framework/util/fileHelper";
import ReportsPage from "../../../../framework/student/reportsPage";

const testData = require("../../../../../fixtures/testAuthoring");

const TestName = "TEST_SETTING_OVERRIDE";
const itemsInTest = testData[TestName].itemKeys;

describe(`${FileHelper.getSpecName(Cypress.spec.name)}>> Over Riding Test Setting`, () => {
  const testLibraryPage = new TestLibrary();
  const assignmentsPage = new AssignmentsPage();
  const studentTestPage = new StudentTestPage();
  const testReviewTab = new TestReviewTab();
  const testAssignPage = new TestAssignPage();
  const testSettings = new TestSettings();
  const reportsPage = new ReportsPage();

  const Teacher = {
    email: "300@abc.com",
    pass: "snapwiz"
  };
  const Student1 = {
    email: "300@xyz.com",
    pass: "snapwiz"
  };
  const staticPassword = "123546";
  let OriginalTestId;
  let qType = [];
  let num;
  let quesText = [];
  let choice = [];
  let quesType = [];
  let attempt = [];
  const evalMethods = ["ALL_OR_NOTHING", "PARTIAL_CREDIT", "PENALIZE"];
  before("login and create new items and test", () => {
    cy.deleteAllAssignments(Student1.email, Teacher.email);
    cy.login("teacher", Teacher.email, Teacher.pass);
    testLibraryPage.createTest(TestName, false).then(id => {
      OriginalTestId = id;
    });
    cy.fixture("questionAuthoring").then(quesData => {
      itemsInTest.forEach(element => {
        [qType, num] = element.split(".");
        quesType.push(qType);
        quesText.push(quesData[qType][num].quetext);
        choice.push(quesData[qType][num].choices);
        attempt.push(quesData[qType][num].attemptData);
      });
    });
  });

  context(`Over Riding Test Settings`, () => {
    it("Edit Settings From Settings Tab And Publish", () => {
      /* Editing Settings At Test Level */
      testReviewTab.testheader.clickOnSettings();
      /* Set Max Attempts to 3 */
      testSettings.setMaxAttempt("3");
      /* Set Dont Release Response And Score Policy */
      testSettings.selectDontReleaseScoreResponse();
      /* Set Shuffle Questions And Choices */
      testSettings.clickOnShuffleChoices();
      testSettings.clickOnShuffleQuestions();
      /* Use Scientific Calculator */
      testSettings.clickOnCalculatorByType(CALCULATOR.SCIENTIFIC);
      /* Set Dynamic Password */
      testSettings.clickOnPassword();
      testSettings.clickOnDynamicPassword();
      /* Set Check Ans Tries To 3 */
      testSettings.setCheckAnswer("3");
      /* Set evaluation to Partial */
      testSettings.clickOnEvalByType(evalMethods[1]);
      testSettings.header.clickOnSaveButton(true);
      testSettings.header.clickOnPublishButton();
      cy.contains("Share With Others");
    });

    it("Over Ride Settings From Test Assign Page", () => {
      testLibraryPage.clickOnAssign();
      testAssignPage.showOverRideSetting();
      /* Over-ride Max-Attempt to 1 */
      testAssignPage.setMaxAttempt("1");
      /* Over-ride Release Policy To Release Score and Responses */
      testAssignPage.setReleaseScoreAndResponse();
      /* De-Select the Shuffle questions and choices */
      testAssignPage.deselectShuffleChoices();
      testAssignPage.deselectShuffleQuestions();
      /* Over-ride Calculator Type To Graph  */
      testAssignPage.clickOnCalculatorByType(CALCULATOR.GRAPH);
      /* Over-ride Password Policy To Static */
      testAssignPage.clickOnStaticPassword();
      testAssignPage.enterStaticPassword(staticPassword);
      /* Over-ride Check Ans Tries To 0 */
      testAssignPage.setCheckAnsTries("0");
      /* Over-ride Evaluation Method To All Or Nothing */
      testAssignPage.clickOnEvalByType(evalMethods[0]);
    });

    it("Assign The Test", () => {
      testAssignPage.selectClass("Class");
      testAssignPage.selectTestType("Class Assessment");
      testAssignPage.clickOnEntireClass();
      testAssignPage.clickOnAssign();
    });
    context("Verifying At Student Side- Over Ridden settings", () => {
      it("Password And Calculator", () => {
        cy.login("student", Student1.email, Student1.pass);

        /* Verifying Static Password */
        assignmentsPage.clickOnAssigmentByTestId(OriginalTestId, staticPassword);
        studentTestPage.clickOnCalcuator();

        /* Verifying Calculator Type */
        studentTestPage.assertCalcType(CALCULATOR.GRAPH);
      });
      it("Shuffle Ques,Choices And Check Ans Button", () => {
        /* Verifying No Shuffle Questions */
        itemsInTest.forEach((item, ind) => {
          studentTestPage.getQuestionText().should("contain", quesText[ind]);

          /* Verifying No Shuffle Choices */
          let attemptChoiceOrder = [];
          studentTestPage.getAllChoices().then($ele => {
            cy.wrap($ele).each($ch => attemptChoiceOrder.push($ch.text()));
          });
          cy.wait(1).then(() =>
            attemptChoiceOrder.forEach((ele, index) => {
              expect(ele).to.eq(choice[ind][index]);
            })
          );
          /* Verifying No Check Ans */
          studentTestPage.getCheckAns().should("not.exist");
          studentTestPage.attemptQuestion(quesType[ind], attemptTypes.PARTIAL_CORRECT, attempt[ind]);
          studentTestPage.clickOnNext();
        });

        studentTestPage.submitTest();
      });
      it("Release Policy, Evaluation And Max Attempts", () => {
        /* Verifying Release Score Policy */
        assignmentsPage.reviewSubmittedTestById(OriginalTestId);

        /* Verifying Over-Ridden Evaluation Method */
        itemsInTest.forEach((item, ind) => {
          reportsPage.selectQuestion(`Q${ind + 1}`);
          reportsPage.getScore().should("have.text", "0");
        });

        /* Verifying Max Attempts */
        reportsPage.sidebar.clickOnAssignment();
        cy.contains("Assignments");
        assignmentsPage.verifyAbsenceOfTest(OriginalTestId);
      });
    });
  });
});
