/* eslint-disable cypress/no-unnecessary-waiting */
/* eslint-disable prefer-const */
import TeacherSideBar from "../../../../framework/author/SideBarPage";
import SearchFilters from "../../../../framework/author/searchFiltersPage";
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
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

const { dist0001, dist0002 } = userData.itemSharingLevels;

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >>item sharing using published test`, () => {
  const techersidebar = new TeacherSideBar();
  const searchFilters = new SearchFilters();
  const testLibrary = new TestLibrary();
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

  DIST1_SCHOOL1 = dist0001[SCHOOL1];
  DIST1_SCHOOL2 = dist0001[SCHOOL2];
  DIST2_SCHOOL1 = dist0002[SCHOOL1];
  Author = DIST1_SCHOOL1[TEACHER1];

  // Permissions given to Tests are applied to items too
  context(">sharing school,district and public levels", () => {
    before(">login as author and creat test", () => {
      cy.login("teacher", Author[EMAIL], Author[PASS]);
      testLibrary.createTest(TEST, true).then(id => {
        test_id = id;
        itemIds = testLibrary.items;
      });
    });
    context(">sharing at 'school level'", () => {
      let clonedItem = [];

      before(">login as author and creat test without publishing", () => {
        cy.login("teacher", Author[EMAIL], Author[PASS]);
      });
      before(">share the test", () => {
        techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        searchFilters.getAuthoredByMe();
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.clickOnDetailsOfCard();
        testLibrary.header.clickOnShare();
        testLibrary.getSchoolRadio().click({ force: true });
        testLibrary.clickSharePop();
      });
      it(`>assert shared test item for '${
        DIST1_SCHOOL1[TEACHER2][NAME]
      } from same school' and 'clone' the item`, () => {
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
            clonedItem.push(id);
            cy.saveItemDetailToDelete(id);
            mcqTrueFalsePage.header.clickOnPublishItem();
          });
        });
      });
      it(">verify presence of 'cloned item'", () => {
        expect(clonedItem, `expected clone to happen successfully`).to.have.lengthOf(1);
        itemListPage.searchFilters.clearAll();
        clonedItem.forEach(cloned => {
          itemListPage.searchFilters.typeInSearchBox(cloned);
          itemListPage.verifyPresenceOfItemById(cloned);
          itemListPage.getViewItemById(cloned).should("exist");
        });
        clonedItem.length = 0;
      });
    });

    /* https://snapwiz.atlassian.net/browse/EV-13434
     context(">school- remove share", () => {
      let clonedItem = [];

      before("Login", () => {
        cy.login("teacher", Author[EMAIL], Author[PASS]);
      });
      it(">verify change", () => {
        testLibrary.sidebar.clickOnItemBank();
        itemListPage.searchFilters.clearAll();
        itemListPage.searchFilters.getAuthoredByMe();
        itemKeysInTest.forEach((item, index) => {
          itemListPage.searchFilters.typeInSearchBox(itemIds[index]);
          itemListPage.clickOnViewItemById(itemIds[index]);
          previewItem.clickOnEditItemOnPreview();
          mcqTrueFalsePage.getPoints().should("have.value", "2");
          mcqTrueFalsePage.header.save(true);
          mcqTrueFalsePage.header.clickOnPublishItem();
        });
      });
      it(">removesharing with school", () => {
        techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        searchFilters.getAuthoredByMe();
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.clickOnDetailsOfCard();
        testLibrary.header.clickOnShare();
        testLibrary.removeShare("School");
      });
      it(`>for ${DIST1_SCHOOL1[TEACHER2][NAME]} from same school- entire library`, () => {
        cy.login("teacher", DIST1_SCHOOL1[TEACHER2][EMAIL], DIST1_SCHOOL1[TEACHER2][PASS]);
        testLibrary.sidebar.clickOnItemBank();
        itemListPage.searchFilters.clearAll();
        // itemListPage.searchFilters.sharedWithMe();
        itemKeysInTest.forEach((item, index) => {
          itemListPage.searchFilters.typeInSearchBox(itemIds[index]);
          itemListPage.verifyPresenceOfItemById(itemIds[index]);
        });
      });
      it(`>for ${DIST1_SCHOOL1[TEACHER2][NAME]} from same school- shared with me`, () => {
        // cy.login("teacher", DIST1_SCHOOL1[TEACHER2][EMAIL], DIST1_SCHOOL1[TEACHER2][PASS]);
        // testLibrary.sidebar.clickOnItemBank();
        itemListPage.searchFilters.clearAll();
        itemListPage.searchFilters.sharedWithMe();
        itemKeysInTest.forEach((item, index) => {
          itemListPage.searchFilters.typeInSearchBox(itemIds[index]);
          itemListPage.verifyPresenceOfItemById(itemIds[index]);
        });
      });
    }); */

    context(">sharing at 'district level'", () => {
      let clonedItem = [];

      before(">login as author and creat test without publishing", () => {
        cy.login("teacher", Author[EMAIL], Author[PASS]);
      });

      before(">sharing at district level", () => {
        techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        searchFilters.getAuthoredByMe();
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.clickOnDetailsOfCard();
        testLibrary.header.clickOnShare();
        testLibrary.removeShare();
        testLibrary.getDistrictRadio().click({ force: true });
        testLibrary.clickSharePop();
      });

      it(`>assert shared test item for '${
        DIST1_SCHOOL2[TEACHER1][NAME]
      } from other school' and 'clone' the item`, () => {
        // Verify sharing for techer from different school but from same district
        cy.login("teacher", DIST1_SCHOOL2[TEACHER2][EMAIL], DIST1_SCHOOL2[TEACHER2][PASS]);
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
            cy.saveItemDetailToDelete(id);
            clonedItem.push(id);
            mcqTrueFalsePage.header.clickOnPublishItem();
          });
        });
      });
      it(">verify presence of 'cloned item'", () => {
        expect(clonedItem, `expected clone to happen successfully`).to.have.lengthOf(1);
        itemListPage.searchFilters.clearAll();
        clonedItem.forEach(cloned => {
          itemListPage.searchFilters.typeInSearchBox(cloned);
          itemListPage.verifyPresenceOfItemById(cloned);
          itemListPage.getViewItemById(cloned).should("exist");
        });
        clonedItem.length = 0;
      });
    });

    /* https://snapwiz.atlassian.net/browse/EV-13434
     context(">district- remove share", () => {
      let clonedItem = [];

      before("Login", () => {
        cy.login("teacher", Author[EMAIL], Author[PASS]);
      });
      it(">verify change", () => {
        testLibrary.sidebar.clickOnItemBank();
        itemListPage.searchFilters.clearAll();
        itemListPage.searchFilters.getAuthoredByMe();
        itemKeysInTest.forEach((item, index) => {
          itemListPage.searchFilters.typeInSearchBox(itemIds[index]);
          itemListPage.clickOnViewItemById(itemIds[index]);
          previewItem.clickOnEditItemOnPreview();
          mcqTrueFalsePage.getPoints().should("have.value", "2");
          mcqTrueFalsePage.header.save(true);
          mcqTrueFalsePage.header.clickOnPublishItem();
        });
      });
      it(">remove-sharing with district", () => {
        techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        searchFilters.getAuthoredByMe();
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.clickOnDetailsOfCard();
        testLibrary.header.clickOnShare();
        testLibrary.removeShare(Author[DIST]);
      });
      it(`>for ${DIST1_SCHOOL2[TEACHER1][NAME]} from other school-entire library`, () => {
        cy.login("teacher", DIST1_SCHOOL2[TEACHER2][EMAIL], DIST1_SCHOOL2[TEACHER2][PASS]);
        testLibrary.sidebar.clickOnItemBank();
        itemListPage.searchFilters.clearAll();
        // itemListPage.searchFilters.sharedWithMe();
        itemKeysInTest.forEach((item, index) => {
          itemListPage.searchFilters.typeInSearchBox(itemIds[index]);
          itemListPage.verifyPresenceOfItemById(itemIds[index]);
        });
      });
      it(`>for ${DIST1_SCHOOL2[TEACHER1][NAME]} from other school-shared with me`, () => {
        // cy.login("teacher", DIST1_SCHOOL1[TEACHER2][EMAIL], DIST1_SCHOOL1[TEACHER2][PASS]);
        // testLibrary.sidebar.clickOnItemBank();
        itemListPage.searchFilters.clearAll();
        itemListPage.searchFilters.sharedWithMe();
        itemKeysInTest.forEach((item, index) => {
          itemListPage.searchFilters.typeInSearchBox(itemIds[index]);
          itemListPage.verifyPresenceOfItemById(itemIds[index]);
        });
      });
    }); */

    context(">sharing at 'public level'", () => {
      let clonedItem1 = [];
      let clonedItem2 = [];

      before("Login As Author And Creat Test", () => {
        cy.login("teacher", Author[EMAIL], Author[PASS]);
      });
      before(">share the test", () => {
        techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        searchFilters.getAuthoredByMe();
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.clickOnDetailsOfCard();
        testLibrary.header.clickOnShare();
        testLibrary.removeShare();
        testLibrary.sharingEnabledPublic();
        testLibrary.getPublicRadio().click({ force: true });
        testLibrary.clickSharePop();
      });
      it(`>assert shared test item for '${
        DIST2_SCHOOL1[TEACHER1][NAME]
      } from other district' and 'clone' the item`, () => {
        cy.login("teacher", DIST2_SCHOOL1[TEACHER1][EMAIL], DIST2_SCHOOL1[TEACHER1][PASS]);
        testLibrary.sidebar.clickOnItemBank();
        itemListPage.searchFilters.clearAll();
        itemKeysInTest.forEach((item, index) => {
          itemListPage.searchFilters.typeInSearchBox(itemIds[index]);
          itemListPage.verifyPresenceOfItemById(itemIds[index]);
          itemListPage.clickOnViewItemById(itemIds[index]);
          previewItem.verifyNoEditCloneOption(itemIds[index]);
          previewItem.clickOnCopyItemOnPreview();
          mcqTrueFalsePage.updatePoints("15");
          mcqTrueFalsePage.header.saveAndgetId(true).then(id => {
            expect(id).not.eq(itemIds[index]);
            clonedItem1.push(id);
            cy.saveItemDetailToDelete(id);
            mcqTrueFalsePage.header.clickOnPublishItem();
          });
        });
      });
      it(">verify presence of 'cloned item'", () => {
        expect(clonedItem1, `expected clone to happen successfully`).to.have.lengthOf(1);

        itemListPage.searchFilters.clearAll();
        clonedItem1.forEach(cloned => {
          itemListPage.searchFilters.typeInSearchBox(cloned);
          itemListPage.verifyPresenceOfItemById(cloned);
          itemListPage.getViewItemById(cloned).should("exist");
        });
      });
      it(`>assert shared test item for '${
        DIST1_SCHOOL2[TEACHER1][NAME]
      }from other school' and 'clone' the item`, () => {
        cy.login("teacher", DIST1_SCHOOL2[TEACHER2][EMAIL], DIST1_SCHOOL2[TEACHER2][PASS]);
        testLibrary.sidebar.clickOnItemBank();
        itemListPage.searchFilters.clearAll();
        itemKeysInTest.forEach((item, index) => {
          itemListPage.searchFilters.typeInSearchBox(itemIds[index]);
          itemListPage.verifyPresenceOfItemById(itemIds[index]);
          itemListPage.clickOnViewItemById(itemIds[index]);
          previewItem.verifyNoEditCloneOption(itemIds[index]);
          previewItem.clickOnCopyItemOnPreview();
          mcqTrueFalsePage.updatePoints("15");
          mcqTrueFalsePage.header.saveAndgetId(true).then(id => {
            itemListPage.getItemIdByURL();
            expect(id).not.eq(itemIds[index]);
            clonedItem2.push(id);
            cy.saveItemDetailToDelete(id);
            mcqTrueFalsePage.header.clickOnPublishItem();
          });
        });
      });
      it(">verify presence of 'cloned item'", () => {
        expect(clonedItem2, `expected clone to happen successfully`).to.have.lengthOf(1);

        itemListPage.searchFilters.clearAll();
        clonedItem2.forEach(cloned => {
          itemListPage.searchFilters.typeInSearchBox(cloned);
          itemListPage.verifyPresenceOfItemById(cloned);
          itemListPage.getViewItemById(cloned).should("exist");
        });
      });
    });

    /* https://snapwiz.atlassian.net/browse/EV-13434 
    context(">public- remove share", () => {
      before("Login", () => {
        cy.login("teacher", Author[EMAIL], Author[PASS]);
      });
      it(">verify change", () => {
        testLibrary.sidebar.clickOnItemBank();
        itemListPage.searchFilters.clearAll();
        itemListPage.searchFilters.getAuthoredByMe();
        itemKeysInTest.forEach((item, index) => {
          itemListPage.searchFilters.typeInSearchBox(itemIds[index]);
          itemListPage.clickOnViewItemById(itemIds[index]);
          previewItem.clickOnEditItemOnPreview();
          mcqTrueFalsePage.getPoints().should("have.value", "2");
          mcqTrueFalsePage.header.save(true);
          mcqTrueFalsePage.header.clickOnPublishItem();
        });
      });
      it(">remove-sharing with public", () => {
        techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        searchFilters.getAuthoredByMe();
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.clickOnDetailsOfCard();
        testLibrary.header.clickOnShare();
        testLibrary.removeShare("EVERYONE");
      });
      it(`>for ${DIST1_SCHOOL2[TEACHER2][NAME]} from other district- entire library`, () => {
        cy.login("teacher", DIST2_SCHOOL1[TEACHER1][EMAIL], DIST1_SCHOOL2[TEACHER2][PASS]);
        testLibrary.sidebar.clickOnItemBank();
        itemListPage.searchFilters.clearAll();
        // itemListPage.searchFilters.sharedWithMe();
        itemKeysInTest.forEach((item, index) => {
          itemListPage.searchFilters.typeInSearchBox(itemIds[index]);
          itemListPage.verifyPresenceOfItemById(itemIds[index]);
        });
      });
      it(`>for ${DIST1_SCHOOL2[TEACHER2][NAME]} from other district- shared with me`, () => {
        // cy.login("teacher", DIST1_SCHOOL1[TEACHER2][EMAIL], DIST1_SCHOOL1[TEACHER2][PASS]);
        // testLibrary.sidebar.clickOnItemBank();
        itemListPage.searchFilters.clearAll();
        itemListPage.searchFilters.sharedWithMe();
        itemKeysInTest.forEach((item, index) => {
          itemListPage.searchFilters.typeInSearchBox(itemIds[index]);
          itemListPage.verifyPresenceOfItemById(itemIds[index]);
        });
      });
      it(`>for ${DIST1_SCHOOL2[TEACHER1][NAME]}from other school- entire library`, () => {
        cy.login("teacher", DIST1_SCHOOL2[TEACHER1][EMAIL], DIST1_SCHOOL2[TEACHER2][PASS]);
        testLibrary.sidebar.clickOnItemBank();
        itemListPage.searchFilters.clearAll();
        // itemListPage.searchFilters.sharedWithMe();
        itemKeysInTest.forEach((item, index) => {
          itemListPage.searchFilters.typeInSearchBox(itemIds[index]);
          itemListPage.verifyPresenceOfItemById(itemIds[index]);
        });
      });
      it(`>for ${DIST1_SCHOOL2[TEACHER1][NAME]}from other school- shared with me`, () => {
        // cy.login("teacher", DIST1_SCHOOL1[TEACHER2][EMAIL], DIST1_SCHOOL1[TEACHER2][PASS]);
        // testLibrary.sidebar.clickOnItemBank();
        itemListPage.searchFilters.clearAll();
        itemListPage.searchFilters.sharedWithMe();
        itemKeysInTest.forEach((item, index) => {
          itemListPage.searchFilters.typeInSearchBox(itemIds[index]);
          itemListPage.verifyPresenceOfItemById(itemIds[index]);
        });
      });
    }); */
  });
});
