/* eslint-disable prefer-const */
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import TestReviewTab from "../../../../framework/author/tests/testDetail/testReviewTab";
import TestAssignPage from "../../../../framework/author/tests/testDetail/testAssignPage";
import AssignmentsPage from "../../../../framework/student/assignmentsPage";
import StudentTestPage from "../../../../framework/student/studentTestPage";
import TestSettings from "../../../../framework/author/tests/testDetail/testSettingsPage";
import { CALCULATOR, attemptTypes } from "../../../../framework/constants/questionTypes";
import FileHelper from "../../../../framework/util/fileHelper";
import ReportsPage from "../../../../framework/student/reportsPage";
import {
  studentSide,
  releaseGradeTypesDropDown as releaseType
} from "../../../../framework/constants/assignmentStatus";
import AuthorAssignmentPage from "../../../../framework/author/assignments/AuthorAssignmentPage";
import LiveClassboardPage from "../../../../framework/author/assignments/LiveClassboardPage";

const testData = require("../../../../../fixtures/testAuthoring");

const TestName = "TEST_SETTING_OVERRIDE";
const itemsInTest = testData[TestName].itemKeys;

describe(`${FileHelper.getSpecName(Cypress.spec.name)}>> over riding test setting`, () => {
  const testLibraryPage = new TestLibrary();
  const assignmentsPage = new AssignmentsPage();
  const studentTestPage = new StudentTestPage();
  const testReviewTab = new TestReviewTab();
  const testAssignPage = new TestAssignPage();
  const testSettings = new TestSettings();
  const reportsPage = new ReportsPage();
  const authorAssignmentPage = new AuthorAssignmentPage();
  const liveClassBoardPage = new LiveClassboardPage();

  const Teacher = {
    email: "teacher.overiding@snapwiz.com",
    pass: "snapwiz"
  };
  const Student1 = {
    email: "student1.overiding@snapwiz.com",
    pass: "snapwiz",
    name: "Student1"
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
  before(">login and create new items and test", () => {
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

  context(`>over riding test settings`, () => {
    it(">edit settings from settings tab and publish", () => {
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

    it(">over ride settings from test assign page", () => {
      testLibraryPage.clickOnAssign();
      testAssignPage.showOverRideSetting();
      /* Over-ride Max-Attempt to 1 */
      testAssignPage.setMaxAttempt("1");
      /* Over-ride Release Policy To Release Score and Responses */
      testAssignPage.setReleasePolicy(releaseType.WITH_RESPONSE);
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

    it(">assign the test", () => {
      testAssignPage.selectClass("Class");
      testAssignPage.selectTestType("Class Assessment");
      // testAssignPage.clickOnEntireClass();
      testAssignPage.clickOnAssign();
    });
    context(">verifying at student side- over ridden settings", () => {
      it(">password and calculator", () => {
        cy.login("student", Student1.email, Student1.pass);

        /* Verifying Static Password */
        assignmentsPage.clickOnAssigmentByTestId(OriginalTestId, { pass: staticPassword });
        studentTestPage.clickOnCalcuator();

        /* Verifying Calculator Type */
        studentTestPage.assertCalcType(CALCULATOR.GRAPH);
      });
      it(">shuffle ques,choices and check ans button", () => {
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
      it(">release policy, evaluation and max attempts", () => {
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
    context(">verify answer on paper", () => {
      it(">assign test with answer on paper", () => {
        cy.deleteAllAssignments("", Teacher.email);
        cy.login("teacher", Teacher.email, Teacher.pass);
        testAssignPage.visitAssignPageById(OriginalTestId);
        testAssignPage.showOverRideSetting();
        testAssignPage.selectAnswerOnPaper();
        testAssignPage.selectClass("Class");
        testAssignPage.selectTestType("Class Assessment");
        // testAssignPage.clickOnEntireClass();
        testAssignPage.clickOnAssign();
      });
      it(">navigate to lcb and verfy student status after closing the test", () => {
        testAssignPage.sidebar.clickOnAssignment();
        authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
        liveClassBoardPage.header.clickOnClose();
        liveClassBoardPage.getSubmitSummary().should("contain.text", `4 out of 4 Submitted`);
        liveClassBoardPage.getAllStudentStatus().each(ele => {
          cy.wrap(ele).should("contain.text", studentSide.IN_GRADING);
        });
      });
      it(">verify performance after giving the score", () => {
        liveClassBoardPage.clickonQuestionsTab();
        itemsInTest.forEach((element, i) => {
          liveClassBoardPage.questionResponsePage.selectQuestion(`Q${i + 1}`);
          liveClassBoardPage.questionResponsePage.getQuestionContainerByStudent(Student1.name).as("studentQuesCard");
          liveClassBoardPage.questionResponsePage
            .getScoreInput(cy.get("@studentQuesCard"))
            .should("have.attr", "value", ``);
          liveClassBoardPage.questionResponsePage.updateScoreAndFeedbackForStudent(Student1.name, "2");
        });
        liveClassBoardPage.clickOnCardViewTab();
        liveClassBoardPage.getStudentPerformanceByIndex(0).should("have.text", `100%`);
        liveClassBoardPage.getStudentScoreByIndex(0).should("have.text", `4 / 4`);
      });
    });
  });
});
