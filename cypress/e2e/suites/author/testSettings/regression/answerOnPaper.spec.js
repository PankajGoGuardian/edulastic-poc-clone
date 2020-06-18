/* eslint-disable prefer-const */
import AuthorAssignmentPage from "../../../../framework/author/assignments/AuthorAssignmentPage";
import LiveClassboardPage from "../../../../framework/author/assignments/LiveClassboardPage";
import TestAssignPage from "../../../../framework/author/tests/testDetail/testAssignPage";
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import { studentSide } from "../../../../framework/constants/assignmentStatus";
import FileHelper from "../../../../framework/util/fileHelper";

const testData = require("../../../../../fixtures/testAuthoring");

const testName = "TEST_SETTING_3";
const itemsInTest = testData[testName].itemKeys;

describe(`${FileHelper.getSpecName(Cypress.spec.name)}>> over riding test setting`, () => {
  const testLibraryPage = new TestLibrary();
  const testAssignPage = new TestAssignPage();
  const authorAssignmentPage = new AuthorAssignmentPage();
  const liveClassBoardPage = new LiveClassboardPage();

  const teacher = {
    email: "teacher.answeronpaper@automation.com"
  };

  const students = {
    1: {
      email: "student1.answeronpaper@snapwiz.com",
      name: "answeronpaper, student1"
    },
    2: {
      email: "student2.answeronpaper@snapwiz.com",
      name: "answeronpaper, student1"
    }
  };

  const password = "automation";
  const className = "answeronpaper-class";
  let testId;

  before("> login and create test", () => {
    cy.deleteAllAssignments(students[1].email, teacher.email, password);
    cy.login("teacher", teacher.email, password);
    testLibraryPage.createTest(testName, false).then(id => {
      testId = id;
      testLibraryPage.header.clickOnSettings();
      testLibraryPage.testSettings.enableAnswerOnPaper();
      testLibraryPage.header.clickOnPublishButton();
    });
  });

  context(">verify answer on paper", () => {
    it(">assign test with answer on paper", () => {
      testAssignPage.visitAssignPageById(testId);
      testAssignPage.selectClass(className);
      testAssignPage.clickOnAssign();
    });

    it(">navigate to lcb and verfy student status after closing the test", () => {
      testAssignPage.sidebar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
      liveClassBoardPage.header.clickOnClose();
      cy.wait("@assignment");
      liveClassBoardPage.getSubmitSummary().should("contain.text", `2 out of 2 Submitted`);
      liveClassBoardPage.getAllStudentStatus().each(ele => {
        cy.wrap(ele).should("contain.text", studentSide.IN_GRADING);
      });
    });

    it(">verify performance after giving the score", () => {
      liveClassBoardPage.clickonQuestionsTab();
      itemsInTest.forEach((item, i) => {
        liveClassBoardPage.questionResponsePage.selectQuestion(`Q${i + 1}`);
        liveClassBoardPage.questionResponsePage.getQuestionContainerByStudent(students[1].name).as("studentQuesCard");
        liveClassBoardPage.questionResponsePage
          .getScoreInput(cy.get("@studentQuesCard"))
          .should("have.attr", "value", ``);
        liveClassBoardPage.questionResponsePage.updateScoreAndFeedbackForStudent(students[1].name, 2);
      });

      liveClassBoardPage.clickOnCardViewTab();
      liveClassBoardPage.getStudentPerformanceByIndex(0).should("have.text", `100%`);
      liveClassBoardPage.getStudentScoreByIndex(0).should("have.text", `4 / 4`);
    });
  });
});
