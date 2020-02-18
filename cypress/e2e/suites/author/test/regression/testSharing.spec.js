/* eslint-disable prefer-const */
import TeacherSideBar from "../../../../framework/author/SideBarPage";
import SearchFilters from "../../../../framework/author/searchFiltersPage";
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import TestSummayTab from "../../../../framework/author/tests/testDetail/testSummaryTab";
import TestHeader from "../../../../framework/author/tests/testDetail/header";
import FileHelper from "../../../../framework/util/fileHelper";

const userData = require("../../../../../fixtures/users");

const { dist1, dist2 } = userData.testSharing;

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> test sharing`, () => {
  const techersidebar = new TeacherSideBar();
  const searchFilters = new SearchFilters();
  const testLibrary = new TestLibrary();
  const testSummayTab = new TestSummayTab();
  const testHeader = new TestHeader();
  let Author;
  const EMAIL = "email";
  const PASS = "pass";
  const NAME = "name";
  const SCHOOL = "school";
  const SCHOOL1 = "school1";
  const SCHOOL2 = "school2";
  const TEACHER1 = "Teacher1";
  const TEACHER2 = "Teacher2";
  const TEACHER3 = "Teacher3";
  const DIST = "district";
  let DIST1_SCHOOL1;
  let DIST2_SCHOOL1;
  let DIST1_SCHOOL2;
  DIST1_SCHOOL1 = dist1[SCHOOL1];
  DIST1_SCHOOL2 = dist1[SCHOOL2];
  DIST2_SCHOOL1 = dist2[SCHOOL1];
  Author = DIST1_SCHOOL1[TEACHER1];
  let test_id;
  // Using SAME test in both contexts
  context(`>test sharing with edit and viewonly-individually`, () => {
    before("Login As Author And Creat Test without publishing", () => {
      cy.login("teacher", Author[EMAIL], Author[PASS]);
      testLibrary.createTest("default", false).then(id => {
        test_id = id;
      });
    });
    context(">with giving edit permission-individual", () => {
      // Testing the Sharing context for View and Edit permission
      context(">with draft test", () => {
        before(">share the draft test", () => {
          techersidebar.clickOnTestLibrary();
          searchFilters.clearAll();
          searchFilters.getAuthoredByMe();
          testLibrary.clickOnTestCardById(test_id);
          testLibrary.clickOnDetailsOfCard();
          testHeader.isDraft();
          testLibrary.header.clickOnShare();
          // share to other teacher(Should be within district) using thier E-mail
          testLibrary.selectPeopletoshare(DIST1_SCHOOL1[TEACHER2][EMAIL], true);
        });
        it("assert share- Draft", () => {
          cy.login("teacher", DIST1_SCHOOL1[TEACHER2][EMAIL], DIST1_SCHOOL1[TEACHER2][PASS]);
          techersidebar.clickOnTestLibrary();
          searchFilters.clearAll();
          searchFilters.sharedWithMe();
          searchFilters.typeInSearchBox(test_id);
          testLibrary.clickOnTestCardById(test_id);
          testLibrary.assertTestDraftEdit(test_id);
        });
        it(">remove share-draft", () => {
          // Login as Author and Remove share using thier names
          cy.login("teacher", Author[EMAIL], Author[PASS]);
          techersidebar.clickOnTestLibrary();
          searchFilters.clearAll();
          searchFilters.getAuthoredByMe();
          testLibrary.clickOnTestCardById(test_id);
          testLibrary.clickOnDetailsOfCard();
          testHeader.isDraft(); // Check Status of Test
          testLibrary.header.clickOnShare();
          testLibrary.removeShare();
        });
        it(">assert remove share-draft", () => {
          // Check whether share is removed or not using test_id
          cy.login("teacher", DIST1_SCHOOL1[TEACHER2][EMAIL], DIST1_SCHOOL1[TEACHER2][PASS]);
          techersidebar.clickOnTestLibrary();
          searchFilters.clearAll();
          searchFilters.sharedWithMe();
          testLibrary.checkforNonExistanceOfTest(test_id);
        });
      });
      context(">with published test", () => {
        before("login to publish and share the test", () => {
          cy.login("teacher", Author[EMAIL], Author[PASS]);
        });
        before(">publish and share the published test", () => {
          techersidebar.clickOnTestLibrary();
          searchFilters.clearAll();
          searchFilters.getAuthoredByMe();
          testLibrary.clickOnTestCardById(test_id);
          testLibrary.clickOnDetailsOfCard();
          // Publish the Draft Test Before Sharing
          testSummayTab.header.clickOnPublishButton();
          // Immediately after publishing a test a page with sharing options appears
          // Afer clicking edit sharing,normal sharing pop-up will appear
          testLibrary.editsharing();
          testLibrary.selectPeopletoshare(DIST1_SCHOOL1[TEACHER2][EMAIL], true);
        });
        it(">assert the shared test-published ", () => {
          cy.login("teacher", DIST1_SCHOOL1[TEACHER2][EMAIL], DIST1_SCHOOL1[TEACHER2][PASS]);
          techersidebar.clickOnTestLibrary();
          searchFilters.clearAll();
          searchFilters.sharedWithMe();
          searchFilters.typeInSearchBox(test_id);
          testLibrary.clickOnTestCardById(test_id);
          testLibrary.assertTestPublishedEdit(test_id);
        });
        it(">remove share-published", () => {
          cy.login("teacher", Author[EMAIL], Author[PASS]);
          techersidebar.clickOnTestLibrary();
          searchFilters.clearAll();
          searchFilters.getAuthoredByMe();
          testLibrary.clickOnTestCardById(test_id);
          testLibrary.clickOnDetailsOfCard();
          testLibrary.header.clickOnShare();
          testLibrary.removeShare();
        });
        it(">assert remove share-published", () => {
          cy.login("teacher", DIST1_SCHOOL1[TEACHER2][EMAIL], DIST1_SCHOOL1[TEACHER2][PASS]);
          techersidebar.clickOnTestLibrary();
          searchFilters.clearAll();
          searchFilters.sharedWithMe();
          testLibrary.checkforNonExistanceOfTest(test_id);
        });
      });
    });
    context(">without giving edit permission-individual", () => {
      //Testing the above context for View and duplicate permission
      context(">with published test", () => {
        before("login to publish and share the test", () => {
          cy.login("teacher", Author[EMAIL], Author[PASS]);
        });
        before(">publish and share the published test", () => {
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
          techersidebar.clickOnTestLibrary();
          searchFilters.clearAll();
          searchFilters.sharedWithMe();
          searchFilters.typeInSearchBox(test_id);
          testLibrary.clickOnTestCardById(test_id);
          testLibrary.assertTestPublishedNoEdit(test_id);
        });
        it(">remove share-published", () => {
          cy.login("teacher", Author[EMAIL], Author[PASS]);
          techersidebar.clickOnTestLibrary();
          searchFilters.clearAll();
          searchFilters.getAuthoredByMe();
          testLibrary.clickOnTestCardById(test_id);
          testLibrary.clickOnDetailsOfCard();
          testLibrary.header.clickOnShare();
          testLibrary.removeShare();
        });
        it(">assert remove share-published", () => {
          cy.login("teacher", DIST1_SCHOOL1[TEACHER2][EMAIL], DIST1_SCHOOL1[TEACHER2][PASS]);
          techersidebar.clickOnTestLibrary();
          searchFilters.clearAll();
          searchFilters.sharedWithMe();
          testLibrary.checkforNonExistanceOfTest(test_id);
        });
      });
      context(">with draft test", () => {
        before(">creating test without publishing", () => {
          cy.login("teacher", Author[EMAIL], Author[PASS]);
          techersidebar.clickOnTestLibrary();
          searchFilters.clearAll();
          searchFilters.getAuthoredByMe();
          testLibrary.clickOnTestCardById(test_id);
          testLibrary.clickOnDetailsOfCard();
          testLibrary.publishedToDraft();
        });
        before(">share the draft test", () => {
          testLibrary.header.clickOnShare();
          testLibrary.selectPeopletoshare(DIST1_SCHOOL1[TEACHER2][EMAIL], false);
          cy.wait(2000);
        });
        it(">assert share- draft", () => {
          cy.login("teacher", DIST1_SCHOOL1[TEACHER2][EMAIL], DIST1_SCHOOL1[TEACHER2][PASS]);
          techersidebar.clickOnTestLibrary();
          searchFilters.clearAll();
          searchFilters.sharedWithMe();
          searchFilters.typeInSearchBox(test_id);
          testLibrary.clickOnTestCardById(test_id);
          testLibrary.assertTestDraftNoEdit();
        });
        it(">remove share-draft", () => {
          cy.login("teacher", Author[EMAIL], Author[PASS]);
          techersidebar.clickOnTestLibrary();
          searchFilters.clearAll();
          searchFilters.getAuthoredByMe();
          testLibrary.clickOnTestCardById(test_id);
          testLibrary.clickOnDetailsOfCard();
          testHeader.isDraft();
          testLibrary.header.clickOnShare();
          testLibrary.removeShare();
        });
        it(">assert remove share-draft", () => {
          cy.login("teacher", DIST1_SCHOOL1[TEACHER2][EMAIL], DIST1_SCHOOL1[TEACHER2][PASS]);
          techersidebar.clickOnTestLibrary();
          searchFilters.clearAll();
          searchFilters.sharedWithMe();
          testLibrary.checkforNonExistanceOfTest(test_id);
        });
      });
    });
    context(">without giving edit permission-individual-other district", () => {
      //Testing the above context for View and duplicate permission
      context("With draft test-User From Other District", () => {
        before("Creating Test without publishing", () => {
          cy.login("teacher", Author[EMAIL], Author[PASS]);
          techersidebar.clickOnTestLibrary();
          searchFilters.clearAll();
          searchFilters.getAuthoredByMe();
          testLibrary.clickOnTestCardById(test_id);
          testLibrary.clickOnDetailsOfCard();
        });
        before(">share the draft test", () => {
          testLibrary.header.clickOnShare();
          testLibrary.selectPeopletoshare(DIST2_SCHOOL1[TEACHER1][EMAIL], false, false);
          cy.wait(2000);
        });
        it(">assert share- draft", () => {
          cy.login("teacher", DIST2_SCHOOL1[TEACHER1][EMAIL], DIST2_SCHOOL1[TEACHER1][PASS]);
          techersidebar.clickOnTestLibrary();
          searchFilters.clearAll();
          searchFilters.sharedWithMe();
          searchFilters.typeInSearchBox(test_id);
          testLibrary.clickOnTestCardById(test_id);
          testLibrary.assertTestDraftNoEdit();
        });
        it(">remove share-draft", () => {
          cy.login("teacher", Author[EMAIL], Author[PASS]);
          techersidebar.clickOnTestLibrary();
          searchFilters.clearAll();
          searchFilters.getAuthoredByMe();
          testLibrary.clickOnTestCardById(test_id);
          testLibrary.clickOnDetailsOfCard();
          testHeader.isDraft();
          testLibrary.header.clickOnShare();
          testLibrary.removeShare();
        });
        it(">assert remove share-draft", () => {
          cy.login("teacher", DIST2_SCHOOL1[TEACHER1][EMAIL], DIST2_SCHOOL1[TEACHER1][PASS]);
          techersidebar.clickOnTestLibrary();
          searchFilters.clearAll();
          searchFilters.sharedWithMe();
          testLibrary.checkforNonExistanceOfTest(test_id);
        });
      });
      context(">with published test-user from other district", () => {
        before("login to publish and share the test", () => {
          cy.login("teacher", Author[EMAIL], Author[PASS]);
        });
        before(">publish and share the published test", () => {
          techersidebar.clickOnTestLibrary();
          searchFilters.clearAll();
          searchFilters.getAuthoredByMe();
          testLibrary.clickOnTestCardById(test_id);
          testLibrary.clickOnDetailsOfCard();
          testLibrary.header.clickOnPublishButton();
          testLibrary.editsharing();
          testLibrary.selectPeopletoshare(DIST2_SCHOOL1[TEACHER1][EMAIL], false, false);
          cy.wait(2000);
        });
        it(">assert the shared test-published ", () => {
          cy.login("teacher", DIST2_SCHOOL1[TEACHER1][EMAIL], DIST2_SCHOOL1[TEACHER1][PASS]);
          techersidebar.clickOnTestLibrary();
          searchFilters.clearAll();
          searchFilters.sharedWithMe();
          searchFilters.typeInSearchBox(test_id);
          testLibrary.clickOnTestCardById(test_id);
          testLibrary.assertTestPublishedNoEdit(test_id);
        });
        it(">remove share-published", () => {
          cy.login("teacher", Author[EMAIL], Author[PASS]);
          techersidebar.clickOnTestLibrary();
          searchFilters.clearAll();
          searchFilters.getAuthoredByMe();
          testLibrary.clickOnTestCardById(test_id);
          testLibrary.clickOnDetailsOfCard();
          testLibrary.header.clickOnShare();
          testLibrary.removeShare();
        });
        it(">assert remove share-published", () => {
          cy.login("teacher", DIST2_SCHOOL1[TEACHER1][EMAIL], DIST2_SCHOOL1[TEACHER1][PASS]);
          techersidebar.clickOnTestLibrary();
          searchFilters.clearAll();
          searchFilters.sharedWithMe();
          testLibrary.checkforNonExistanceOfTest(test_id);
        });
      });
    });
    context(">multi-share-draft-individual", () => {
      before(">creating test without publishing", () => {
        cy.login("teacher", Author[EMAIL], Author[PASS]);
        techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        searchFilters.getAuthoredByMe();
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.clickOnDetailsOfCard();
        testLibrary.publishedToDraft();
        testLibrary.header.clickOnShare();
        testLibrary.selectPeopletoshare(DIST1_SCHOOL1[TEACHER2][EMAIL], false);
        testLibrary.selectPeopletoshare(DIST1_SCHOOL1[TEACHER3][EMAIL], true);
      });
      it(">assert share- draft", () => {
        cy.login("teacher", DIST1_SCHOOL1[TEACHER2][EMAIL], DIST1_SCHOOL1[TEACHER2][PASS]);
        techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        searchFilters.sharedWithMe();
        searchFilters.typeInSearchBox(test_id);
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.assertTestDraftNoEdit();
      });
      it(">assert share- draft", () => {
        cy.login("teacher", DIST1_SCHOOL1[TEACHER3][EMAIL], DIST1_SCHOOL1[TEACHER2][PASS]);
        techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        searchFilters.sharedWithMe();
        searchFilters.typeInSearchBox(test_id);
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.assertTestDraftEdit(test_id);
      });
    });
    context(">multi-share-published-individual", () => {
      before("creating test  publishing", () => {
        cy.login("teacher", Author[EMAIL], Author[PASS]);
        techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        searchFilters.getAuthoredByMe();
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.clickOnDetailsOfCard();
        testSummayTab.header.clickOnPublishButton();
        // testLibrary.editsharing();
        // testLibrary.selectPeopletoshare("301", false);
        // testLibrary.selectPeopletoshare("302", true);
        /* Proceeding without updating sharing- it should be updated automatically i.e. published or draft */
      });
      it(">assert the shared test-published ", () => {
        cy.login("teacher", DIST1_SCHOOL1[TEACHER2][EMAIL], DIST1_SCHOOL1[TEACHER2][PASS]);
        techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        searchFilters.sharedWithMe();
        searchFilters.typeInSearchBox(test_id);
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.assertTestPublishedNoEdit(test_id);
      });
      it(">assert the shared test-published ", () => {
        cy.login("teacher", DIST1_SCHOOL1[TEACHER3][EMAIL], DIST1_SCHOOL1[TEACHER2][PASS]);
        techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        searchFilters.sharedWithMe();
        searchFilters.typeInSearchBox(test_id);
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.assertTestPublishedEdit(test_id);
      });
    });
  });
  context(">sharing school,district and public levels", () => {
    before(">login as author", () => {
      cy.login("teacher", Author[EMAIL], Author[PASS]);
      testLibrary.createTest("default", false).then(id => {
        test_id = id;
      });
    });
    context(">school- allow share", () => {
      it(">asserting disabled state with draft-state", () => {
        techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        searchFilters.getAuthoredByMe();
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.clickOnDetailsOfCard();
        // testLibrary.publishedToDraft();
        testHeader.isDraft();
        testLibrary.header.clickOnShare();
        // In Draft state sharing is allowed only for individuals
        testLibrary.sharingDisabled();
        testLibrary.closeSharing();
      });
      it(">sharing at school level", () => {
        testHeader.clickOnPublishButton();
        testLibrary.editsharing();
        testLibrary.getSchoolRadio().click({ force: true });
        // Enable sharing at School Level
        testLibrary.clickSharePop();
      });
      it(`>for ${DIST1_SCHOOL1[TEACHER2][NAME]} from same school`, () => {
        // Verify sharing for techer from same school
        testLibrary.verifySharedTest(DIST1_SCHOOL1[TEACHER2][EMAIL], test_id);
      });
    });

    context(">school- remove share", () => {
      before("Login", () => {
        cy.login("teacher", Author[EMAIL], Author[PASS]);
      });

      before(">removesharing with school", () => {
        techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        searchFilters.getAuthoredByMe();
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.clickOnDetailsOfCard();
        testLibrary.header.clickOnShare();
        testLibrary.removeShare();
      });
      it(`>for ${DIST1_SCHOOL1[TEACHER2][NAME]} from same school`, () => {
        testLibrary.verifyRemovedShareTest(DIST1_SCHOOL1[TEACHER2][EMAIL], test_id);
      });
    });

    context(">district- allow share", () => {
      before("Login", () => {
        cy.login("teacher", Author[EMAIL], Author[PASS]);
      });

      before(">sharing at district level", () => {
        techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        searchFilters.getAuthoredByMe();
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.clickOnDetailsOfCard();
        testLibrary.header.clickOnShare();
        testLibrary.getDistrictRadio().click({ force: true });
        testLibrary.clickSharePop();
      });

      it(`>for ${DIST1_SCHOOL2[TEACHER1][NAME]} from other school`, () => {
        // Verify sharing for techer from different school but from same district
        testLibrary.verifySharedTest(DIST1_SCHOOL2[TEACHER1][EMAIL], test_id);
      });
    });

    context(">district- remove share", () => {
      before("Login", () => {
        cy.login("teacher", Author[EMAIL], Author[PASS]);
      });

      before(">remove-sharing with district", () => {
        techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        searchFilters.getAuthoredByMe();
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.clickOnDetailsOfCard();
        testLibrary.header.clickOnShare();
        testLibrary.removeShare();
      });
      it(`>for ${DIST1_SCHOOL2[TEACHER1][NAME]} from other school`, () => {
        testLibrary.verifyRemovedShareTest(DIST1_SCHOOL2[TEACHER1][EMAIL], test_id);
      });
    });

    context(">public- allow share", () => {
      before("Login", () => {
        cy.login("teacher", Author[EMAIL], Author[PASS]);
      });

      before(">sharing at public level", () => {
        techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        searchFilters.getAuthoredByMe();
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.clickOnDetailsOfCard();
        testLibrary.header.clickOnShare();
        testLibrary.sharingEnabledPublic();
        testLibrary.getPublicRadio().click({ force: true });
        testLibrary.clickSharePop();
      });
      it(`>for ${DIST1_SCHOOL2[TEACHER2][NAME]} from other district`, () => {
        testLibrary.verifySharedTestPublic(DIST2_SCHOOL1[TEACHER1][EMAIL], test_id);
      });
      it(`>from other school`, () => {
        testLibrary.verifySharedTestPublic(DIST1_SCHOOL2[TEACHER1][EMAIL], test_id);
      });
    });

    context(">public- remove share", () => {
      before("Login", () => {
        cy.login("teacher", Author[EMAIL], Author[PASS]);
      });

      before(">remove-sharing with public", () => {
        techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        searchFilters.getAuthoredByMe();
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.clickOnDetailsOfCard();
        testLibrary.header.clickOnShare();
        testLibrary.removeShare();
      });
      it(`>for ${DIST1_SCHOOL2[TEACHER2][NAME]} from other district`, () => {
        testLibrary.verifyRemovedsharedTestPublic(DIST2_SCHOOL1[TEACHER1][EMAIL], test_id);
      });
      it(`>for ${DIST1_SCHOOL2[TEACHER1][NAME]}from other school`, () => {
        testLibrary.verifyRemovedsharedTestPublic(DIST1_SCHOOL2[TEACHER1][EMAIL], test_id);
      });
    });
  });
});
