/* eslint-disable cypress/no-unnecessary-waiting */
/* eslint-disable prefer-const */
import TeacherSideBar from "../../../../framework/author/SideBarPage";
import SearchFilters from "../../../../framework/author/searchFiltersPage";
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import TestReviewTab from "../../../../framework/author/tests/testDetail/testReviewTab";
import ItemListPage from "../../../../framework/author/itemList/itemListPage";
import PreviewItem from "../../../../framework/author/itemList/itemPreview";
import MCQTrueFalsePage from "../../../../framework/author/itemList/questionType/mcq/mcqTrueFalsePage";

const TEST = "LCB_2";
const testData = require("../../../../../fixtures/testAuthoring");

let ITEMS = testData[TEST].itemKeys;
let itemKeysInTest = [];
ITEMS.forEach(ele => {
  itemKeysInTest.push(ele.split(".")[0]);
});
const userData = require("../../../../../fixtures/users");

const { dist1, dist2 } = userData.Sharing;

describe("Test Sharing", () => {
  const techersidebar = new TeacherSideBar();
  const searchFilters = new SearchFilters();
  const testLibrary = new TestLibrary();
  const testReviewTab = new TestReviewTab();
  const itemListPage = new ItemListPage();
  const previewItem = new PreviewItem();
  const mcqTrueFalsePage = new MCQTrueFalsePage();
  let Author;
  let itemIds;
  let clonedItem = [];
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

  DIST1_SCHOOL1 = dist1[SCHOOL1];
  DIST1_SCHOOL2 = dist1[SCHOOL2];
  DIST2_SCHOOL1 = dist2[SCHOOL1];
  Author = DIST1_SCHOOL1[TEACHER1];

  before("Login As Author And Creat Test without publishing", () => {
    cy.login("teacher", Author[EMAIL], Author[PASS]);
    testLibrary.createTest(TEST, true).then(id => {
      test_id = id;
      itemIds = testLibrary.items;
    });
  });
  // Permissions given to Tests are applied to items too
  context("Item Sharing with Edit and Viewonly-Individually", () => {
    context("With giving edit permission-Individual", () => {
      it("Publish and Share the published test", () => {
        techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        searchFilters.getAuthoredByMe();
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.clickOnDetailsOfCard();
        testLibrary.header.clickOnShare();
        testLibrary.selectPeopletoshare(DIST1_SCHOOL1[TEACHER2][EMAIL], true);
        cy.wait(2000);
      });
      it("Assert the shared Test-Published ", () => {
        cy.login("teacher", DIST1_SCHOOL1[TEACHER2][EMAIL], DIST1_SCHOOL1[TEACHER2][PASS]);
        testLibrary.sidebar.clickOnItemBank();
        itemListPage.searchFilters.clearAll();
        itemListPage.searchFilters.sharedWithMe();
        itemKeysInTest.forEach((item, index) => {
          itemListPage.searchFilters.typeInSearchBox(itemIds[index]);
          itemListPage.verifyPresenceOfItemById(itemIds[index]);
          itemListPage.clickOnViewItemById(itemIds[index]);
          previewItem.verifyEditOption(itemIds[index]);
          previewItem.clickOnEditItemOnPreview();
          mcqTrueFalsePage.updatePoints("10");
          mcqTrueFalsePage.header.save(true);
          itemListPage.getItemIdByURL().then(id => {
            expect(id).eq(itemIds[index]);
            mcqTrueFalsePage.header.clickOnPublishItem();
          });
        });
      });
      it("Verify Change", () => {
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
      it("Remove share-Published", () => {
        techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        searchFilters.getAuthoredByMe();
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.clickOnDetailsOfCard();
        testReviewTab.testheader.clickOnShare();
        testLibrary.removeShare(DIST1_SCHOOL1[TEACHER2][NAME]);
      });
      it("Assert remove share-Published", () => {
        cy.login("teacher", DIST1_SCHOOL1[TEACHER2][EMAIL], DIST1_SCHOOL1[TEACHER2][PASS]);
        testLibrary.sidebar.clickOnItemBank();
        itemListPage.searchFilters.clearAll();
        itemListPage.searchFilters.sharedWithMe();
        itemKeysInTest.forEach((item, index) => {
          itemListPage.searchFilters.typeInSearchBox(itemIds[index]);
          itemListPage.verifyAbsenceOfitemById(itemIds[index]);
        });
      });
    });
    context("Without giving edit permission-Individual", () => {
      before("Login to publish and share the test", () => {
        cy.login("teacher", Author[EMAIL], Author[PASS]);
      });
      it("Publish and Share the published test", () => {
        techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        searchFilters.getAuthoredByMe();
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.clickOnDetailsOfCard();
        testLibrary.header.clickOnShare();
        testLibrary.selectPeopletoshare(DIST1_SCHOOL1[TEACHER2][EMAIL], false);
        cy.wait(2000);
      });
      it("Assert the shared Test-Published ", () => {
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
          mcqTrueFalsePage.header.save(true);
          itemListPage.getItemIdByURL().then(id => {
            expect(id).not.eq(itemIds[index]);
            clonedItem.push(id);
            cy.saveItemDetailToDelete(id);
          });
          mcqTrueFalsePage.header.clickOnPublishItem();
        });
      });
      it("Verify Presence of Cloned Item", () => {
        itemListPage.searchFilters.getAuthoredByMe();
        clonedItem.forEach(cloned => {
          itemListPage.searchFilters.typeInSearchBox(cloned);
          itemListPage.verifyPresenceOfItemById(cloned);
          itemListPage.getViewItemById(cloned).should("exist");
        });
      });
      it("Verify Change At Author side", () => {
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
      it("Remove share-Published", () => {
        techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        searchFilters.getAuthoredByMe();
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.clickOnDetailsOfCard();
        testLibrary.header.clickOnShare();
        testLibrary.removeShare(DIST1_SCHOOL1[TEACHER2][NAME]);
      });
      it("Assert remove share-Published", () => {
        cy.login("teacher", DIST1_SCHOOL1[TEACHER2][EMAIL], DIST1_SCHOOL1[TEACHER2][PASS]);
        testLibrary.sidebar.clickOnItemBank();
        itemListPage.searchFilters.clearAll();
        itemListPage.searchFilters.sharedWithMe();
        itemKeysInTest.forEach((item, index) => {
          itemListPage.searchFilters.typeInSearchBox(itemIds[index]);
          itemListPage.verifyAbsenceOfitemById(itemIds[index]);
        });
      });
    });
    context("Multi-Share-Individual", () => {
      before("Share to Multiple People", () => {
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
      it("Assert the shared Test-Items For First Person", () => {
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
          mcqTrueFalsePage.header.save(true);
          itemListPage.getItemIdByURL().then(id => {
            expect(id).not.eq(itemIds[index]);
            cy.saveItemDetailToDelete(id);
            clonedItem[index] = id;
            mcqTrueFalsePage.header.clickOnPublishItem();
          });
        });
      });
      it("Verify Presence of Cloned Item", () => {
        itemListPage.searchFilters.getAuthoredByMe();
        clonedItem.forEach(cloned => {
          itemListPage.searchFilters.typeInSearchBox(cloned);
          itemListPage.verifyPresenceOfItemById(cloned);
          itemListPage.getViewItemById(cloned).should("exist");
        });
      });
      it("Assert the shared Test-Items For Second Person", () => {
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
          mcqTrueFalsePage.header.save(true);
          itemListPage.getItemIdByURL().then(id => {
            expect(id).eq(itemIds[index]);
            mcqTrueFalsePage.header.clickOnPublishItem();
          });
        });
      });
      it("Verify Change", () => {
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
      it("Remove share-Published", () => {
        techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        searchFilters.getAuthoredByMe();
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.clickOnDetailsOfCard();
        testLibrary.header.clickOnShare();
        testLibrary.removeShare(DIST1_SCHOOL1[TEACHER2][NAME]);
        testLibrary.removeShare(DIST1_SCHOOL1[TEACHER3][NAME]);
      });
    });
  });
  context("Sharing School,District and Public Levels", () => {
    context("School- Allow Share", () => {
      before("Login As Author And Creat Test without publishing", () => {
        cy.login("teacher", Author[EMAIL], Author[PASS]);
      });
      it("Sharing At School level", () => {
        techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        searchFilters.getAuthoredByMe();
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.clickOnDetailsOfCard();
        testLibrary.header.clickOnShare();
        testLibrary.getSchoolRadio().click({ force: true });
        testLibrary.clickSharePop(true, true);
      });
      it(`for ${DIST1_SCHOOL1[TEACHER2][NAME]} From Same School`, () => {
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
          mcqTrueFalsePage.header.save(true);
          itemListPage.getItemIdByURL().then(id => {
            expect(id).not.eq(itemIds[index]);
            clonedItem[index] = id;
            cy.saveItemDetailToDelete(id);
            mcqTrueFalsePage.header.clickOnPublishItem();
          });
        });
      });
      it("Verify Presence of Cloned Item", () => {
        itemListPage.searchFilters.getAuthoredByMe();
        clonedItem.forEach(cloned => {
          itemListPage.searchFilters.typeInSearchBox(cloned);
          itemListPage.verifyPresenceOfItemById(cloned);
          itemListPage.getViewItemById(cloned).should("exist");
        });
      });
    });

    context("School- Remove Share", () => {
      before("Login", () => {
        cy.login("teacher", Author[EMAIL], Author[PASS]);
      });
      it("Verify Change", () => {
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
      it("Removesharing With School", () => {
        techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        searchFilters.getAuthoredByMe();
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.clickOnDetailsOfCard();
        testLibrary.header.clickOnShare();
        testLibrary.removeShare("School");
      });
      it(`for ${DIST1_SCHOOL1[TEACHER2][NAME]} From Same School`, () => {
        cy.login("teacher", DIST1_SCHOOL1[TEACHER2][EMAIL], DIST1_SCHOOL1[TEACHER2][PASS]);
        testLibrary.sidebar.clickOnItemBank();
        itemListPage.searchFilters.clearAll();
        itemListPage.searchFilters.sharedWithMe();
        itemKeysInTest.forEach((item, index) => {
          itemListPage.searchFilters.typeInSearchBox(itemIds[index]);
          itemListPage.verifyAbsenceOfitemById(itemIds[index]);
        });
      });
    });

    context("District- Allow share", () => {
      before("Login As Author And Creat Test without publishing", () => {
        cy.login("teacher", Author[EMAIL], Author[PASS]);
      });

      it("Sharing At District Level", () => {
        techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        searchFilters.getAuthoredByMe();
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.clickOnDetailsOfCard();
        testLibrary.header.clickOnShare();
        testLibrary.getDistrictRadio().click({ force: true });
        testLibrary.clickSharePop(true, true);
      });

      it(`for ${DIST1_SCHOOL2[TEACHER1][NAME]} From Other School`, () => {
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
          mcqTrueFalsePage.header.save(true);
          itemListPage.getItemIdByURL().then(id => {
            expect(id).not.eq(itemIds[index]);
            cy.saveItemDetailToDelete(id);
            clonedItem[index] = id;
            mcqTrueFalsePage.header.clickOnPublishItem();
          });
        });
      });
      it("Verify Presence of Cloned Item", () => {
        itemListPage.searchFilters.getAuthoredByMe();
        clonedItem.forEach(cloned => {
          itemListPage.searchFilters.typeInSearchBox(cloned);
          itemListPage.verifyPresenceOfItemById(cloned);
          itemListPage.getViewItemById(cloned).should("exist");
        });
      });
    });

    context("District- Remove Share", () => {
      before("Login", () => {
        cy.login("teacher", Author[EMAIL], Author[PASS]);
      });
      it("Verify Change", () => {
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
      it("Remove-sharing With District", () => {
        techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        searchFilters.getAuthoredByMe();
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.clickOnDetailsOfCard();
        testLibrary.header.clickOnShare();
        testLibrary.removeShare(Author[DIST]);
      });
      it(`for ${DIST1_SCHOOL2[TEACHER1][NAME]} From Other School`, () => {
        cy.login("teacher", DIST1_SCHOOL2[TEACHER2][EMAIL], DIST1_SCHOOL2[TEACHER2][PASS]);
        testLibrary.sidebar.clickOnItemBank();
        itemListPage.searchFilters.clearAll();
        itemListPage.searchFilters.sharedWithMe();
        itemKeysInTest.forEach((item, index) => {
          itemListPage.searchFilters.typeInSearchBox(itemIds[index]);
          itemListPage.verifyAbsenceOfitemById(itemIds[index]);
        });
      });
    });

    context("Public- Allow Share", () => {
      before("Login As Author And Creat Test without publishing", () => {
        cy.login("teacher", Author[EMAIL], Author[PASS]);
      });
      it("Sharing At Public Level", () => {
        techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        searchFilters.getAuthoredByMe();
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.clickOnDetailsOfCard();
        testLibrary.header.clickOnShare();
        testLibrary.sharingEnabledPublic();
        testLibrary.getPublicRadio().click({ force: true });
        testLibrary.clickSharePop(true, true);
      });
      it(`for ${DIST2_SCHOOL1[TEACHER1][NAME]} From Other District`, () => {
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
          mcqTrueFalsePage.header.save(true);
          itemListPage.getItemIdByURL().then(id => {
            expect(id).not.eq(itemIds[index]);
            cy.saveItemDetailToDelete(id);
            mcqTrueFalsePage.header.clickOnPublishItem();
          });
        });
      });
      it("Verify Presence of Cloned Item", () => {
        itemListPage.searchFilters.getAuthoredByMe();
        clonedItem.forEach(cloned => {
          itemListPage.searchFilters.typeInSearchBox(cloned);
          itemListPage.verifyPresenceOfItemById(cloned);
          itemListPage.getViewItemById(cloned).should("exist");
        });
      });
      it(`for ${DIST1_SCHOOL2[TEACHER1][NAME]}From Other School`, () => {
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
          mcqTrueFalsePage.header.save(true);
          itemListPage.getItemIdByURL().then(id => {
            expect(id).not.eq(itemIds[index]);
            cy.saveItemDetailToDelete(id);
            mcqTrueFalsePage.header.clickOnPublishItem();
          });
        });
      });
      it("Verify Presence of Cloned Item", () => {
        itemListPage.searchFilters.getAuthoredByMe();
        clonedItem.forEach(cloned => {
          itemListPage.searchFilters.typeInSearchBox(cloned);
          itemListPage.verifyPresenceOfItemById(cloned);
          itemListPage.getViewItemById(cloned).should("exist");
        });
      });
    });

    context("Public- Remove Share", () => {
      before("Login", () => {
        cy.login("teacher", Author[EMAIL], Author[PASS]);
      });
      it("Verify Change", () => {
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
      it("Remove-sharing With Public", () => {
        techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        searchFilters.getAuthoredByMe();
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.clickOnDetailsOfCard();
        testLibrary.header.clickOnShare();
        testLibrary.removeShare("EVERYONE");
      });
      it(`for ${DIST1_SCHOOL2[TEACHER2][NAME]} From Other District`, () => {
        cy.login("teacher", DIST2_SCHOOL1[TEACHER1][EMAIL], DIST1_SCHOOL2[TEACHER2][PASS]);
        testLibrary.sidebar.clickOnItemBank();
        itemListPage.searchFilters.clearAll();
        itemListPage.searchFilters.sharedWithMe();
        itemKeysInTest.forEach((item, index) => {
          itemListPage.searchFilters.typeInSearchBox(itemIds[index]);
          itemListPage.verifyAbsenceOfitemById(itemIds[index]);
        });
      });
      it(`for ${DIST1_SCHOOL2[TEACHER1][NAME]}From Other School`, () => {
        cy.login("teacher", DIST1_SCHOOL2[TEACHER1][EMAIL], DIST1_SCHOOL2[TEACHER2][PASS]);
        testLibrary.sidebar.clickOnItemBank();
        itemListPage.searchFilters.clearAll();
        itemListPage.searchFilters.sharedWithMe();
        itemKeysInTest.forEach((item, index) => {
          itemListPage.searchFilters.typeInSearchBox(itemIds[index]);
          itemListPage.verifyAbsenceOfitemById(itemIds[index]);
        });
      });
    });
  });
});
