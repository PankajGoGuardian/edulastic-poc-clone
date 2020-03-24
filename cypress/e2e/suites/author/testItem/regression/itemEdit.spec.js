import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import ItemListPage from "../../../../framework/author/itemList/itemListPage";
import TestReviewTab from "../../../../framework/author/tests/testDetail/testReviewTab";
import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage";
import AssignmentsPage from "../../../../framework/student/assignmentsPage";
import StudentTestPage from "../../../../framework/student/studentTestPage";
import { attemptTypes } from "../../../../framework/constants/questionTypes";
import TestAssignPage from "../../../../framework/author/tests/testDetail/testAssignPage";
import MCQTrueFalsePage from "../../../../framework/author/itemList/questionType/mcq/mcqTrueFalsePage";
import PreviewItemPopup from "../../../../framework/author/itemList/itemPreview";
import FileHelper from "../../../../framework/util/fileHelper";
import ReportsPage from "../../../../framework/student/reportsPage";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >>Test Edit-Items after and Before use`, () => {
  /* Here All Items are edited from Item bank */
  const testLibraryPage = new TestLibrary();
  const testReviewTab = new TestReviewTab();
  const itemListPage = new ItemListPage();
  const editItemPage = new EditItemPage();
  const assignmentsPage = new AssignmentsPage();
  const studentTestPage = new StudentTestPage();
  const testAssignPage = new TestAssignPage();
  const mcqTrueFalsePage = new MCQTrueFalsePage();
  const itemPreview = new PreviewItemPopup();
  const reportsPage = new ReportsPage();

  let itemIds;
  const TEST = "EDIT_ASSIGNED_TEST_REGRADE";
  let testId;
  let itemsInTest;
  let qType;
  let num;

  const questText = [];
  const points = [];
  const questionType = [];
  const attempt = [];
  const choices = [];
  const queTexts = {};
  const UPDATED_POINTS = [3, 4, 5, 6, 7];
  const UPDATED_TEXT = "Updated Text";
  const Teacher = {
    email: "teacher.item.edit@snapwiz.com",
    pass: "snapwiz"
  };
  const Student1 = {
    email: "student1.item.edit@snapwiz.com",
    pass: "snapwiz"
  };
  const Student2 = {
    email: "student2.item.edit@snapwiz.com",
    pass: "snapwiz"
  };

  before("login and create new items and test", () => {
    cy.deleteAllAssignments(Student1.email, Teacher.email);
    cy.login("teacher", Teacher.email, Teacher.pass);
    testLibraryPage.createTest(TEST).then(id => {
      testId = id;
      itemIds = testLibraryPage.items;
    });
    cy.fixture("testAuthoring").then(testData => {
      itemsInTest = testData[TEST].itemKeys;
    });
    cy.fixture("questionAuthoring").then(quesData => {
      itemsInTest.forEach((element, index) => {
        [qType, num] = element.split(".");
        questText.push(quesData[qType][num].quetext);
        questionType.push(qType);
        points.push(quesData[qType][num].setAns.points);
        attempt.push(quesData[qType][num].attemptData);
        queTexts[itemIds[index]] = quesData[qType][num].quetext;
        choices.push(quesData[qType][num].choices);
      });
    });
  });
  context("Edit Before Use/Attempt-- Points", () => {
    /* Edited points should not reflect in test review as well as student side */
    before("Assign the test", () => {
      testLibraryPage.clickOnAssign();
      testAssignPage.selectClass("Class");
      testAssignPage.selectTestType("Class Assessment");
      testAssignPage.clickOnEntireClass();
      testAssignPage.clickOnAssign();
    });
    before("Verify Presence of Assigned Test", () => {
      cy.login("student", Student1.email, Student1.pass);
      assignmentsPage.verifyPresenceOfTest(testId);
      cy.login("teacher", Teacher.email, Teacher.pass);
    });
    it("Edit Points of each item", () => {
      testLibraryPage.sidebar.clickOnItemBank();
      itemListPage.searchFilters.getAuthoredByMe();
      itemListPage.searchFilters.clearAll();
      itemIds.forEach((ele, i) => {
        itemListPage.searchFilters.getSearchTextBox().clear({ force: true });
        itemListPage.searchFilters.typeInSearchBox(ele);
        itemListPage.clickOnViewItemById(ele, questText[i]);
        itemPreview.clickEditOnPreview();
        mcqTrueFalsePage.updatePoints(UPDATED_POINTS[i]);
        editItemPage.header.saveAndgetId(true).then(id => {
          /* Id of item wont change in case of Before attempt */
          expect(id).eq(ele);
        });
        editItemPage.header.clickOnPublishItem();
      });
    });

    it("verify in review tab", () => {
      testLibraryPage.sidebar.clickOnTestLibrary();
      testLibraryPage.searchFilters.clearAll();
      testLibraryPage.searchFilters.getAuthoredByMe();
      testLibraryPage.clickOnTestCardById(testId);
      testLibraryPage.clickOnDetailsOfCard();
      itemIds.forEach((id, i) => {
        testReviewTab.getPointsOnQueCardByid(id).should("not.have.value", UPDATED_POINTS[i].toString());
        testReviewTab.getPointsOnQueCardByid(id).should("have.value", points[i].toString());
      });
    });

    it(" Login As student and verify points", () => {
      cy.login("student", Student1.email, Student1.pass);
      assignmentsPage.verifyPresenceOfTest(testId);
      assignmentsPage.clickOnAssigmentByTestId(testId);
      studentTestPage.getQuestionByIndex(0);
      studentTestPage.attemptQuestionsByQueType(questionType, attempt);
      studentTestPage.submitTest();
      assignmentsPage.reviewSubmittedTestById(testId);
      itemsInTest.forEach((item, index) => {
        reportsPage.verifyMaxScoreOfQueByIndex(index, points[index].toString());
      });
    });
  });
  context("Edit Before Use/Attempt-- Question Text", () => {
    /* Apart from every thing should reflect at test review as well as student side in case of no attempt */
    before("login and create new items and test", () => {
      cy.login("teacher", Teacher.email, Teacher.pass);
      testLibraryPage.createTest(TEST).then(id => {
        testId = id;
        itemIds = testLibraryPage.items;
      });
    });

    before("Assign the test", () => {
      testLibraryPage.clickOnAssign();
      testAssignPage.selectClass("Class");
      testAssignPage.selectTestType("Class Assessment");
      testAssignPage.clickOnEntireClass();
      testAssignPage.clickOnAssign();
    });
    before("Verify Presence of Assigned Test", () => {
      cy.login("student", Student1.email, Student1.pass);
      assignmentsPage.verifyPresenceOfTest(testId);
      cy.login("teacher", Teacher.email, Teacher.pass);
    });
    it("Edit question text of each item", () => {
      testLibraryPage.sidebar.clickOnItemBank();
      itemListPage.searchFilters.clearAll();
      itemIds.forEach((ele, i) => {
        itemListPage.searchFilters.getSearchTextBox().clear({ force: true });
        itemListPage.searchFilters.typeInSearchBox(ele);
        itemListPage.clickOnViewItemById(ele, questText[i]);
        itemPreview.clickEditOnPreview();
        mcqTrueFalsePage.setQuestionEditorText(UPDATED_TEXT);
        editItemPage.header.saveAndgetId(true).then(id => {
          expect(id).eq(ele);
        });
        editItemPage.header.clickOnPublishItem();
      });
    });

    it("verify in review tab", () => {
      testLibraryPage.sidebar.clickOnTestLibrary();
      testLibraryPage.searchFilters.clearAll();
      testLibraryPage.searchFilters.getAuthoredByMe();
      testLibraryPage.clickOnTestCardById(testId);
      testLibraryPage.clickOnDetailsOfCard();
      itemIds.forEach((id, i) => {
        testReviewTab.clickOnExpandRow();
        testReviewTab.getQueContainerById(id).should("not.contain", questText[i]);
        testReviewTab.getQueContainerById(id).should("contain", UPDATED_TEXT);
        testReviewTab.clickOnCollapseRow();
      });
    });

    it(" Login As student and verify text", () => {
      cy.login("student", Student1.email, Student1.pass);
      // assignmentsPage.sidebar.clickOnAssignment();
      assignmentsPage.verifyPresenceOfTest(testId);
      assignmentsPage.clickOnAssigmentByTestId(testId);
      studentTestPage.getQuestionByIndex(0);
      itemsInTest.forEach(() => {
        studentTestPage.getQuestionText().should("contain", UPDATED_TEXT);
        studentTestPage.clickOnNext();
      });
      studentTestPage.submitTest();
      assignmentsPage.reviewSubmittedTestById(testId);
      itemsInTest.forEach((item, index) => {
        reportsPage.verifyMaxScoreOfQueByIndex(index, points[index].toString());
      });
    });
  });
  context("Edit Before Use/Attempt-- correct ans", () => {
    /* Changing Correct ans should also get reflected */
    before("login and create new items and test", () => {
      cy.login("teacher", Teacher.email, Teacher.pass);
      testLibraryPage.createTest(TEST).then(id => {
        testId = id;
        itemIds = testLibraryPage.items;
      });
    });

    before("Assign the test", () => {
      testLibraryPage.clickOnAssign();
      testAssignPage.selectClass("Class");
      testAssignPage.selectTestType("Class Assessment");
      testAssignPage.clickOnEntireClass();
      testAssignPage.clickOnAssign();
    });
    before("Verify Presence of Assigned Test", () => {
      cy.login("student", Student1.email, Student1.pass);
      assignmentsPage.verifyPresenceOfTest(testId);
      cy.login("teacher", Teacher.email, Teacher.pass);
    });
    it("Edit question text of each item", () => {
      testLibraryPage.sidebar.clickOnItemBank();
      itemListPage.searchFilters.clearAll();
      itemIds.forEach((ele, i) => {
        itemListPage.searchFilters.getSearchTextBox().clear({ force: true });
        itemListPage.searchFilters.typeInSearchBox(ele);
        itemListPage.clickOnViewItemById(ele, questText[i]);
        itemPreview.clickEditOnPreview();
        mcqTrueFalsePage.setCorrectAnswer(choices[i][1]);
        // eslint-disable-next-line prefer-destructuring
        attempt[i].right = choices[i][1];
        editItemPage.header.saveAndgetId(true).then(id => {
          expect(id).eq(ele);
        });
        editItemPage.header.clickOnPublishItem();
      });
    });

    it("verify in review tab", () => {
      testLibraryPage.sidebar.clickOnTestLibrary();
      testLibraryPage.searchFilters.clearAll();
      testLibraryPage.searchFilters.getAuthoredByMe();
      testLibraryPage.clickOnTestCardById(testId);
      testLibraryPage.clickOnDetailsOfCard();
      itemIds.forEach((id, i) => {
        testReviewTab.clickOnExpandRow();
        attempt[i].item = id;
        /* After updating correct ans */
        itemPreview.verifyQuestionResponseCard(questionType[i], attempt[i], attemptTypes.RIGHT, true);
        testReviewTab.clickOnCollapseRow();
      });
    });

    it(" Login As student and verify points", () => {
      cy.login("student", Student1.email, Student1.pass);
      assignmentsPage.verifyPresenceOfTest(testId);
      assignmentsPage.clickOnAssigmentByTestId(testId);
      studentTestPage.getQuestionByIndex(0);
      studentTestPage.attemptQuestionsByQueType(questionType, attempt);
      studentTestPage.submitTest();
      assignmentsPage.reviewSubmittedTestById(testId);
      itemsInTest.forEach((item, index) => {
        reportsPage.verifyMaxScoreOfQueByIndex(index, points[index].toString());
        /* After updating correct ans */
        reportsPage.getAchievedScore().should("have.text", points[index].toString());
      });
    });
  });
  context("Edit After Use/Attempt-- Question Text", () => {
    before("login As Teacher And Edit Test", () => {
      cy.login("teacher", Teacher.email, Teacher.pass);
    });

    it("Edit Points of each item", () => {
      testLibraryPage.sidebar.clickOnItemBank();
      itemListPage.searchFilters.clearAll();
      itemIds.forEach((ele, i) => {
        itemListPage.searchFilters.getSearchTextBox().clear({ force: true });
        itemListPage.searchFilters.typeInSearchBox(ele);
        itemListPage.clickOnViewItemById(ele, questText[i]);
        itemPreview.clickEditOnPreview();
        mcqTrueFalsePage.setQuestionEditorText(UPDATED_TEXT);
        editItemPage.header.saveAndgetId(true).then(id => {
          expect(id).not.eq(ele);
          cy.saveItemDetailToDelete(id);
        });
        editItemPage.header.clickOnPublishItem();
      });
    });

    it("verify in review tab", () => {
      testLibraryPage.sidebar.clickOnTestLibrary();
      testLibraryPage.searchFilters.clearAll();
      testLibraryPage.searchFilters.getAuthoredByMe();
      testLibraryPage.clickOnTestCardById(testId);
      testLibraryPage.clickOnDetailsOfCard();
      itemIds.forEach((id, i) => {
        testReviewTab.clickOnExpandRow();
        testReviewTab.getQueContainerById(id).should("contain", questText[i]);
        testReviewTab.getQueContainerById(id).should("not.contain", UPDATED_TEXT);
        testReviewTab.clickOnCollapseRow();
      });
    });

    it(" Login As student and verify points", () => {
      cy.login("student", Student2.email, Student2.pass);
      assignmentsPage.verifyPresenceOfTest(testId);
      assignmentsPage.clickOnAssigmentByTestId(testId);
      studentTestPage.getQuestionByIndex(0);
      itemsInTest.forEach((item, index) => {
        studentTestPage.getQuestionText().should("contain", questText[index]);
        studentTestPage.clickOnNext();
      });
      studentTestPage.submitTest();
    });
  });
});
