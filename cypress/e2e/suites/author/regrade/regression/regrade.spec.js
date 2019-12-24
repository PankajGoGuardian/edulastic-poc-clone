import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import FileHelper from "../../../../framework/util/fileHelper";
import TestReviewTab from "../../../../framework/author/tests/testDetail/testReviewTab";
import TestAddItemTab from "../../../../framework/author/tests/testDetail/testAddItemTab";
import TestAssignPage from "../../../../framework/author/tests/testDetail/testAssignPage";
import SidebarPage from "../../../../framework/student/sidebarPage";
import AssignmentsPage from "../../../../framework/student/assignmentsPage";
import StudentTestPage from "../../../../framework/student/studentTestPage";
import Regrade from "../../../../framework/author/tests/testDetail/regrade";

describe(`With Applying Regrading-Test Editing`, () => {
  const testLibraryPage = new TestLibrary();
  const assignmentsPage = new AssignmentsPage();
  const studentTestPage = new StudentTestPage();
  const testReviewTab = new TestReviewTab();
  const testAddItemTab = new TestAddItemTab();
  const testAssignPage = new TestAssignPage();
  const sidebarPage = new SidebarPage();
  const regrade = new Regrade();

  const updatedPoints = "6";
  const isAssigned = true;
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

  let OriginalTestId, newTestId;
  let assignedTest, qType, num, quesData, testName, itemsInTest;
  let questText = [];
  let points = [];
  let questionType = [];
  let attempt = [];

  before("Get Data Of test and its itemns", () => {
    cy.deleteAllAssignments(Student1.email, Teacher.email);
    cy.fixture("testAuthoring").then(testData => {
      testName = testData["EDIT_ASSIGNED_TEST_REGRADE"]["name"];
      itemsInTest = testData["EDIT_ASSIGNED_TEST_REGRADE"]["itemKeys"];
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
  before("login and create new items and test", () => {
    cy.login("teacher", Teacher.email, Teacher.pass);
    testLibraryPage.createTest("EDIT_ASSIGNED_TEST_REGRADE").then(id => {
      OriginalTestId = id;
      assignedTest = id;
    });
  });
  before("Assign the test", () => {
    testLibraryPage.clickOnAssign();
    testAssignPage.selectClass("Class");
    testAssignPage.selectTestType("Class Assessment");
    testAssignPage.clickOnEntireClass();
    testAssignPage.clickOnAssign();
  });
  before("Attempt The Test by 2 Students", () => {
    //Partial Attempt
    cy.login("student", Student1.email, Student1.pass);
    sidebarPage.clickOnAssignment();
    assignmentsPage.clickOnAssigmentByTestId(assignedTest);
    studentTestPage.clickOnExitTest();
    // Complete Attempt
    cy.login("student", Student2.email, Student2.pass);
    assignmentsPage.clickOnAssigmentByTestId(assignedTest);
    studentTestPage.getQuestionByIndex(0);
    studentTestPage.attemptQuestionsByQueType(questionType, attempt);
    studentTestPage.submitTest();
  });

  context("Remove One Question From Review Tab and Verify Test", () => {
    it("Remove One Question From Review Tab", () => {
      const [item1, item2] = testLibraryPage.items;
      cy.login("teacher", "300@abc.com", "snapwiz");
      // Get and Convert To Draft
      testLibraryPage.sidebar.clickOnTestLibrary();
      testLibraryPage.searchFilters.clearAll();
      testLibraryPage.searchFilters.getAuthoredByMe();
      testLibraryPage.clickOnTestCardById(OriginalTestId);
      testLibraryPage.clickOnDetailsOfCard();
      testLibraryPage.publishedToDraftAssigned();
      testLibraryPage.getVersionedTestID().then(newTest => {
        newTestId = newTest;
        // Remove 1 item From Review Tab
        testReviewTab.testheader.clickOnReview();
        testReviewTab.clickOnCheckBoxByItemId(item2);
        testReviewTab.clickOnRemoveSelected();
        questionType.pop();
        attempt.pop();
        itemsInTest.pop();
        // Publish
        testReviewTab.testheader.clickOnPublishButton(isAssigned);
        regrade.regradeSelection(true);
        // Apply Regrade And Verify At Student1 Side
        regrade.applyRegrade();
        OriginalTestId = newTestId;
      });
    });
    it("Verifying At Student Side- Removed Question", () => {
      cy.login("student", Student1.email, Student1.pass);
      assignmentsPage.verifyAssignedTestID(newTestId, assignedTest);
      assignmentsPage.clickOnAssigmentByTestId(OriginalTestId);
      studentTestPage.verifyNoOfQuestions(itemsInTest.length);
      studentTestPage.clickOnExitTest();
      cy.login("student", Student2.email, Student2.pass);
      assignmentsPage.sidebar.clickOnGrades();
      assignmentsPage.reviewSubmittedTestById(OriginalTestId);
      studentTestPage.verifyNoOfQuesInReview(itemsInTest.length);
    });
  });

  context("Update Points Of An Item and Verify Test", () => {
    it("Update Points Of An Item", () => {
      const [item1, item2] = testLibraryPage.items;
      cy.login("teacher", "300@abc.com", "snapwiz");
      //Get Test Card and Draft It
      testLibraryPage.sidebar.clickOnTestLibrary();
      testLibraryPage.searchFilters.clearAll();
      testLibraryPage.searchFilters.getAuthoredByMe();
      testLibraryPage.clickOnTestCardById(OriginalTestId);
      testLibraryPage.clickOnDetailsOfCard();
      testLibraryPage.publishedToDraftAssigned();
      testLibraryPage.getVersionedTestID().then(newTest => {
        newTestId = newTest;
        //Update Points
        testReviewTab.updatePointsByID(item1, "6");
        // Publish
        testAddItemTab.header.clickOnPublishButton(isAssigned, true);
        regrade.regradeSelection(true);
        regrade.applyRegrade();
        OriginalTestId = newTestId;
      });
    });
    it("Verifying At Student Side- Update Points", () => {
      cy.login("student", Student1.email, Student1.pass);
      assignmentsPage.verifyAssignedTestID(newTestId, assignedTest);
      assignmentsPage.clickOnAssigmentByTestId(OriginalTestId);
      studentTestPage.getQuestionByIndex(0);
      studentTestPage.attemptQuestionsByQueType(questionType, attempt);
      studentTestPage.submitTest();
      assignmentsPage.reviewSubmittedTestById(OriginalTestId);
      studentTestPage.verifyMaxScoreOfQueByIndex(0, updatedPoints);
      cy.login("student", Student2.email, Student2.pass);
      assignmentsPage.sidebar.clickOnGrades();
      assignmentsPage.reviewSubmittedTestById(OriginalTestId);
      studentTestPage.verifyMaxScoreOfQueByIndex(0, updatedPoints);
    });
  });
});
