import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import ItemListPage from "../../../../framework/author/itemList/itemListPage";
import TestSummayTab from "../../../../framework/author/tests/testDetail/testSummaryTab";
import TestReviewTab from "../../../../framework/author/tests/testDetail/testReviewTab";
import TestAddItemTab from "../../../../framework/author/tests/testDetail/testAddItemTab";
import TestAssignPage from "../../../../framework/author/tests/testDetail/testAssignPage";
import SidebarPage from "../../../../framework/student/sidebarPage";
import AssignmentsPage from "../../../../framework/student/assignmentsPage";
import StudentTestPage from "../../../../framework/student/studentTestPage";
import Regrade from "../../../../framework/author/tests/testDetail/regrade";
import { assignedTests } from "../../../../framework/testdata/visualRegression";

describe(`Test Edit After Use- Without Regrade`, () => {
  const testLibraryPage = new TestLibrary();
  const assignmentsPage = new AssignmentsPage();
  const studentTestPage = new StudentTestPage();
  const testSummayTab = new TestSummayTab();
  const testReviewTab = new TestReviewTab();
  const testAddItemTab = new TestAddItemTab();
  const item = new ItemListPage();
  const testAssignPage = new TestAssignPage();
  const sidebarPage = new SidebarPage();
  const regrade = new Regrade();
  const newItemKey = "MCQ_STD.default";
  const isAssigned = true;

  let OriginalTestId, newTestId;
  let newItemId, assignedTest, testName, itemsInTest, qType, num, quesData;
  let questText = [];
  let points = [];
  let questionType = [];
  let attempt = [];

  const Teacher = {
    email: "300@abc.com",
    pass: "snapwiz"
  };
  const Student1 = {
    email: "300@xyz.com",
    pass: "snapwiz"
  };
  const Student2 = {
    email: "301@xyz.com",
    pass: "snapwiz"
  };

  before("Get Data Of test and its itemns", () => {
    cy.deleteAllAssignments(Student1.email, Teacher.email);
    cy.fixture("testAuthoring").then(testData => {
      testName = testData["default"]["name"];
      itemsInTest = testData["default"]["itemKeys"];
    });
    cy.fixture("questionAuthoring").then(quesData => {
      itemsInTest.forEach(element => {
        [qType, num] = element.split(".");
        questText.push(quesData[qType][num]["quetext"]);
        questionType.push(qType);
        points.push(quesData[qType][num]["setAns"]["points"]);
        attempt.push(quesData[qType][num]["attemptData"]);
      });
    });
  });

  context("Edit assigned Tests without Regrading", () => {
    before("login and create new items and test", () => {
      cy.login("teacher", Teacher.email, Teacher.pass);
      testLibraryPage.createTest("default").then(id => {
        assignedTest = id;
      });
    });
    it("Assign the test", () => {
      testLibraryPage.clickOnAssign();
      testAssignPage.selectClass("Class");
      testAssignPage.selectTestType("Class Assessment");
      testAssignPage.clickOnEntireClass();
      testAssignPage.clickOnAssign();
    });

    it("Attempt the test from student side", () => {
      cy.login("student", "300@xyz.com", "snapwiz");
      sidebarPage.clickOnAssignment();
      assignmentsPage.verifyPresenceOfTest(assignedTest);
      assignmentsPage.clickOnAssigmentByTestId(assignedTest);
      studentTestPage.verifyNoOfQuestions(itemsInTest.length);
      studentTestPage.clickOnExitTest();
      cy.login("student", Student2.email, Student2.pass);
      sidebarPage.clickOnAssignment();
      assignmentsPage.verifyPresenceOfTest(assignedTest);
      assignmentsPage.clickOnAssigmentByTestId(assignedTest);
      studentTestPage.verifyNoOfQuestions(itemsInTest.length);
      studentTestPage.clickOnExitTest();
    });
  });
  context("Edit assigned Tests without Regrading", () => {
    before("login and create new items and test", () => {
      cy.login("teacher", Teacher.email, Teacher.pass);
      testLibraryPage.createTest("default").then(id => {
        assignedTest = id;
      });
    });
    it("Assign the test", () => {
      testLibraryPage.clickOnAssign();
      testAssignPage.selectClass("Class");
      testAssignPage.selectTestType("Class Assessment");
      testAssignPage.clickOnSpecificStudent();
      testAssignPage.selectStudent("301");
      testAssignPage.clickOnAssign();
    });
    it("Attempt the test from student side", () => {
      cy.login("student", "300@xyz.com", "snapwiz");
      sidebarPage.clickOnAssignment();
      assignmentsPage.verifyAbsenceOfTest(assignedTest);
      cy.login("student", Student2.email, Student2.pass);
      sidebarPage.clickOnAssignment();
      assignmentsPage.verifyPresenceOfTest(assignedTest);
      assignmentsPage.clickOnAssigmentByTestId(assignedTest);
      studentTestPage.verifyNoOfQuestions(itemsInTest.length);
      studentTestPage.clickOnExitTest();
    });
  });
});
