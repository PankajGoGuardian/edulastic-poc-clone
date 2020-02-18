/* eslint-disable cypress/no-unnecessary-waiting */
/* eslint-disable prefer-const */
import TeacherSideBar from "../../../../framework/author/SideBarPage";
import SearchFilters from "../../../../framework/author/searchFiltersPage";
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import TestReviewTab from "../../../../framework/author/tests/testDetail/testReviewTab";
import ItemListPage from "../../../../framework/author/itemList/itemListPage";
import PreviewItemPopup from "../../../../framework/author/itemList/itemPreview";
import MCQTrueFalsePage from "../../../../framework/author/itemList/questionType/mcq/mcqTrueFalsePage";
import FileHelper from "../../../../framework/util/fileHelper";

const TEST = "LCB_2";
const testData = require("../../../../../fixtures/testAuthoring");

let ITEMS = testData[TEST].itemKeys;
let itemKeysInTest = [];
ITEMS.forEach(ele => {
  itemKeysInTest.push(ele.split(".")[0]);
});
const userData = require("../../../../../fixtures/users");

const { dist001, dist002 } = userData.itemSharingIndividual;

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >>item sharing`, () => {
  const techersidebar = new TeacherSideBar();
  const searchFilters = new SearchFilters();
  const testLibrary = new TestLibrary();
  const testReviewTab = new TestReviewTab();
  const itemListPage = new ItemListPage();
  const previewItem = new PreviewItemPopup();
  const mcqTrueFalsePage = new MCQTrueFalsePage();
  let Author;
  let itemIds;
  let DIST1_SCHOOL1;
  let DIST2_SCHOOL1;
  let DIST1_SCHOOL2;
  let test_id;
  const EMAIL = "email";
  const PASS = "pass";
  const NAME = "name";
  const SCHOOL1 = "school1";
  const SCHOOL2 = "school2";
  const TEACHER1 = "Teacher1";
  const TEACHER2 = "Teacher2";
  const TEACHER3 = "Teacher3";
  const DIST = "district";

  DIST1_SCHOOL1 = dist001[SCHOOL1];
  DIST1_SCHOOL2 = dist001[SCHOOL2];
  DIST2_SCHOOL1 = dist002[SCHOOL1];
  Author = DIST1_SCHOOL1[TEACHER1];

  // Permissions given to Tests are applied to items too
  context(`>item sharing with edit and viewonly-individually`, () => {
    context(">with giving edit permission-individual", () => {
      before(">login as author and creat test", () => {
        cy.login("teacher", Author[EMAIL], Author[PASS]);
        testLibrary.createTest(TEST, true).then(id => {
          test_id = id;
          itemIds = testLibrary.items;
        });
      });
      before(">publish and share the published test", () => {
        techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        searchFilters.getAuthoredByMe();
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.clickOnDetailsOfCard();
        testLibrary.header.clickOnShare();
        testLibrary.selectPeopletoshare(DIST1_SCHOOL1[TEACHER2][EMAIL], true);
        cy.wait(2000);
      });
      it(">assert the shared test-published ", () => {
        cy.login("teacher", DIST1_SCHOOL1[TEACHER2][EMAIL], DIST1_SCHOOL1[TEACHER2][PASS]);
        testLibrary.sidebar.clickOnItemBank();
        itemListPage.searchFilters.clearAll();
        itemListPage.searchFilters.sharedWithMe();
        itemKeysInTest.forEach((item, index) => {
          itemListPage.searchFilters.typeInSearchBox(itemIds[index]);
          itemListPage.verifyPresenceOfItemById(itemIds[index]);
          itemListPage.clickOnViewItemById(itemIds[index]);
          previewItem.verifyEditOption(itemIds[index]);
          previewItem.clickEditOnPreview();
          mcqTrueFalsePage.updatePoints("10");
          mcqTrueFalsePage.header.saveAndgetId(true).then(id => {
            expect(id).eq(itemIds[index]);
            mcqTrueFalsePage.header.clickOnPublishItem();
          });
        });
      });
      it(">verify change", () => {
        cy.login("teacher", Author[EMAIL], Author[PASS]);
        testLibrary.sidebar.clickOnItemBank();
        itemListPage.searchFilters.clearAll();
        itemListPage.searchFilters.getAuthoredByMe();
        itemKeysInTest.forEach((item, index) => {
          itemListPage.searchFilters.typeInSearchBox(itemIds[index]);
          itemListPage.clickOnViewItemById(itemIds[index]);
          previewItem.clickOnEditItemOnPreview();
          mcqTrueFalsePage.getPoints().should("have.value", "10");
          mcqTrueFalsePage.header.save(true);
          mcqTrueFalsePage.header.clickOnPublishItem();
        });
      });
      it(">remove share-published", () => {
        techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        searchFilters.getAuthoredByMe();
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.clickOnDetailsOfCard();
        testReviewTab.testheader.clickOnShare();
        testLibrary.removeShare();
      });
      it(">assert remove share-published-entire library", () => {
        cy.login("teacher", DIST1_SCHOOL1[TEACHER2][EMAIL], DIST1_SCHOOL1[TEACHER2][PASS]);
        testLibrary.sidebar.clickOnItemBank();
        itemListPage.searchFilters.clearAll();
        // itemListPage.searchFilters.sharedWithMe();
        itemKeysInTest.forEach((item, index) => {
          itemListPage.searchFilters.typeInSearchBox(itemIds[index]);
          itemListPage.verifyPresenceOfItemById(itemIds[index]);
        });
      });
      it(">assert remove share-published-shared with me", () => {
        // cy.login("teacher", DIST1_SCHOOL1[TEACHER2][EMAIL], DIST1_SCHOOL1[TEACHER2][PASS]);
        // testLibrary.sidebar.clickOnItemBank();
        itemListPage.searchFilters.clearAll();
        itemListPage.searchFilters.sharedWithMe();
        itemKeysInTest.forEach((item, index) => {
          itemListPage.searchFilters.typeInSearchBox(itemIds[index]);
          itemListPage.verifyPresenceOfItemById(itemIds[index]);
        });
      });
    });
    context(">without giving edit permission-individual", () => {
      let clonedItem = [];
      before(">login as author and creat test without publishing", () => {
        cy.login("teacher", Author[EMAIL], Author[PASS]);
        testLibrary.createTest(TEST, true).then(id => {
          test_id = id;
          itemIds = testLibrary.items;
        });
      });
      before(">share the published test", () => {
        techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        searchFilters.getAuthoredByMe();
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.clickOnDetailsOfCard();
        testLibrary.header.clickOnShare();
        testLibrary.selectPeopletoshare(DIST1_SCHOOL1[TEACHER2][EMAIL], false);
        cy.wait(2000);
      });
      it(">assert the shared test-published ", () => {
        cy.login("teacher", DIST1_SCHOOL1[TEACHER2][EMAIL], DIST1_SCHOOL1[TEACHER2][PASS]);
        testLibrary.sidebar.clickOnItemBank();
        itemListPage.searchFilters.clearAll();
        itemListPage.searchFilters.sharedWithMe();
        itemKeysInTest.forEach((item, index) => {
          itemListPage.searchFilters.typeInSearchBox(itemIds[index]);
          itemListPage.verifyPresenceOfItemById(itemIds[index]);
          itemListPage.clickOnViewItemById(itemIds[index]);
          previewItem.verifyNoEditCloneOption(itemIds[index]);
          previewItem.clickOnCopyItemOnPreview();
          mcqTrueFalsePage.updatePoints("15");
          mcqTrueFalsePage.header.saveAndgetId(true).then(id => {
            expect(id).not.eq(itemIds[index]);
            clonedItem[index] = id;
            cy.saveItemDetailToDelete(id);
          });
          mcqTrueFalsePage.header.clickOnPublishItem();
        });
      });
      it(">verify presence of cloned item", () => {
        itemListPage.searchFilters.clearAll();
        clonedItem.forEach(cloned => {
          itemListPage.searchFilters.typeInSearchBox(cloned);
          itemListPage.verifyPresenceOfItemById(cloned);
          itemListPage.getViewItemById(cloned).should("exist");
        });
      });
      it(">verify change at author side", () => {
        cy.login("teacher", Author[EMAIL], Author[PASS]);
        testLibrary.sidebar.clickOnItemBank();
        itemListPage.searchFilters.clearAll();
        itemListPage.searchFilters.getAuthoredByMe();
        itemKeysInTest.forEach((item, index) => {
          itemListPage.searchFilters.typeInSearchBox(itemIds[index]);
          itemListPage.clickOnViewItemById(itemIds[index]);
          previewItem.clickOnEditItemOnPreview();
          mcqTrueFalsePage.getPoints().should("not.contain.value", "15");
          mcqTrueFalsePage.header.save(true);
          mcqTrueFalsePage.header.clickOnPublishItem();
        });
      });
      it(">remove share-published", () => {
        techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        searchFilters.getAuthoredByMe();
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.clickOnDetailsOfCard();
        testLibrary.header.clickOnShare();
        testLibrary.removeShare();
      });
      it(">assert remove share-published-entire library", () => {
        cy.login("teacher", DIST1_SCHOOL1[TEACHER2][EMAIL], DIST1_SCHOOL1[TEACHER2][PASS]);
        testLibrary.sidebar.clickOnItemBank();
        itemListPage.searchFilters.clearAll();
        itemKeysInTest.forEach((item, index) => {
          itemListPage.searchFilters.typeInSearchBox(itemIds[index]);
          itemListPage.verifyPresenceOfItemById(itemIds[index]);
        });
      });
      it(">assert remove share-published-shared with me", () => {
        // cy.login("teacher", DIST1_SCHOOL1[TEACHER2][EMAIL], DIST1_SCHOOL1[TEACHER2][PASS]);
        // testLibrary.sidebar.clickOnItemBank();
        itemListPage.searchFilters.clearAll();
        itemListPage.searchFilters.sharedWithMe();
        itemKeysInTest.forEach((item, index) => {
          itemListPage.searchFilters.typeInSearchBox(itemIds[index]);
          itemListPage.verifyPresenceOfItemById(itemIds[index]);
        });
      });
    });
    context(">without giving edit permission-individual-user from other district", () => {
      let clonedItem = [];
      before(">login as author and creat test without publishing", () => {
        cy.login("teacher", Author[EMAIL], Author[PASS]);
        testLibrary.createTest(TEST, true).then(id => {
          test_id = id;
          itemIds = testLibrary.items;
        });
      });
      before(">publish and share the published test", () => {
        techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        searchFilters.getAuthoredByMe();
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.clickOnDetailsOfCard();
        testLibrary.header.clickOnShare();
        testLibrary.selectPeopletoshare(DIST2_SCHOOL1[TEACHER1][EMAIL], false, false);
        cy.wait(2000);
      });
      it(">assert the shared test-published ", () => {
        cy.login("teacher", DIST2_SCHOOL1[TEACHER1][EMAIL], DIST2_SCHOOL1[TEACHER1][PASS]);
        testLibrary.sidebar.clickOnItemBank();
        itemListPage.searchFilters.clearAll();
        itemListPage.searchFilters.sharedWithMe();
        itemKeysInTest.forEach((item, index) => {
          itemListPage.searchFilters.typeInSearchBox(itemIds[index]);
          itemListPage.verifyPresenceOfItemById(itemIds[index]);
          itemListPage.clickOnViewItemById(itemIds[index]);
          previewItem.verifyNoEditCloneOption(itemIds[index]);
          previewItem.clickOnCopyItemOnPreview();
          mcqTrueFalsePage.updatePoints("15");
          mcqTrueFalsePage.header.saveAndgetId(true).then(id => {
            expect(id).not.eq(itemIds[index]);
            clonedItem.push(id);
            cy.saveItemDetailToDelete(id);
          });
          mcqTrueFalsePage.header.clickOnPublishItem();
        });
      });
      it(">verify presence of cloned item", () => {
        itemListPage.searchFilters.clearAll();
        clonedItem.forEach(cloned => {
          itemListPage.searchFilters.typeInSearchBox(cloned);
          itemListPage.verifyPresenceOfItemById(cloned);
          itemListPage.getViewItemById(cloned).should("exist");
        });
        clonedItem.length = 0;
      });
      it(">verify change at author side", () => {
        cy.login("teacher", Author[EMAIL], Author[PASS]);
        testLibrary.sidebar.clickOnItemBank();
        itemListPage.searchFilters.clearAll();
        itemListPage.searchFilters.getAuthoredByMe();
        itemKeysInTest.forEach((item, index) => {
          itemListPage.searchFilters.typeInSearchBox(itemIds[index]);
          itemListPage.clickOnViewItemById(itemIds[index]);
          previewItem.clickOnEditItemOnPreview();
          mcqTrueFalsePage.getPoints().should("not.contain.value", "15");
          mcqTrueFalsePage.header.save(true);
          mcqTrueFalsePage.header.clickOnPublishItem();
        });
      });
      it(">remove share-published", () => {
        techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        searchFilters.getAuthoredByMe();
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.clickOnDetailsOfCard();
        testLibrary.header.clickOnShare();
        testLibrary.removeShare();
      });
      it(">assert remove share-entire library", () => {
        cy.login("teacher", DIST1_SCHOOL1[TEACHER2][EMAIL], DIST1_SCHOOL1[TEACHER2][PASS]);
        testLibrary.sidebar.clickOnItemBank();
        itemListPage.searchFilters.clearAll();
        //  itemListPage.searchFilters.sharedWithMe();
        itemKeysInTest.forEach((item, index) => {
          itemListPage.searchFilters.typeInSearchBox(itemIds[index]);
          itemListPage.verifyPresenceOfItemById(itemIds[index]);
        });
      });
      it(">assert remove share-published-shared with me", () => {
        // cy.login("teacher", DIST1_SCHOOL1[TEACHER2][EMAIL], DIST1_SCHOOL1[TEACHER2][PASS]);
        // testLibrary.sidebar.clickOnItemBank();
        itemListPage.searchFilters.clearAll();
        itemListPage.searchFilters.sharedWithMe();
        itemKeysInTest.forEach((item, index) => {
          itemListPage.searchFilters.typeInSearchBox(itemIds[index]);
          itemListPage.verifyPresenceOfItemById(itemIds[index]);
        });
      });
    });

    context(">multi-share-individual", () => {
      let clonedItem = [];
      before(">login as author and creat test without publishing", () => {
        cy.login("teacher", Author[EMAIL], Author[PASS]);
        testLibrary.createTest(TEST, true).then(id => {
          test_id = id;
          itemIds = testLibrary.items;
        });
      });
      before(">share to multiple people", () => {
        cy.login("teacher", Author[EMAIL], Author[PASS]);
        techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        searchFilters.getAuthoredByMe();
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.clickOnDetailsOfCard();
        testLibrary.header.clickOnShare();
        testLibrary.selectPeopletoshare(DIST1_SCHOOL1[TEACHER2][EMAIL], false);
        testLibrary.selectPeopletoshare(DIST1_SCHOOL1[TEACHER3][EMAIL], true);
        /* Proceeding without updating sharing- it should be updated automatically i.e. published or draft */
      });
      it(">assert the shared test-items for first person", () => {
        cy.login("teacher", DIST1_SCHOOL1[TEACHER2][EMAIL], DIST1_SCHOOL1[TEACHER2][PASS]);
        testLibrary.sidebar.clickOnItemBank();
        itemListPage.searchFilters.clearAll();
        itemListPage.searchFilters.sharedWithMe();
        itemKeysInTest.forEach((item, index) => {
          itemListPage.searchFilters.typeInSearchBox(itemIds[index]);
          itemListPage.verifyPresenceOfItemById(itemIds[index]);
          itemListPage.clickOnViewItemById(itemIds[index]);
          previewItem.verifyNoEditCloneOption(itemIds[index]);
          previewItem.clickOnCopyItemOnPreview();
          mcqTrueFalsePage.updatePoints("5");
          mcqTrueFalsePage.header.saveAndgetId(true).then(id => {
            expect(id).not.eq(itemIds[index]);
            cy.saveItemDetailToDelete(id);
            clonedItem.push(id);
            mcqTrueFalsePage.header.clickOnPublishItem();
          });
        });
      });
      it(">verify presence of cloned item", () => {
        itemListPage.searchFilters.clearAll();
        clonedItem.forEach(cloned => {
          itemListPage.searchFilters.typeInSearchBox(cloned);
          itemListPage.verifyPresenceOfItemById(cloned);
          itemListPage.getViewItemById(cloned).should("exist");
        });
      });
      it(">assert the shared test-items for second person", () => {
        cy.login("teacher", DIST1_SCHOOL1[TEACHER3][EMAIL], DIST1_SCHOOL1[TEACHER2][PASS]);
        testLibrary.sidebar.clickOnItemBank();
        itemListPage.searchFilters.clearAll();
        itemListPage.searchFilters.sharedWithMe();
        itemKeysInTest.forEach((item, index) => {
          itemListPage.searchFilters.typeInSearchBox(itemIds[index]);
          itemListPage.verifyPresenceOfItemById(itemIds[index]);
          itemListPage.clickOnViewItemById(itemIds[index]);
          previewItem.verifyEditOption(itemIds[index]);
          previewItem.clickEditOnPreview();
          mcqTrueFalsePage.updatePoints("20");
          mcqTrueFalsePage.header.saveAndgetId(true).then(id => {
            expect(id).eq(itemIds[index]);
            mcqTrueFalsePage.header.clickOnPublishItem();
          });
        });
      });
      it(">verify change", () => {
        cy.login("teacher", Author[EMAIL], Author[PASS]);
        testLibrary.sidebar.clickOnItemBank();
        itemListPage.searchFilters.clearAll();
        itemListPage.searchFilters.getAuthoredByMe();
        itemKeysInTest.forEach((item, index) => {
          itemListPage.searchFilters.typeInSearchBox(itemIds[index]);
          itemListPage.clickOnViewItemById(itemIds[index]);
          previewItem.clickOnEditItemOnPreview();
          mcqTrueFalsePage.getPoints().should("have.value", "20");
          mcqTrueFalsePage.header.save(true);
          mcqTrueFalsePage.header.clickOnPublishItem();
        });
      });
      it(">remove share-published", () => {
        techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        searchFilters.getAuthoredByMe();
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.clickOnDetailsOfCard();
        testLibrary.header.clickOnShare();
        testLibrary.removeShare();
        testLibrary.removeShare();
      });
    });
  });
});
