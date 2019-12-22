import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage";
import TestReviewTab from "../../../../framework/author/tests/testDetail/testReviewTab";
import TestAddItemTab from "../../../../framework/author/tests/testDetail/testAddItemTab";
import StudentTestPage from "../../../../framework/student/studentTestPage";
import { attemptTypes } from "../../../../framework/constants/questionTypes";
const TEST = "TEST_PREVIEW";
const testData = require("../../../../../fixtures/testAuthoring");
let testName = testData[TEST]["name"];
let ITEMS = testData[TEST]["itemKeys"];
let grades = testData[TEST]["grade"];
let subjects = testData[TEST]["subject"];
let itemsInTest = [];
ITEMS.forEach(ele => {
  itemsInTest.push(ele.split(".")[0]);
});
describe("Reviewing Test In Test Review Tab", () => {
  const testLibraryPage = new TestLibrary();
  const editItemPage = new EditItemPage();
  const studentTestPage = new StudentTestPage();
  const testReviewTab = new TestReviewTab();
  const testAddItemTab = new TestAddItemTab();

  const TEST = "TEST_PREVIEW";
  const EDTITED_TEXT = [
    "Edited inside Preview---1",
    "Edited inside Preview---2",
    "Edited inside Preview---3",
    "Edited inside Preview---4"
  ];
  const EDITED_POINTS = [5, 6, 7, 8, 9];

  let OriginalTestId, itemIds;
  let qType, num;
  let questText = [];
  let points = [];
  let ans = [];
  let wrongAns = [];
  let questionType = [];
  let attemptData = [];

  before("Get Data Of test and its itemns", () => {
    // cy.fixture("testAuthoring").then(testData => {
    //   testName = testData[TEST]["name"];
    //   itemsInTest = testData[TEST]["itemKeys"];
    //   grades = testData[TEST]["grade"];
    //   subjects = testData[TEST]["subject"];
    // });
    cy.fixture("questionAuthoring").then(quesData => {
      ITEMS.forEach(element => {
        [qType, num] = element.split(".");
        if (Array.isArray(quesData[qType][num]["quetext"])) {
          questText.push(quesData[qType][num]["quetext"][0]);
        } else questText.push(quesData[qType][num]["quetext"][0]);
        questionType.push(qType);
        points.push(quesData[qType][num]["setAns"]["points"]);
        ans.push(quesData[qType][num]["setAns"]["correct"]);
        wrongAns.push(quesData[qType][num]["attemptData"]["wrong"]);
        attemptData.push(quesData[qType][num]["attemptData"]);
      });
    });
  });
  before("Login And Create Test", () => {
    cy.login();
    testLibraryPage.createTest(TEST).then(id => {
      OriginalTestId = id;
      itemIds = testLibraryPage.items;
    });
  });

  context("Review Test in different Parts Of Review Tab", () => {
    context("Verifying items In expanded and Collapsed Rows,", () => {
      it(`Get Test Card-${testName} and Go-To Review`, () => {
        testLibraryPage.sidebar.clickOnTestLibrary();
        testLibraryPage.searchFilters.clearAll();
        testLibraryPage.searchFilters.getAuthoredByMe();
        testLibraryPage.clickOnTestCardById(OriginalTestId);
        testLibraryPage.clickOnDetailsOfCard();
      });
      itemsInTest.forEach((item, index) => {
        it(`Verify  ${item}-${index + 1}In The Review Tabs-Collapsed Mode`, () => {
          // Verify All questions' presence
          testReviewTab.verifyQustionById(itemIds[index]);
          testReviewTab.asesrtPointsByid(itemIds[index], points[index]);
        });

        it(`Verify  ${item}-${index + 1} In The Review Tabs-Expanded Mode`, () => {
          testReviewTab.clickOnExpandCollapseRow();
          // Verify All questions' presence along with thier correct answers and points
          testReviewTab.verifyQustionById(itemIds[index]);
          attemptData[index]["item"] = itemIds[index];
          testReviewTab.verifyQuestionResponseCard(itemsInTest[index], attemptData[index], attemptTypes.RIGHT, true);
          testReviewTab.asesrtPointsByid(itemIds[index], points[index]);
          testReviewTab.clickOnExpandCollapseRow();
        });
      });
    });
    it("Verify Test Summary In Review Tab", () => {
      testLibraryPage.sidebar.clickOnTestLibrary();
      testLibraryPage.searchFilters.clearAll();
      testLibraryPage.searchFilters.getAuthoredByMe();
      testLibraryPage.clickOnTestCardById(OriginalTestId);
      testLibraryPage.clickOnDetailsOfCard();
      // Verify Test in summary panel
      testReviewTab.verifySummary(points.length, points.reduce((a, b) => a + b, 0));
      subjects.forEach((sub, index) => {
        testReviewTab.verifyGradeSubject(grades[index], sub);
      });
    });
    // TODO: Work On This As click on "View As Student" Starts working in cypress
    it.skip("Verify Test In- View as Student", () => {
      testLibraryPage.sidebar.clickOnTestLibrary();
      testLibraryPage.searchFilters.clearAll();
      testLibraryPage.searchFilters.getAuthoredByMe();
      testLibraryPage.clickOnTestCardById(OriginalTestId);
      testLibraryPage.clickOnDetailsOfCard();
      testReviewTab.clickOnExpandCollapseRow();
      testReviewTab.clickOnViewAsStudent();
      studentTestPage.verifyNoOfQuestions([item1, item2].length);
      studentTestPage.getQuestionByIndex(0);
      itemIds.forEach((val, index) => {
        studentTestPage.getQuestionByIndex(index);
        studentTestPage.verifyQuestionText(questText[index]);
      });
      studentTestPage.clickOnExitTest();
    });
    it("Verify Test-Items Order Using Move-To Option", () => {
      testLibraryPage.sidebar.clickOnTestLibrary();
      testLibraryPage.searchFilters.clearAll();
      testLibraryPage.searchFilters.getAuthoredByMe();
      testLibraryPage.clickOnTestCardById(OriginalTestId);
      testLibraryPage.clickOnDetailsOfCard();
      testLibraryPage.publishedToDraft();
      itemIds.forEach((item, index, totalItems) => {
        testReviewTab.clickOnCheckBoxByItemId(item);
        //Move question at last-- totalItems.length
        testReviewTab.moveQuestionByIndex(totalItems.length);
        //Item should be at last-- totalItems.length
        testReviewTab.verifyMovedQuestionById(item, totalItems.length);
        testReviewTab.clickOnCheckBoxByItemId(item);
      });
      testReviewTab.testheader.clickOnPublishButton();
    });
    context("Preview Test items", () => {
      context("Verify Show Ans On Preivew", () => {
        it(`Get Test Card-"${testName}" and Go-To Review`, () => {
          testLibraryPage.sidebar.clickOnTestLibrary();
          testLibraryPage.searchFilters.clearAll();
          testLibraryPage.searchFilters.getAuthoredByMe();
          testLibraryPage.clickOnTestCardById(OriginalTestId);
          testLibraryPage.clickOnDetailsOfCard();
        });
        itemsInTest.forEach((item, index) => {
          it(`Verify Show Ans for "${item}-${index + 1} "`, () => {
            testReviewTab.previewQuestById(itemIds[index]);
            testReviewTab.clickOnShowAnsOnPreview();
            testReviewTab.verifyQuestionResponseCard(itemsInTest[index], attemptData[index], attemptTypes.RIGHT, true);
            testReviewTab.closePreiview();
          });
        });
      });
      context("Verify Check Ans On Preivew", () => {
        it(`Get Test Card-${testName} and Go-To Review`, () => {
          testLibraryPage.sidebar.clickOnTestLibrary();
          testLibraryPage.searchFilters.clearAll();
          testLibraryPage.searchFilters.getAuthoredByMe();
          testLibraryPage.clickOnTestCardById(OriginalTestId);
          testLibraryPage.clickOnDetailsOfCard();
        });
        itemsInTest.forEach((item, index) => {
          it(`Verify Right Ans for "${item}-${index + 1} "`, () => {
            // Correct ans should have green bg-color
            testReviewTab.previewQuestById(itemIds[index]);
            // testReviewTab.attemptQuestion(itemsInTest[index], attemptData[index], attemptTypes.RIGHT);
            studentTestPage.attemptQuestion(itemsInTest[index].split(".")[0], attemptTypes.RIGHT, attemptData[index]);
            testReviewTab.clickOnCheckAnsOnPreview();
            testReviewTab.verifyEvaluationScoreOnPreview(
              attemptData[index],
              points[index],
              itemsInTest[index],
              attemptTypes.RIGHT
            );
            testReviewTab.verifyQuestionResponseCard(itemsInTest[index], attemptData[index], attemptTypes.RIGHT);
            testReviewTab.closePreiview();
          });
          it(`Verify Wrong Ans for "${item}-${index + 1} "`, () => {
            // Wrong ans should have red bg-color
            testReviewTab.previewQuestById(itemIds[index]);
            //testReviewTab.attemptQuestion(itemsInTest[index], attemptData[index], attemptTypes.WRONG);
            studentTestPage.attemptQuestion(itemsInTest[index].split(".")[0], attemptTypes.WRONG, attemptData[index]);
            testReviewTab.clickOnCheckAnsOnPreview();
            testReviewTab.verifyEvaluationScoreOnPreview(
              attemptData[index],
              points[index],
              itemsInTest[index],
              attemptTypes.WRONG
            );
            testReviewTab.verifyQuestionResponseCard(itemsInTest[index], attemptData[index], attemptTypes.WRONG);
            testReviewTab.closePreiview();
          });
        });
      });

      context("Verify Edit On Preview", () => {
        it(`Get Test Card-${testName} and Go-To Review`, () => {
          testLibraryPage.sidebar.clickOnTestLibrary();
          testLibraryPage.searchFilters.clearAll();
          testLibraryPage.searchFilters.getAuthoredByMe();
          testLibraryPage.clickOnTestCardById(OriginalTestId);
          testLibraryPage.clickOnDetailsOfCard();
          testLibraryPage.publishedToDraft();
        });
        itemsInTest.forEach((item, index) => {
          it(`Verify Edit for "${item}-${index + 1} "`, () => {
            testReviewTab.previewQuestById(itemIds[index]);
            testReviewTab.clickOnEditItemOnPreview();
            testReviewTab.verifyItemUrl(OriginalTestId, itemIds[index]);
            testReviewTab.editItem(EDITED_POINTS[index % 5]);
            points[index] = EDITED_POINTS[index % 5];
            editItemPage.header.save(true);
            testAddItemTab.header.clickOnReview();
            testLibraryPage.header.clickOnSaveButton(true);
            testReviewTab.verifyQustionById(itemIds[index]);
            testReviewTab.asesrtPointsByid(itemIds[index], points[index]);
          });
        });
        it("Verify Summary After Edit", () => {
          testReviewTab.verifySummary(points.length, points.reduce((a, b) => a + b, 0));
          testReviewTab.testheader.clickOnPublishButton();
        });
      });

      context("Verify Copy On Preivew", () => {
        it(`Get Test Card-${testName} and Go-To Review`, () => {
          testLibraryPage.sidebar.clickOnTestLibrary();
          testLibraryPage.searchFilters.clearAll();
          testLibraryPage.searchFilters.getAuthoredByMe();
          testLibraryPage.clickOnTestCardById(OriginalTestId);
          testLibraryPage.clickOnDetailsOfCard();
          testLibraryPage.publishedToDraft();
        });
        itemsInTest.forEach((item, index) => {
          it(`Verify Copy for "${item}-${index + 1} "`, () => {
            testReviewTab.previewQuestById(itemIds[index]);
            testReviewTab.clickOnCopyItemOnPreview();
            // Copy automatically include new item in test
            points.push(EDITED_POINTS[index % 5]);
            testReviewTab.editAndGetNewItemId(EDITED_POINTS[index % 5]).then(newItem => {
              itemIds.push(newItem);
              testReviewTab.verifyItemUrl(OriginalTestId, newItem);
              editItemPage.header.save(true);
              testAddItemTab.header.clickOnReview();
              testLibraryPage.header.clickOnSaveButton(true);
              testReviewTab.verifyQustionById(newItem);
              testReviewTab.verifyQustionById(itemIds[index]);
              testReviewTab.testheader.clickOnSaveButton(true);
            });
          });
        });
        //Verify summary again as more items are added....
        it("Verify Summary After Copy", () => {
          testReviewTab.verifySummary(points.length, points.reduce((a, b) => a + b, 0));
          testReviewTab.testheader.clickOnPublishButton();
        });
      });
    });
  });
});
