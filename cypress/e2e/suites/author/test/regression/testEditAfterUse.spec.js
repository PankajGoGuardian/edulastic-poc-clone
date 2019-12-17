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

  before("Get Data Of test and its itemns", () => {
    cy.deleteAllAssignments(Student1.email, Teacher.email);
    cy.fixture("testAuthoring").then(testData => {
      testName = testData["EDIT_ASSIGNED_TEST"]["name"];
      itemsInTest = testData["EDIT_ASSIGNED_TEST"]["itemKeys"];
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
    testLibraryPage.createTest("EDIT_ASSIGNED_TEST").then(id => {
      OriginalTestId = id;
      assignedTest = id;
    });
  });
  context("Edit assigned Tests without Regrading", () => {
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
      assignmentsPage.clickOnAssigmentByTestId(assignedTest);
      studentTestPage.clickOnExitTest();
    });

    it("Edit the name , grade , subject and verify", () => {
      cy.login("teacher", "300@abc.com", "snapwiz");
      const [testname, grade, subject] = ["editedTest", "Grade 8", "ELA"];
      // Get the  test and convert it to draft
      testLibraryPage.sidebar.clickOnTestLibrary();
      testLibraryPage.searchFilters.clearAll();
      testLibraryPage.searchFilters.getAuthoredByMe();
      testLibraryPage.clickOnTestCardById(OriginalTestId);
      testLibraryPage.clickOnDetailsOfCard();
      testLibraryPage.publishedToDraftAssigned();
      testLibraryPage.getVersionedTestID().then(id => {
        newTestId = id;
        testLibraryPage.verifyVersionedURL(OriginalTestId, newTestId);
        testLibraryPage.header.clickOnDescription();
        // update the test in Description
        testSummayTab.setName(testname);
        testSummayTab.selectGrade(grade);
        testSummayTab.selectSubject(subject);
        testSummayTab.header.clickOnPublishButton(isAssigned);
        regrade.regradeSelection(false);
        cy.login("student", Student1.email, Student1.pass);
        assignmentsPage.verifyAssignedTestID(assignedTest, newTestId);
        assignmentsPage.verifyTestNameById(testName, assignedTest);
        OriginalTestId = newTestId;
      });
    });

    it("Edit question text from Review tab", () => {
      const [item1, item2, item3, item4] = testLibraryPage.items;

      cy.login("teacher", "300@abc.com", "snapwiz");
      //Get Test Card and Draft It
      testLibraryPage.sidebar.clickOnTestLibrary();
      testLibraryPage.searchFilters.clearAll();
      testLibraryPage.searchFilters.getAuthoredByMe();
      testLibraryPage.clickOnTestCardById(OriginalTestId);
      testLibraryPage.clickOnDetailsOfCard();
      testLibraryPage.publishedToDraftAssigned();
      testLibraryPage.getVersionedTestID().then(id => {
        newTestId = id;
        // Edit Question Text From Review Tab
        testReviewTab.previewAndEditById(item3);
        testReviewTab.editQuestionText("Edited Text");
        testReviewTab.itemHeader.save();
        // Publish
        testAddItemTab.header.clickOnPublishButton();
        // testLibraryPage.assertUrl(OriginalTestId);
        cy.login("student", Student1.email, Student1.pass);
        assignmentsPage.verifyAssignedTestID(assignedTest, newTestId);
        assignmentsPage.clickOnAssigmentByTestId(assignedTest);
        studentTestPage.verifyQuestionText(2, questText[2]);
        studentTestPage.clickOnExitTest();
        OriginalTestId = newTestId;
      });
    });

    it("Remove one question from review tab and verify test", () => {
      const [item1, item2, item3, item4] = testLibraryPage.items;
      cy.login("teacher", "300@abc.com", "snapwiz");
      // Get and Convert To Draft
      testLibraryPage.sidebar.clickOnTestLibrary();
      testLibraryPage.searchFilters.clearAll();
      testLibraryPage.searchFilters.getAuthoredByMe();
      testLibraryPage.clickOnTestCardById(OriginalTestId);
      testLibraryPage.clickOnDetailsOfCard();
      testLibraryPage.publishedToDraftAssigned();
      testLibraryPage.getVersionedTestID().then(id => {
        newTestId = id;
        // Remove 1 item From Review Tab
        testReviewTab.testheader.clickOnReview();
        testReviewTab.clickOnCheckBoxByItemId(item1);
        testReviewTab.clickOnRemoveSelected();
        // Publish
        testReviewTab.testheader.clickOnPublishButton();
        cy.login("student", Student1.email, Student1.pass);
        assignmentsPage.verifyAssignedTestID(assignedTest, newTestId);
        assignmentsPage.clickOnAssigmentByTestId(assignedTest);
        studentTestPage.verifyNoOfQuestions(itemsInTest.length);
        studentTestPage.clickOnExitTest();
        OriginalTestId = newTestId;
      });
    });

    it("Add a precreated item and verify test", () => {
      cy.login("teacher", "300@abc.com", "snapwiz");
      //Create A New Item
      item.createItem(newItemKey).then(id => {
        newItemId = id;
        //Get Test and Draft It
        testLibraryPage.sidebar.clickOnTestLibrary();
        testLibraryPage.searchFilters.clearAll();
        testLibraryPage.searchFilters.getAuthoredByMe();
        testLibraryPage.clickOnTestCardById(OriginalTestId);
        testLibraryPage.clickOnDetailsOfCard();
        testLibraryPage.publishedToDraftAssigned();
        testLibraryPage.getVersionedTestID().then(id => {
          newTestId = id;
          // Add created Item using add item tab
          testReviewTab.testheader.clickOnAddItems();
          testReviewTab.searchFilters.clearAll();
          testReviewTab.searchFilters.getAuthoredByMe();
          testAddItemTab.addItemById(newItemId);
          testAddItemTab.header.clickOnReview();
          // verify review tab before publish
          testReviewTab.getQueCardByItemId(newItemId).should("have.length", 1);
          // Publish
          testReviewTab.testheader.clickOnPublishButton();
          //verify
          cy.login("student", Student1.email, Student1.pass);
          assignmentsPage.verifyAssignedTestID(assignedTest, newTestId);
          assignmentsPage.clickOnAssigmentByTestId(assignedTest);
          studentTestPage.verifyNoOfQuestions(itemsInTest.length);
          studentTestPage.clickOnExitTest();
          OriginalTestId = newTestId;
        });
      });
    });

    it("Remove one question from add item tab and verify test", () => {
      const [item1, item2, item3, item4] = testLibraryPage.items;

      cy.login("teacher", "300@abc.com", "snapwiz");

      testLibraryPage.sidebar.clickOnTestLibrary();
      testLibraryPage.searchFilters.clearAll();
      testLibraryPage.searchFilters.getAuthoredByMe();
      testLibraryPage.clickOnTestCardById(OriginalTestId);
      testLibraryPage.clickOnDetailsOfCard();
      testLibraryPage.publishedToDraftAssigned();
      testLibraryPage.getVersionedTestID().then(id => {
        newTestId = id;
        testReviewTab.testheader.clickOnAddItems();
        testAddItemTab.removeItemById(item2);
        testAddItemTab.header.clickOnPublishButton();
        testLibraryPage.assertUrl(OriginalTestId);
        cy.login("student", Student1.email, Student1.pass);
        assignmentsPage.verifyAssignedTestID(assignedTest, newTestId);
        assignmentsPage.clickOnAssigmentByTestId(assignedTest);
        studentTestPage.verifyNoOfQuestions(itemsInTest.length);
        studentTestPage.clickOnExitTest();
        OriginalTestId = newTestId;
      });
    });

    it("Update points from review tab and verify test", () => {
      const [item1, item2, item3, item4] = testLibraryPage.items;

      cy.login("teacher", "300@abc.com", "snapwiz");
      testLibraryPage.sidebar.clickOnTestLibrary();
      testLibraryPage.searchFilters.clearAll();
      testLibraryPage.searchFilters.getAuthoredByMe();
      testLibraryPage.clickOnTestCardById(OriginalTestId);
      testLibraryPage.clickOnDetailsOfCard();
      testLibraryPage.publishedToDraftAssigned();
      testLibraryPage.getVersionedTestID().then(id => {
        newTestId = id;
        testReviewTab.updatePointsByID(item4, "6");
        testAddItemTab.header.clickOnPublishButton();
        testLibraryPage.assertUrl(OriginalTestId);
        cy.login("student", Student1.email, Student1.pass);
        assignmentsPage.verifyAssignedTestID(assignedTest, newTestId);
        assignmentsPage.clickOnAssigmentByTestId(assignedTest);
        studentTestPage.getQuestionByIndex(0);
        studentTestPage.attemptQuestionsByQueType(questionType, attempt);
        studentTestPage.submitTest();
        assignmentsPage.reviewSubmittedTestById(assignedTest);
        studentTestPage.verifyMaxScoreOfQueByIndex(3, points[3]);
        OriginalTestId = newTestId;
      });
    });
  });
});
