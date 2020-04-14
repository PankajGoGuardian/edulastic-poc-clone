import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import TestReviewTab from "../../../../framework/author/tests/testDetail/testReviewTab";
import TestAddItemTab from "../../../../framework/author/tests/testDetail/testAddItemTab";
import TestAssignPage from "../../../../framework/author/tests/testDetail/testAssignPage";
import AssignmentsPage from "../../../../framework/student/assignmentsPage";
import StudentTestPage from "../../../../framework/student/studentTestPage";
import Regrade from "../../../../framework/author/tests/testDetail/regrade";
import AuthorAssignmentPage from "../../../../framework/author/assignments/AuthorAssignmentPage";
import TestSummayTab from "../../../../framework/author/tests/testDetail/testSummaryTab";
import { attemptTypes } from "../../../../framework/constants/questionTypes";
import ItemListPage from "../../../../framework/author/itemList/itemListPage";
import PreviewItemPopup from "../../../../framework/author/itemList/itemPreview";
import ReportsPage from "../../../../framework/student/reportsPage";
import FileHelper from "../../../../framework/util/fileHelper";
import { regradeOptions } from "../../../../framework/constants/assignmentStatus";

const TEST = "TEST_PREVIEW";
const testData = require("../../../../../fixtures/testAuthoring");

