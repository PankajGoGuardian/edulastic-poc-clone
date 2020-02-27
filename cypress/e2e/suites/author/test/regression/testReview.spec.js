import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage";
import TestReviewTab from "../../../../framework/author/tests/testDetail/testReviewTab";
import TestAddItemTab from "../../../../framework/author/tests/testDetail/testAddItemTab";
import StudentTestPage from "../../../../framework/student/studentTestPage";
import { attemptTypes } from "../../../../framework/constants/questionTypes";
import PreviewItemPopup from "../../../../framework/author/itemList/itemPreview";
import MCQTrueFalsePage from "../../../../framework/author/itemList/questionType/mcq/mcqTrueFalsePage";
import FileHelper from "../../../../framework/util/fileHelper";

const TEST = "TEST_PREVIEW";
const testData = require("../../../../../fixtures/testAuthoring");

const testName = testData[TEST].name;
const ITEMS = testData[TEST].itemKeys;
const grades = testData[TEST].grade;
const subjects = testData[TEST].subject;
const itemsInTest = [];
ITEMS.forEach(ele => {
  itemsInTest.push(ele.split(".")[0]);
});
describe(`${FileHelper.getSpecName(Cypress.spec.name)} >>Reviewing Test In Test Review Tab`, () => {
  const testLibraryPage = new TestLibrary();
  const editItemPage = new EditItemPage();
  const studentTestPage = new StudentTestPage();
  const testReviewTab = new TestReviewTab();
  const testAddItemTab = new TestAddItemTab();
  const itemPreview = new PreviewItemPopup();
  const mcqTrueFalsePage = new MCQTrueFalsePage();

  const EDITED_POINTS = [5, 6, 7, 8, 9];

  let OriginalTestId;
  let itemIds;
  let qType;
  let num;
  const questText = [];
  const points = [];
  const ans = [];
  const wrongAns = [];
  const questionType = [];
  const attemptData = [];

  before(">get data of test and its items", () => {
    cy.fixture("questionAuthoring").then(quesData => {
      ITEMS.forEach(element => {
        [qType, num] = element.split(".");
        if (Array.isArray(quesData[qType][num].quetext)) {
          questText.push(quesData[qType][num].quetext[0]);
        } else questText.push(quesData[qType][num].quetext[0]);
        questionType.push(qType);
        points.push(quesData[qType][num].setAns.points);
        ans.push(quesData[qType][num].setAns.correct);
        wrongAns.push(quesData[qType][num].attemptData.wrong);
        attemptData.push(quesData[qType][num].attemptData);
      });
    });
  });
  before(">login and create test", () => {
    cy.login("teacher", "teacher.test.review@snapwiz.com", "snapwiz");
    testLibraryPage.createTest(TEST).then(id => {
      OriginalTestId = id;
      itemIds = testLibraryPage.items;
    });
  });

  context(">review test in different parts of review tab", () => {
    context(">verifying items in expanded and collapsed rows,", () => {
      it(`>get test card-${testName} and go-to review`, () => {
        testLibraryPage.seachTestAndGotoReviewById(OriginalTestId);
      });
      itemsInTest.forEach((item, index) => {
        it(`verify  ${item}-${index + 1}in the review tabs-collapsed mode`, () => {
          // Verify All questions' presence
          testReviewTab.verifyQustionById(itemIds[index]);
          testReviewTab.asesrtPointsByid(itemIds[index], points[index]);
        });

        it(`verify  ${item}-${index + 1} in the review tabs-expanded mode`, () => {
          testReviewTab.clickOnExpandCollapseRow();
          // Verify All questions' presence along with thier correct answers and points
          testReviewTab.verifyQustionById(itemIds[index]);
          attemptData[index].item = itemIds[index];
          itemPreview.verifyQuestionResponseCard(itemsInTest[index], attemptData[index], attemptTypes.RIGHT, true);
          testReviewTab.asesrtPointsByid(itemIds[index], points[index]);
          testReviewTab.clickOnExpandCollapseRow();
        });
      });
    });
    it(">verify test summary in review tab", () => {
      testLibraryPage.seachTestAndGotoReviewById(OriginalTestId);
      // Verify Test in summary panel
      testReviewTab.verifySummary(points.length, points.reduce((a, b) => a + b, 0));
      subjects.forEach((sub, index) => {
        testReviewTab.verifyGradeSubject(grades[index], sub);
      });
    });

    it(">verify test in- view as student", () => {
      testLibraryPage.seachTestAndGotoReviewById(OriginalTestId);
      testReviewTab.clickOnViewAsStudent();
      studentTestPage.verifyNoOfQuestions(itemIds.length);
      studentTestPage.getQuestionByIndex(0);
      itemIds.forEach((val, index) => {
        // studentTestPage.verifyQuestionText(index, questText[index]);
        studentTestPage.attemptQuestion(itemsInTest[index], attemptTypes.RIGHT, attemptData[index]);
        studentTestPage.clickOnNext(true);
      });
      studentTestPage.clickOnExitTest(true);
    });
    it(">verify test-items order using move-to option", () => {
      testLibraryPage.seachTestAndGotoReviewById(OriginalTestId);
      testLibraryPage.publishedToDraft();
      itemIds.forEach((item, index, totalItems) => {
        testReviewTab.clickOnCheckBoxByItemId(item);
        // Move question at last-- totalItems.length
        testReviewTab.moveQuestionByIndex(totalItems.length);
        // Item should be at last-- totalItems.length
        testReviewTab.verifyMovedQuestionById(item, totalItems.length);
        testReviewTab.clickOnCheckBoxByItemId(item);
      });
      testReviewTab.testheader.clickOnPublishButton();
    });
    context(">preview test items", () => {
      context(">verify show ans on preivew", () => {
        it(`Get Test Card-"${testName}" and Go-To Review`, () => {
          testLibraryPage.seachTestAndGotoReviewById(OriginalTestId);
        });
        itemsInTest.forEach((item, index) => {
          it(`>verify show ans for "${item}-${index + 1} "`, () => {
            testReviewTab.previewQuestById(itemIds[index]);
            itemPreview.clickOnShowAnsOnPreview();
            itemPreview.verifyQuestionResponseCard(itemsInTest[index], attemptData[index], attemptTypes.RIGHT, true);
            itemPreview.closePreiview();
          });
        });
      });
      context(">verify check ans on preivew", () => {
        it(`Get Test Card-${testName} and Go-To Review`, () => {
          testLibraryPage.seachTestAndGotoReviewById(OriginalTestId);
        });
        itemsInTest.forEach((item, index) => {
          it(`>verify right ans for "${item}-${index + 1} "`, () => {
            // Correct ans should have green bg-color
            testReviewTab.previewQuestById(itemIds[index]);
            // testReviewTab.attemptQuestion(itemsInTest[index], attemptData[index], attemptTypes.RIGHT);
            studentTestPage.attemptQuestion(itemsInTest[index].split(".")[0], attemptTypes.RIGHT, attemptData[index]);
            itemPreview.clickOnCheckAnsOnPreview();
            itemPreview.verifyEvaluationScoreOnPreview(
              attemptData[index],
              points[index],
              itemsInTest[index],
              attemptTypes.RIGHT
            );
            itemPreview.verifyQuestionResponseCard(itemsInTest[index], attemptData[index], attemptTypes.RIGHT);
            itemPreview.closePreiview();
          });
          it(`>verify wrong ans for "${item}-${index + 1} "`, () => {
            // Wrong ans should have red bg-color
            testReviewTab.previewQuestById(itemIds[index]);
            // testReviewTab.attemptQuestion(itemsInTest[index], attemptData[index], attemptTypes.WRONG);
            studentTestPage.attemptQuestion(itemsInTest[index].split(".")[0], attemptTypes.WRONG, attemptData[index]);
            itemPreview.clickOnCheckAnsOnPreview();
            itemPreview.verifyEvaluationScoreOnPreview(
              attemptData[index],
              points[index],
              itemsInTest[index],
              attemptTypes.WRONG
            );
            itemPreview.verifyQuestionResponseCard(itemsInTest[index], attemptData[index], attemptTypes.WRONG);
            itemPreview.closePreiview();
          });
        });
      });

      context(">verify edit on preview", () => {
        it(`>get test card-${testName} and go-to review`, () => {
          testLibraryPage.seachTestAndGotoReviewById(OriginalTestId);
          testLibraryPage.publishedToDraft();
        });

        it(`>verify edit`, () => {
          testReviewTab.previewQuestById(itemIds[0]);
          itemPreview.clickEditOnPreview();
          mcqTrueFalsePage.updatePoints(EDITED_POINTS[3]);
          points[0] = EDITED_POINTS[3];
          testLibraryPage.searchFilters.routeSearch();
          editItemPage.header.saveAndgetId(true).then(itemId => {
            expect(itemId).eq(itemIds[0]);
            testLibraryPage.searchFilters.waitForSearchResponse();
            testAddItemTab.header.clickOnReview();
            testReviewTab.verifyQustionById(itemIds[0]);
            testReviewTab.asesrtPointsByid(itemIds[0], points[0]);
          });
        });
        it(">verify summary after edit", () => {
          testReviewTab.verifySummary(points.length, points.reduce((a, b) => a + b, 0));
          testReviewTab.testheader.clickOnPublishButton();
        });
      });

      context(">verify copy on preivew", () => {
        it(`Get Test Card-${testName} and Go-To Review`, () => {
          testLibraryPage.seachTestAndGotoReviewById(OriginalTestId);
          testLibraryPage.publishedToDraft();
        });

        it(`>verify copy for`, () => {
          testReviewTab.previewQuestById(itemIds[1]);
          itemPreview.clickOnCopyItemOnPreview();
          // Copy automatically include new item in test
          points.push(EDITED_POINTS[1]);
          mcqTrueFalsePage.updatePoints(EDITED_POINTS[1]);
          testLibraryPage.searchFilters.routeSearch();
          editItemPage.header.saveAndgetId(true).then(newItem => {
            expect(newItem).not.eq(itemIds[1]);
            testLibraryPage.searchFilters.waitForSearchResponse();
            cy.saveItemDetailToDelete(newItem);
            itemIds.push(newItem);
            testAddItemTab.header.clickOnReview();
            testReviewTab.verifyQustionById(newItem);
            testReviewTab.verifyQustionById(itemIds[1]);
          });
        });
        // Verify summary again as more items are added....
        it(">verify summary after copy", () => {
          testReviewTab.verifySummary(points.length, points.reduce((a, b) => a + b, 0));
          testReviewTab.testheader.clickOnPublishButton();
        });
      });
    });
  });
});
