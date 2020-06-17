import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import TestReviewTab from "../../../../framework/author/tests/testDetail/testReviewTab";
import TestAssignPage from "../../../../framework/author/tests/testDetail/testAssignPage";
import AssignmentsPage from "../../../../framework/student/assignmentsPage";
import StudentTestPage from "../../../../framework/student/studentTestPage";
import TestSettings from "../../../../framework/author/tests/testDetail/testSettingsPage";
import { attemptTypes } from "../../../../framework/constants/questionTypes";
import FileHelper from "../../../../framework/util/fileHelper";
import ReportsPage from "../../../../framework/student/reportsPage";
import { releaseGradeTypes } from "../../../../framework/constants/assignmentStatus";

const testData = require("../../../../../fixtures/testAuthoring");

const TestName = "TEST_SETTING_2";

const itemsInTest = testData[TestName].itemKeys;

describe(`${FileHelper.getSpecName(Cypress.spec.name)}>> Test Setting-Evaluation Methods`, () => {
  const testLibraryPage = new TestLibrary();
  const assignmentsPage = new AssignmentsPage();
  const studentTestPage = new StudentTestPage();
  const testReviewTab = new TestReviewTab();
  const testAssignPage = new TestAssignPage();
  const testSettings = new TestSettings();
  const reportsPage = new ReportsPage();

  const Teacher = {
    email: "teacher.eval.methods@snapwiz.com",
    pass: "snapwiz"
  };
  const Student1 = {
    email: "student1.eval.methods@snapwiz.com",
    pass: "snapwiz"
  };
  const questionType = [];
  const attempt = [];
  const evalMethods = ["ALL_OR_NOTHING", "PARTIAL_CREDIT_IGNORE_INCORRECT", "PARTIAL_CREDIT"];
  const points = [[0, 0], [1, 1], [0, 0]];
  const totalPoints = [];

  let qType;
  let num;
  let OriginalTestId;

  before("login and create new items and test", () => {
    cy.deleteAllAssignments(Student1.email, Teacher.email);
    cy.login("teacher", Teacher.email, Teacher.pass);
    testLibraryPage.createTest(TestName, false).then(id => {
      OriginalTestId = id;
      testLibraryPage.header.clickOnSettings();
      testLibraryPage.testSettings.setRealeasePolicy(releaseGradeTypes.WITH_ANSWERS);
      testLibraryPage.header.clickOnPublishButton();
    });

    cy.fixture("questionAuthoring").then(quesData => {
      itemsInTest.forEach(element => {
        [qType, num] = element.split(".");
        questionType.push(qType);
        totalPoints.push(quesData[qType][num].setAns.points);
        attempt.push(quesData[qType][num].attemptData);
      });
    });
  });
  evalMethods.forEach((method, index) => {
    context(`${method}`, () => {
      before(`Edit Settings`, () => {
        cy.deleteAllAssignments(Student1.email, Teacher.email);
        cy.login("teacher", Teacher.email, Teacher.pass);
        testLibraryPage.sidebar.clickOnTestLibrary();
        testLibraryPage.searchFilters.clearAll();
        testLibraryPage.searchFilters.getAuthoredByMe();
        testLibraryPage.clickOnTestCardById(OriginalTestId);
        testLibraryPage.clickOnDetailsOfCard();
        if (index === 0) testLibraryPage.publishedToDraft();
        else {
          testLibraryPage.publishedToDraftAssigned();
          testLibraryPage.getVersionedTestID().then(id => {
            OriginalTestId = id;
          });
        }
        testReviewTab.testheader.clickOnSettings();
        testSettings.clickOnEvalByType(method);
        testSettings.header.clickOnSaveButton(true);
        testSettings.header.clickOnPublishButton();
        testLibraryPage.clickOnAssign();
        testAssignPage.selectClass("Class");
        testAssignPage.selectTestType("Class Assessment");
        //  testAssignPage.clickOnEntireClass();
        testAssignPage.clickOnAssign();
      });
      it(`Login As Student And Attempt Questions`, () => {
        cy.login("student", Student1.email, Student1.pass);
        assignmentsPage.clickOnAssigmentByTestId(OriginalTestId);
        itemsInTest.forEach((item, ind) => {
          studentTestPage.attemptQuestion(questionType[ind], attemptTypes.PARTIAL_CORRECT, attempt[ind]);
          studentTestPage.clickOnNext();
        });
        studentTestPage.submitTest();
        reportsPage
          .getScoreOnCardById(OriginalTestId)
          .should("have.text", `${points[index].reduce((a, b) => b + a, 0)}/${totalPoints.reduce((a, b) => b + a, 0)}`);
      });
      itemsInTest.forEach((item, ind) => {
        it(`Verifying At Student Side-${method} for ${item} type`, () => {
          if (ind === 0) assignmentsPage.reviewSubmittedTestById(OriginalTestId);
          reportsPage.selectQuestion(`Q${ind + 1}`);
          reportsPage.getScore().should("have.text", points[index][ind].toString());
        });
      });
    });
  });
});