const ITEMS = testData[TEST].itemKeys;
const grades = testData[TEST].grade;
const subjects = testData[TEST].subject;
let newItemId;
const itemKeysInTest = [];
ITEMS.forEach(ele => {
  itemKeysInTest.push(ele.split(".")[0]);
});
describe(`${FileHelper.getSpecName(Cypress.spec.name)}Verify Actions Button In Author Side Assignments Page`, () => {
  const testLibraryPage = new TestLibrary();
  const assignmentsPage = new AssignmentsPage();
  const studentTestPage = new StudentTestPage();
  const testReviewTab = new TestReviewTab();
  const testAddItemTab = new TestAddItemTab();
  const testAssignPage = new TestAssignPage();
  const testSummayTab = new TestSummayTab();
  const regrade = new Regrade();
  const item = new ItemListPage();
  const itemPreview = new PreviewItemPopup();
  const reportsPage = new ReportsPage();

  const authorAssignmentPage = new AuthorAssignmentPage();
  const newItemKey = "MCQ_STD.default";
  const updatedPoints = "6";
  const isAssigned = true;
  const Teacher = {
    email: "teacher.for.assign.actions@snapwiz.com",
    pass: "snapwiz"
  };
  const Student1 = {
    email: "student1.for.assign.actions@snapwiz.com",
    pass: "snapwiz"
  };
  const Student2 = {
    email: "student2.for.assign.actions@snapwiz.com",
    pass: "snapwiz"
  };

  let OriginalTestId;
  let newTestId;
  let qType;
  let num;
  let itemIds;
  const questText = [];
  const points = [];
  const questionType = [];
  const attempt = [];

  before("Get Data Of test and its itemns", () => {
    cy.deleteAllAssignments(Student1.email, Teacher.email);
    cy.fixture("questionAuthoring").then(quesData => {
      ITEMS.forEach(element => {
        [qType, num] = element.split(".");
        questText.push(quesData[qType][num].quetext);
        questionType.push(qType);
        points.push(quesData[qType][num].setAns.points);
        attempt.push(quesData[qType][num].attemptData);
      });
    });
  });
  before("Login and create new items and test", () => {
    cy.login("teacher", Teacher.email, Teacher.pass);
    testLibraryPage.createTest(TEST).then(id => {
      OriginalTestId = id;
      itemIds = testLibraryPage.items;
    });
  });
  before("Assign the test", () => {
    testLibraryPage.clickOnAssign();
    testAssignPage.selectClass("Class");
    testAssignPage.selectTestType("Class Assessment");
    testAssignPage.clickOnEntireClass();
    testAssignPage.clickOnAssign();
    cy.wait(5000);
  });

  context("Verify Actions Button In Author Side Assignments Page", () => {
    context("Duplicate", () => {
      before("Duplicate Test", () => {
        testLibraryPage.sidebar.clickOnAssignment();
        authorAssignmentPage.clickOnDuplicateAndWait().then(id => {
          newTestId = id;
        });
      });
      it("Verify Duplicate Test", () => {
        testLibraryPage.verifyNewTestIdInUrl(OriginalTestId);
        testSummayTab.header.clickOnReview();
        itemIds.forEach(item => testReviewTab.verifyQustionById(item));
        testReviewTab.verifySummary(itemKeysInTest.length, points.reduce((a, b) => a + b, 0));
      });
    });
    context("Preview", () => {
      before("click on preview", () => {
        testLibraryPage.sidebar.clickOnTestLibrary();
        testLibraryPage.sidebar.clickOnAssignment();
        authorAssignmentPage.clickOnPreviewTestAndVerifyId(OriginalTestId);
      });
      it("Verify Preview", () => {
        studentTestPage.verifyNoOfQuestions(itemKeysInTest.length);
        itemKeysInTest.forEach((item, index) => {
          studentTestPage.attemptQuestion(questionType[index], attemptTypes.RIGHT, attempt[index]);
          studentTestPage.clickOnNext(true);
        });
        // studentTestPage.clickOnExitTest(true); // preview assessment player automatically gets closed by last next button click
      });
    });
    context("View Details", () => {
      before("Click On View Details", () => {
        testLibraryPage.sidebar.clickOnTestLibrary();
        testLibraryPage.sidebar.clickOnAssignment();
        authorAssignmentPage.clickOnViewDetailsAndverifyId(OriginalTestId);
      });
      it("Verify View Details ", () => {
        testReviewTab.verifySummary(itemKeysInTest.length, points.reduce((a, b) => a + b, 0));
        itemIds.forEach(item => testReviewTab.verifyQustionById(item));
        subjects.forEach((subject, index) => testReviewTab.verifyGradeSubject(grades[index], subject));
      });
      itemKeysInTest.forEach((item, index) => {
        it(`Verify In The Review Tabs-Collapsed Mode-${item}`, () => {
          // Verify All questions' presence
          testReviewTab.verifyQustionById(itemIds[index]);
          testReviewTab.asesrtPointsByid(itemIds[index], points[index]);
        });
        it(`Verify In The Review Tabs-Expanded Mode-${item}`, () => {
          testReviewTab.clickOnExpandRow();
          // Verify All questions' presence along with thier correct answers and points
          testReviewTab.verifyQustionById(itemIds[index]);
          attempt[index].item = itemIds[index];
          itemPreview.verifyQuestionResponseCard(itemKeysInTest[index], attempt[index], attemptTypes.RIGHT, true);
          testReviewTab.asesrtPointsByid(itemIds[index], points[index]);
          testReviewTab.clickOnCollapseRow();
        });
      });
    });
    context("Edit Test", () => {
      before("Create An Item", () => {
        item.createItem(newItemKey).then(id => {
          // New Item Details
          newItemId = id;
          testLibraryPage.sidebar.clickOnAssignment();
          authorAssignmentPage.clickOnEditTest();
          authorAssignmentPage.verifyEditTestURLUnAttempted(OriginalTestId);
        });
      });
      before("Add Created Item To test", () => {
        // Add created Item using add item tab
        testReviewTab.testheader.clickOnAddItems();
        testReviewTab.searchFilters.clearAll();
        testReviewTab.searchFilters.getAuthoredByMe();
        testAddItemTab.addItemById(newItemId);
        itemKeysInTest.push(newItemKey);
        itemIds.push(newItemId);
        testAddItemTab.header.clickOnReview();
        // verify review tab before publish
        testReviewTab.getQueCardByItemIdInCollapsed(newItemId).should("have.length", 1);
        // Publish
        testReviewTab.testheader.clickOnPublishButton();
      });

      beforeEach("close assignment player if failed in between", () => {
        studentTestPage.clickOnExitTest();
      });

      it("Verify and attempt assignment", () => {
        cy.login("student", Student1.email, Student1.pass);
        assignmentsPage.verifyPresenceOfTest(OriginalTestId);
        assignmentsPage.clickOnAssigmentByTestId(OriginalTestId);
        studentTestPage.verifyNoOfQuestions(itemKeysInTest.length);
        studentTestPage.clickOnExitTest();
      });
      it("Edit Test after attempt-Regrade", () => {
        cy.login("teacher", Teacher.email, Teacher.pass);
        testLibraryPage.sidebar.clickOnAssignment();
        authorAssignmentPage.clickOnEditTest(true);
        // Remove Last item
        testReviewTab.clickOnCheckBoxByItemId(itemIds[itemIds.length - 1]);
        itemIds.pop();
        testReviewTab.clickOnRemoveSelected();
        testLibraryPage.header.clickRegradePublish();
        regrade.applyRegrade();
      });
      it("Verify After Edit-Regrade", () => {
        cy.login("student", Student1.email, Student1.pass);
        assignmentsPage.clickOnAssignmentButton();
        studentTestPage.verifyNoOfQuestions(itemIds.length);
        studentTestPage.clickOnExitTest();
      });
      /*   it("Edit Test after attempt- Without Regrade", () => {
        cy.login("teacher", Teacher.email, Teacher.pass);
        testLibraryPage.sidebar.clickOnAssignment();
        authorAssignmentPage.clickOnEditTest();
        testReviewTab.updatePointsByID(itemIds[itemIds.length - 1], updatedPoints);
        testLibraryPage.header.clickOnPublishButton(isAssigned);
        regrade.regradeSelection(false, true);
      });
      it("Verify After Edit-Without Regrade", () => {
        cy.login("student", Student1.email, Student1.pass);
        assignmentsPage.clickOnAssignmentButton();
        studentTestPage.getQuestionByIndex(0);
        itemIds.forEach((item, index) => {
          studentTestPage.attemptQuestion(itemKeysInTest[index], attemptTypes.RIGHT, attempt[index]);
          studentTestPage.clickOnNext(true);
        });

        studentTestPage.submitTest();
        assignmentsPage.sidebar.clickOnGrades();
        assignmentsPage.clickOnReviewButton();
        reportsPage.verifyNoOfQuesInReview(itemIds.length);
        reportsPage.verifyMaxScoreOfQueByIndex(itemIds.length - 1, points[itemIds.length - 1]);
      }); */
    });
    context("Unassign", () => {
      before("login as teacher and unassign", () => {
        cy.login("teacher", Teacher.email, Teacher.pass);
        testLibraryPage.sidebar.clickOnAssignment();
        authorAssignmentPage.clickOnUnassign();
      });
      it("Verify UnAssign", () => {
        cy.login("student", Student2.email, Student2.pass);
        assignmentsPage.sidebar.clickOnAssignment();
        assignmentsPage.verifyAbsenceOfTest(OriginalTestId);
      });
    });
  });
});
