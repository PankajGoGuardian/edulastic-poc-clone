import TestLibrary from "../../../framework/author/tests/testLibraryPage";
import ItemListPage from "../../../framework/author/itemList/itemListPage";
import TestSummayTab from "../../../framework/author/tests/testDetail/testSummaryTab";
import TestReviewTab from "../../../framework/author/tests/testDetail/testReviewTab";
import TestAddItemTab from "../../../framework/author/tests/testDetail/testAddItemTab";
import TestAssignPage from "../../../framework/author/tests/testDetail/testAssignPage";
import SidebarPage from "../../../framework/student/sidebarPage";
import AssignmentsPage from "../../../framework/student/assignmentsPage";
import StudentTestPage from "../../../framework/student/studentTestPage";
import Regrade from "../../../framework/author/tests/testDetail/regrade";
import FileHelper from "../../../framework/util/fileHelper";
import ReportsPage from "../../../framework/student/reportsPage";
import MCQTrueFalsePage from "../../../framework/author/itemList/questionType/mcq/mcqTrueFalsePage";
import { openPolicyTypes } from "../../../framework/constants/assignmentStatus";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >>Test Edit After Use- Without Regrade`, () => {
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
  const reportsPage = new ReportsPage();
  const mcqTrueFalsePage = new MCQTrueFalsePage();
  const newItemKey = "MCQ_STD.default";
  const isAssigned = true;
  const TEST = "EDIT_ASSIGNED_TEST";

  let OriginalTestId;
  let newTestId;
  let newItemId;
  let assignedTest;
  let testName;
  let itemsInTest;
  let qType;
  let num;
  let quesData;
  const questText = [];
  const points = [];
  const questionType = [];
  const attempt = [];
  let item1;
  let item2;
  let item3;
  let item4;
  const Teacher = {
    email: "teacher.test.edit.after.use@snapwiz.com",
    pass: "snapwiz"
  };
  const Student1 = {
    email: "student.test.edit.after.use@snapwiz.com",
    pass: "snapwiz"
  };

  before(">get data of test and its itemns", () => {
    cy.deleteAllAssignments(Student1.email, Teacher.email);
    cy.fixture("testAuthoring").then(testData => {
      testName = testData[TEST].name;
      itemsInTest = testData[TEST].itemKeys;
      /* THIS TEST REQUIRES EXACTLY FOUR TEST ITEMS */
    });
    cy.fixture("questionAuthoring").then(quesData => {
      itemsInTest.forEach(element => {
        [qType, num] = element.split(".");
        questText.push(quesData[qType][num].quetext);
        questionType.push(qType);
        points.push(quesData[qType][num].setAns.points);
        attempt.push(quesData[qType][num].attemptData);
      });
    });
  });

  before(">login and create new items and test", () => {
    cy.login("teacher", Teacher.email, Teacher.pass);
    testLibraryPage.createTest(TEST).then(id => {
      OriginalTestId = id;
      assignedTest = id;
      [item1, item2, item3, item4] = testLibraryPage.items;
    });
  });
  context(">edit assigned tests without regrading", () => {
    before("Assign the test", () => {
      testLibraryPage.clickOnAssign();
      testAssignPage.selectClass("Class");
      testAssignPage.selectTestType("Class Assessment");
      // testAssignPage.clickOnEntireClass();
      testAssignPage.selectOpenPolicy(openPolicyTypes.AUTO);
      testAssignPage.clickOnAssign();
    });

    before("Attempt the test from student side", () => {
      cy.login("student", Student1.email, Student1.pass);
      sidebarPage.clickOnAssignment();
      assignmentsPage.clickOnAssigmentByTestId(assignedTest);
      studentTestPage.clickOnExitTest();
    });

    it(">edit the name , grade , subject and verify", () => {
      cy.login("teacher", Teacher.email, Teacher.pass);
      const [testname, grade, subject] = ["editedTest", "Grade 8", "ELA"];
      // Get the  test and convert it to draft
      testLibraryPage.visitTestById(OriginalTestId);
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
        regrade.canclelRegrade();
        cy.login("student", Student1.email, Student1.pass);
        assignmentsPage.verifyAssignedTestID(assignedTest, newTestId);
        assignmentsPage.verifyTestNameById(testName, assignedTest);
        OriginalTestId = newTestId;
      });
    });

    it(">edit question text from review tab", () => {
      cy.login("teacher", Teacher.email, Teacher.pass);
      // Get Test Card and Draft It
      testLibraryPage.visitTestById(OriginalTestId);
      testLibraryPage.publishedToDraftAssigned();
      testLibraryPage.getVersionedTestID().then(id => {
        newTestId = id;
        // Edit Question Text From Review Tab
        testReviewTab.previewQuestById(item3);
        testReviewTab.previewItemPopUp.clickEditOnPreview();
        mcqTrueFalsePage.setQuestionEditorText("Edited Text");
        // It will create new version of item
        testReviewTab.itemHeader.saveAndgetId(true).then(item => {
          expect(item).not.eq(item3);
          cy.saveItemDetailToDelete(item);
        });
        // Publish
        testAddItemTab.header.clickOnPublishButton();
        testLibraryPage.assertUrl(newTestId);
        cy.login("student", Student1.email, Student1.pass);
        assignmentsPage.verifyAssignedTestID(assignedTest, newTestId);
        assignmentsPage.clickOnAssigmentByTestId(assignedTest);
        studentTestPage.verifyQuestionText(2, questText[2]);
        studentTestPage.clickOnExitTest();
        OriginalTestId = newTestId;
      });
    });

    it(">remove one question from review tab and verify test", () => {
      cy.login("teacher", Teacher.email, Teacher.pass);
      // Get and Convert To Draft
      testLibraryPage.visitTestById(OriginalTestId);
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

    it(">add a precreated item and verify test", () => {
      cy.login("teacher", Teacher.email, Teacher.pass);
      // Create A New Item
      item.createItem(newItemKey).then(id => {
        newItemId = id;
        // Get Test and Draft It
        testLibraryPage.visitTestById(OriginalTestId);
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
          testReviewTab.getQueCardByItemIdInCollapsed(newItemId).should("have.length", 1);
          // Publish
          testReviewTab.testheader.clickOnPublishButton();
          testLibraryPage.assertUrl(newTestId);
          // verify
          cy.login("student", Student1.email, Student1.pass);
          assignmentsPage.verifyAssignedTestID(assignedTest, newTestId);
          assignmentsPage.clickOnAssigmentByTestId(assignedTest);
          studentTestPage.verifyNoOfQuestions(itemsInTest.length);
          studentTestPage.clickOnExitTest();
          OriginalTestId = newTestId;
        });
      });
    });

    it(">remove one question from add item tab and verify test", () => {
      cy.login("teacher", Teacher.email, Teacher.pass);

      testLibraryPage.visitTestById(OriginalTestId);
      testLibraryPage.publishedToDraftAssigned();
      testLibraryPage.getVersionedTestID().then(id => {
        newTestId = id;
        testReviewTab.testheader.clickOnAddItems();
        item.searchFilters.clearAll();
        // This will verify that test versioning does not create item versions
        item.searchFilters.getAuthoredByMe();
        item.searchFilters.typeInSearchBox(item2);
        testAddItemTab.removeItemById(item2);
        testAddItemTab.header.clickOnPublishButton();
        testLibraryPage.assertUrl(newTestId);
        cy.login("student", Student1.email, Student1.pass);
        assignmentsPage.verifyAssignedTestID(assignedTest, newTestId);
        assignmentsPage.clickOnAssigmentByTestId(assignedTest);
        studentTestPage.verifyNoOfQuestions(itemsInTest.length);
        studentTestPage.clickOnExitTest();
        OriginalTestId = newTestId;
      });
    });

    it(">update points from review tab and verify test", () => {
      cy.login("teacher", Teacher.email, Teacher.pass);

      testLibraryPage.visitTestById(OriginalTestId);
      testLibraryPage.publishedToDraftAssigned();
      testLibraryPage.getVersionedTestID().then(id => {
        newTestId = id;
        testReviewTab.updatePointsByID(item4, "6");
        testAddItemTab.header.clickOnPublishButton();
        testLibraryPage.assertUrl(newTestId);
        cy.login("student", Student1.email, Student1.pass);
        assignmentsPage.verifyAssignedTestID(assignedTest, newTestId);
        assignmentsPage.clickOnAssigmentByTestId(assignedTest);
        studentTestPage.getQuestionByIndex(0);
        studentTestPage.attemptQuestionsByQueType(questionType, attempt);
        studentTestPage.submitTest();
        assignmentsPage.reviewSubmittedTestById(assignedTest);
        reportsPage.verifyMaxScoreOfQueByIndex(3, points[3]);
        OriginalTestId = newTestId;
      });
    });
  });
});
