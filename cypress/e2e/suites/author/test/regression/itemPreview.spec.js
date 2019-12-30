import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage";
import TestReviewTab from "../../../../framework/author/tests/testDetail/testReviewTab";
import TestAddItemTab from "../../../../framework/author/tests/testDetail/testAddItemTab";
import StudentTestPage from "../../../../framework/student/studentTestPage";
import { attemptTypes } from "../../../../framework/constants/questionTypes";
import ItemListPage from "../../../../framework/author/itemList/itemListPage";
import MCQTrueFalsePage from "../../../../framework/author/itemList/questionType/mcq/mcqTrueFalsePage";
import PreviewItem from "../../../../framework/author/itemList/itemPreview";

const TEST = "TEST_PREVIEW";
const testData = require("../../../../../fixtures/testAuthoring");

const { itemKeys } = testData[TEST];
const itemsInTest = [];
itemKeys.forEach(ele => {
  itemsInTest.push(ele.split(".")[0]);
});
describe("Reviewing Test In Test Review Tab", () => {
  const testLibraryPage = new TestLibrary();
  const editItemPage = new EditItemPage();
  const studentTestPage = new StudentTestPage();
  const testReviewTab = new TestReviewTab();
  const testAddItemTab = new TestAddItemTab();
  const itemListPage = new ItemListPage();
  const mcqTrueFalsePage = new MCQTrueFalsePage();
  const itemPreview = new PreviewItem();

  const EDITED_POINTS = [5, 6, 7, 8, 9];

  let testId;
  let OriginalItemIds = [];
  let itemIds = [];
  let qType;
  let num;
  const questText = [];
  const points = [];
  const ans = [];
  const wrongAns = [];
  const questionType = [];
  const attemptData = [];

  before("Get Data Of test and its itemns", () => {
    cy.fixture("questionAuthoring").then(quesData => {
      itemKeys.forEach(element => {
        [qType, num] = element.split(".");
        questText.push(quesData[qType][num].quetext);
        questionType.push(qType);
        points.push(quesData[qType][num].setAns.points);
        ans.push(quesData[qType][num].setAns.correct);
        wrongAns.push(quesData[qType][num].attemptData.wrong);
        attemptData.push(quesData[qType][num].attemptData);
      });
    });
  });
  before("Login And Create Test", () => {
    cy.login();
    itemKeys.forEach((item, i) => {
      itemListPage.createItem(item, 0, true).then(id => {
        itemIds[i] = id;
      });
      OriginalItemIds = itemIds;
    });
  });
  context("Preview Test items-- Item bank", () => {
    context("Verify Show Ans On Preivew", () => {
      before(`Go-To Item Bank and get authored by me`, () => {
        testLibraryPage.sidebar.clickOnItemBank();
        itemListPage.searchFilters.clearAll();
        itemListPage.searchFilters.getAuthoredByMe();
      });
      itemsInTest.forEach((item, index) => {
        it(`Verify Show Ans for item No:${item} ${index + 1}`, () => {
          itemListPage.searchFilters.typeInSearchBox(itemIds[index]);
          itemListPage.clickOnViewItemById(itemIds[index], questText[index]);
          itemPreview.clickOnShowAnsOnPreview();
          itemPreview.verifyQuestionResponseCard(itemsInTest[index], attemptData[index], attemptTypes.RIGHT, true);
          itemPreview.closePreiview();
        });
      });
    });
    context("Verify Check Ans On Preivew", () => {
      before(`Go-To Item Bank and get authored by me`, () => {
        testLibraryPage.sidebar.clickOnTestLibrary();
        testLibraryPage.sidebar.clickOnItemBank();
        itemListPage.searchFilters.clearAll();
        itemListPage.searchFilters.getAuthoredByMe();
      });
      itemsInTest.forEach((item, index) => {
        it(`Verify Right Ans for Item No:${item} ${index + 1}`, () => {
          // Correct ans should have green bg-color
          itemListPage.searchFilters.typeInSearchBox(itemIds[index]);
          itemListPage.clickOnViewItemById(itemIds[index], questText[index]);
          // testReviewTab.attemptQuestion(itemsInTest[index], attemptData[index], attemptTypes.RIGHT);
          studentTestPage.attemptQuestion(item, attemptTypes.RIGHT, attemptData[index]);
          itemPreview.clickOnCheckAnsOnPreview();
          itemPreview.verifyEvaluationScoreOnPreview(
            attemptData[index],
            points[index],
            itemsInTest[index],
            attemptTypes.RIGHT
          );
          itemPreview.verifyQuestionResponseCard(itemsInTest[index], attemptData[index], attemptTypes.RIGHT);
          itemPreview.clickOnClear();
        });
        it(`Verify Wrong Ans for Item No:${item} ${index + 1}`, () => {
          // Wrong ans should have red bg-color
          studentTestPage.attemptQuestion(item, attemptTypes.WRONG, attemptData[index]);
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

    context("Verify Edit On Preview", () => {
      // For edit only one question type is considered

      before(`Go to Item Bank and Get Authored by me`, () => {
        testLibraryPage.sidebar.clickOnTestLibrary();
        testLibraryPage.sidebar.clickOnItemBank();
        itemListPage.searchFilters.clearAll();
        itemListPage.searchFilters.getAuthoredByMe();
      });

      it(`Verify Edit for Item`, () => {
        itemListPage.searchFilters.typeInSearchBox(itemIds[0]);
        itemListPage.clickOnViewItemById(itemIds[0], questText[0]);
        itemPreview.clickOnEditItemOnPreview();
        mcqTrueFalsePage.updatePoints(EDITED_POINTS[0]);
        itemListPage.getItemIdByURL().then(id => {
          expect(id).eq(itemIds[0]);
          // eslint-disable-next-line prefer-destructuring
          points[0] = EDITED_POINTS[0];
          editItemPage.header.save(true);
          editItemPage.header.clickOnPublishItem();
        });
      });

      it("Verify Items Edit", () => {
        testLibraryPage.sidebar.clickOnTestLibrary();
        testLibraryPage.sidebar.clickOnItemBank();
        itemListPage.searchFilters.clearAll();
        itemListPage.searchFilters.getAuthoredByMe();
        itemListPage.searchFilters.typeInSearchBox(itemIds[0]);
        itemListPage.clickOnViewItemById(itemIds[0], questText[0]);
        itemPreview.clickOnEditItemOnPreview();
        mcqTrueFalsePage.getPoints().should("have.value", points[0].toString());
        editItemPage.header.save(true);
        editItemPage.header.clickOnPublishItem();
      });
    });

    context("Verify Copy On Preivew", () => {
      // For copy only one question type is considered

      before(`Go To Item Bank and Get Authored by me`, () => {
        testLibraryPage.sidebar.clickOnTestLibrary();
        testLibraryPage.sidebar.clickOnItemBank();
        itemListPage.searchFilters.clearAll();
        itemListPage.searchFilters.getAuthoredByMe();
      });

      it(`Verify Copy for Item`, () => {
        itemListPage.searchFilters.typeInSearchBox(itemIds[0]);
        itemListPage.clickOnViewItemById(itemIds[0], questText[0]);
        itemPreview.clickOnCopyItemOnPreview();
        // Copy automatically include new item in test
        points.push(EDITED_POINTS[0]);
        mcqTrueFalsePage.updatePoints(EDITED_POINTS[0]);
        itemListPage.getItemIdByURL().then(newItem => {
          itemIds.push(newItem);
          expect(newItem).not.eq(itemIds[0]);
          cy.saveItemDetailToDelete(newItem);
          editItemPage.header.save(true);
          editItemPage.header.clickOnPublishItem();
        });
      });
      it("Verify Items After Copy", () => {
        testLibraryPage.sidebar.clickOnTestLibrary();
        testLibraryPage.sidebar.clickOnItemBank();
        itemListPage.searchFilters.clearAll();
        itemListPage.searchFilters.getAuthoredByMe();

        itemListPage.searchFilters.typeInSearchBox(itemIds[itemsInTest.length]);
        itemListPage.clickOnViewItemById(itemIds[itemsInTest.length], questText[0]);
        itemPreview.clickOnEditItemOnPreview();
        mcqTrueFalsePage.getPoints().should("have.value", points[0].toString());
        editItemPage.header.save(true);
        editItemPage.header.clickOnPublishItem();
        itemListPage.sidebar.clickOnTestLibrary();
      });
    });
    context("Verify Delete On Preivew", () => {
      before(`Go To Item Bank and Get Authored by me`, () => {
        testLibraryPage.sidebar.clickOnItemBank();
        itemListPage.searchFilters.clearAll();
        itemListPage.searchFilters.getAuthoredByMe();
      });

      it(`Verify Delete for Item No`, () => {
        itemListPage.searchFilters.typeInSearchBox(itemIds[itemsInTest.length]);
        itemListPage.clickOnViewItemById(itemIds[itemsInTest.length], questText[0]);
        itemPreview.clickOnDeleteOnPreview(false);
        itemPreview.closePreiview();
        itemListPage.searchFilters.typeInSearchBox(itemIds[itemsInTest.length]);
        itemListPage.getViewItemById(itemIds[itemsInTest.length]).should("not.be.visible");
      });
    });
  });
  context("Preview Test items-- Add Item Tab", () => {
    context("Verify Show Ans On Preivew", () => {
      before(`Create a Test`, () => {
        testLibraryPage.sidebar.clickOnTestLibrary();
        testLibraryPage.createTest("default").then(id => {
          testId = id;
        });
        itemIds.length = itemsInTest.length;
        itemIds = OriginalItemIds;
        cy.contains("Share");
      });
      before("Get Test and Go to Add-Items Tab", () => {
        testLibraryPage.sidebar.clickOnTestLibrary();
        testLibraryPage.searchFilters.clearAll();
        testLibraryPage.searchFilters.getAuthoredByMe();
        testLibraryPage.clickOnTestCardById(testId);
        testLibraryPage.clickOnDetailsOfCard();
        testLibraryPage.publishedToDraft();
        testReviewTab.testheader.clickOnAddItems();
        testAddItemTab.searchFilters.clearAll();
        testAddItemTab.searchFilters.getAuthoredByMe();
      });
      itemsInTest.forEach((item, index) => {
        it(`Verify Show Ans for Item NO:${item} ${index + 1}`, () => {
          testAddItemTab.searchFilters.typeInSearchBox(itemIds[index]);
          testAddItemTab.itemListPage.clickOnItemText();
          itemPreview.clickOnShowAnsOnPreview();
          itemPreview.verifyQuestionResponseCard(itemsInTest[index], attemptData[index], attemptTypes.RIGHT, true);
          itemPreview.closePreiview();
        });
      });
    });
    context("Verify Check Ans On Preivew", () => {
      itemsInTest.forEach((item, index) => {
        it(`Verify Right Ans for Item No:${item} ${index + 1}`, () => {
          // Correct ans should have green bg-color
          testAddItemTab.searchFilters.typeInSearchBox(itemIds[index]);
          itemListPage.clickOnItemText();
          studentTestPage.attemptQuestion(item, attemptTypes.RIGHT, attemptData[index]);
          itemPreview.clickOnCheckAnsOnPreview();
          itemPreview.verifyEvaluationScoreOnPreview(
            attemptData[index],
            points[index],
            itemsInTest[index],
            attemptTypes.RIGHT
          );
          itemPreview.verifyQuestionResponseCard(itemsInTest[index], attemptData[index], attemptTypes.RIGHT);
          itemPreview.clickOnClear();
        });
        it(`Verify Wrong Ans for Item No:${item} ${index + 1}`, () => {
          // Wrong ans should have red bg-color
          studentTestPage.attemptQuestion(item, attemptTypes.WRONG, attemptData[index]);
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

    context("Verify Edit On Preview", () => {
      // For edit only one question type is considered
      it(`Verify Edit for Item`, () => {
        testAddItemTab.searchFilters.clearAll();
        testAddItemTab.searchFilters.getAuthoredByMe();
        testAddItemTab.searchFilters.typeInSearchBox(itemIds[0]);
        testAddItemTab.itemListPage.clickOnItemText();
        itemPreview.clickOnEditItemOnPreview();
        itemPreview.verifyItemUrlWhileEdit(testId, itemIds[0]);
        itemPreview.editAndGetNewItemId(EDITED_POINTS[0]).then(itemId => {
          points[0] = EDITED_POINTS[0];
          expect(itemId).eq(itemIds[0]);
          editItemPage.header.save(true);
          testAddItemTab.header.clickOnReview();
          // testReviewTab.testheader.clickOnSaveButton(true);
          testReviewTab.verifyQustionById(itemIds[0]);
          testReviewTab.asesrtPointsByid(itemIds[0], points[0]);
          testReviewTab.testheader.clickOnAddItems();
        });
      });
    });

    context("Verify Copy On Preivew", () => {
      // For copy only one question type is considered

      it(`Verify Copy for Item`, () => {
        testAddItemTab.searchFilters.clearAll();
        testAddItemTab.searchFilters.getAuthoredByMe();
        testAddItemTab.searchFilters.typeInSearchBox(itemIds[0]);
        testAddItemTab.itemListPage.clickOnItemText();
        itemPreview.clickOnCopyItemOnPreview();
        // Copy automatically include new item in test
        points.push(EDITED_POINTS[0]);
        itemPreview.editAndGetNewItemId(EDITED_POINTS[0]).then(newItem => {
          // editItemPage.verifyItemIdsToBeNotEqual(newItem, itemIds[index]);
          expect(newItem).not.eq(itemIds[0]);
          cy.saveItemDetailToDelete(newItem);
          itemIds.push(newItem);
          itemPreview.verifyItemUrlWhileCopy(testId, newItem);
          editItemPage.header.save(true);
          testAddItemTab.header.clickOnReview();
          // testLibraryPage.header.clickOnSaveButton(true);
          testReviewTab.verifyQustionById(newItem);
          testReviewTab.verifyQustionById(itemIds[0]);
          testReviewTab.getPointsOnQueCardByid(newItem).should("have.value", `${EDITED_POINTS[0]}`);
          testReviewTab.testheader.clickOnSaveButton(true);
          testReviewTab.testheader.clickOnAddItems();
        });
      });
    });
    context("Verify Delete On Preivew", () => {
      before(`Go To Item Bank and Get Authored by me`, () => {
        itemListPage.searchFilters.clearAll();
        itemListPage.searchFilters.getAuthoredByMe();
      });
      it(`Verify Delete for Item`, () => {
        testAddItemTab.searchFilters.typeInSearchBox(itemIds[itemsInTest.length]);
        testAddItemTab.itemListPage.clickOnItemText();
        itemPreview.clickOnDeleteOnPreview(true);
        itemPreview.closePreiview();
        itemListPage.searchFilters.typeInSearchBox(itemIds[itemsInTest.length]);
        testAddItemTab.itemListPage.clickOnItemText();
        itemPreview.closePreiview();
      });
    });
  });
});
