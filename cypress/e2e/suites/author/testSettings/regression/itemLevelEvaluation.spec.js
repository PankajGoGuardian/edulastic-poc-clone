import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import TestReviewTab from "../../../../framework/author/tests/testDetail/testReviewTab";
import TestAssignPage from "../../../../framework/author/tests/testDetail/testAssignPage";
import AssignmentsPage from "../../../../framework/student/assignmentsPage";
import StudentTestPage from "../../../../framework/student/studentTestPage";
import TestSettings from "../../../../framework/author/tests/testDetail/testSettingsPage";
import { attemptTypes } from "../../../../framework/constants/questionTypes";
import FileHelper from "../../../../framework/util/fileHelper";
import ReportsPage from "../../../../framework/student/reportsPage";

const testData = require("../../../../../fixtures/testAuthoring");

const TestName = "TEST_SETTING_ItemLevelEvaluation";
const itemsInTest = testData[TestName].itemKeys;

describe(`${FileHelper.getSpecName(Cypress.spec.name)}>> Test Setting-Item Level Evaluation`, () => {
  const testLibraryPage = new TestLibrary();
  const assignmentsPage = new AssignmentsPage();
  const studentTestPage = new StudentTestPage();
  const testReviewTab = new TestReviewTab();
  const testAssignPage = new TestAssignPage();
  const testSettings = new TestSettings();
  const reportsPage = new ReportsPage();

  const Teacher = {
    email: "teacher.itemlevelevaluation@automation.com",
    pass: "automation"
  };
  const Student = {
    email: "student.itemlevelevaluation@automation.com",
    pass: "automation"
  };

  const questionType = [];
  const attempt = [];
  const evalMethod = "ITEM_LEVEL_EVALUATION";

  let qType;
  let num;
  let OriginalTestId;
  let testVersionId;
  const points = [1, 1, 0.5];

  before("login and create new items and test", () => {
    cy.deleteAllAssignments(Student.email, Teacher.email, Teacher.pass);
    cy.login("teacher", Teacher.email, Teacher.pass);
    testLibraryPage.createTest(TestName).then(id => {
      OriginalTestId = id;
    });

    cy.fixture("questionAuthoring").then(quesData => {
      itemsInTest.forEach(element => {
        [qType, num] = element.split(".");
        questionType.push(qType);
        attempt.push(quesData[qType][num].attemptData);
      });
    });
  });

  context(`>Over riding test settings - Set evaluation Method and assign`, () => {
    before(">Set Evaluation Method", () => {
      testLibraryPage.clickOnAssign();
      testAssignPage.showOverRideSetting();
      testAssignPage.clickOnEvalByType(evalMethod);

      testAssignPage.selectClass("Item Level Evaluation Class");
      testAssignPage.selectTestType("Class Assessment");
      testAssignPage.clickOnEntireClass();
      testAssignPage.clickOnAssign();
    });

    it(">verify student attempt", () => {
      cy.login("student", Student.email, Student.pass);
      assignmentsPage.clickOnAssigmentByTestId(OriginalTestId);
      studentTestPage.attemptQuestion(questionType[0], attemptTypes.RIGHT, attempt[0]);
      studentTestPage.clickOnNext();
      studentTestPage.attemptQuestion(questionType[1], attemptTypes.PARTIAL_CORRECT, attempt[1]);
      studentTestPage.clickOnNext();
      studentTestPage.attemptQuestion(questionType[2], attemptTypes.PARTIAL_CORRECT, attempt[2]);
      studentTestPage.clickOnNext();
      studentTestPage.submitTest();
    });
    it(">verify Student Score", () => {
      assignmentsPage.reviewSubmittedTestById(OriginalTestId);
      itemsInTest.forEach((item, ind) => {
        reportsPage.selectQuestion(`Q${ind + 1}`);
        reportsPage.getScore().should("contain.text", points[ind]);
      });
    });
  });

  context(`>Test settings -set evaluation Method and assign`, () => {
    before(">Set Evaluation Method", () => {
      cy.deleteAllAssignments(Student.email, Teacher.email, Teacher.pass);
      cy.login("teacher", Teacher.email, Teacher.pass);
      testLibraryPage.seachTestAndGotoReviewById(OriginalTestId);
      testLibraryPage.publishedToDraftAssigned();
      testLibraryPage.getVersionedTestID().then(newTestId => {
        testVersionId = newTestId;
      });
      testLibraryPage.header.clickOnSettings();

      testSettings.clickOnEvalByType(evalMethod);
      testLibraryPage.header.clickOnAssign();

      testAssignPage.selectClass("Item Level Evaluation Class");
      testAssignPage.selectTestType("Class Assessment");
      testAssignPage.clickOnEntireClass();
      testAssignPage.clickOnAssign();
    });

    it(">verify student attempt", () => {
      cy.login("student", Student.email, Student.pass);
      assignmentsPage.clickOnAssigmentByTestId(testVersionId);
      studentTestPage.attemptQuestion(questionType[0], attemptTypes.RIGHT, attempt[0]);
      studentTestPage.clickOnNext();
      studentTestPage.attemptQuestion(questionType[1], attemptTypes.PARTIAL_CORRECT, attempt[1]);
      studentTestPage.clickOnNext();
      studentTestPage.attemptQuestion(questionType[2], attemptTypes.PARTIAL_CORRECT, attempt[2]);
      studentTestPage.clickOnNext();
      studentTestPage.submitTest();
    });
    it(">verify Student Score", () => {
      assignmentsPage.reviewSubmittedTestById(testVersionId);
      itemsInTest.forEach((item, ind) => {
        reportsPage.selectQuestion(`Q${ind + 1}`);
        reportsPage.getScore().should("contain.text", points[ind]);
      });
    });
  });
});
