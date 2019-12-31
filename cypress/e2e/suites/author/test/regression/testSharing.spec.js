/* eslint-disable prefer-const */
import TeacherSideBar from "../../../../framework/author/SideBarPage";
import SearchFilters from "../../../../framework/author/searchFiltersPage";
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import TestSummayTab from "../../../../framework/author/tests/testDetail/testSummaryTab";
import TestHeader from "../../../../framework/author/tests/testDetail/header";

const userData = require("../../../../../fixtures/users");

const { dist1, dist2 } = userData.Sharing;

describe("Test Sharing", () => {
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
  let test_id; //= "5dea0812da05c80008403d19";
  // Using SAME test in both contexts
  context("Test Sharing with Edit and Viewonly-Individually", () => {
    context("With giving edit permission-Individual", () => {
      // Testing the Sharing context for View and Edit permission
      context("With draft test", () => {
        before("Login As Author And Creat Test without publishing", () => {
          cy.login("teacher", Author[EMAIL], Author[PASS]);
          testLibrary.createTest("default", false).then(id => {
            test_id = id;
          });
        });

        it("Share the draft test", () => {
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
          testLibrary.clickOnTestCardById(test_id);
          testLibrary.assertTestDraftEdit(test_id);
        });
        it("remove share-Draft", () => {
          // Login as Author and Remove share using thier names
          cy.login("teacher", Author[EMAIL], Author[PASS]);
          techersidebar.clickOnTestLibrary();
          searchFilters.clearAll();
          searchFilters.getAuthoredByMe();
          testLibrary.clickOnTestCardById(test_id);
          testLibrary.clickOnDetailsOfCard();
          testHeader.isDraft(); // Check Status of Test
          testLibrary.header.clickOnShare();
          testLibrary.removeShare(DIST1_SCHOOL1[TEACHER2][NAME]);
        });
        it("Assert remove share-Draft", () => {
          // Check whether share is removed or not using test_id
          cy.login("teacher", DIST1_SCHOOL1[TEACHER2][EMAIL], DIST1_SCHOOL1[TEACHER2][PASS]);
          techersidebar.clickOnTestLibrary();
          searchFilters.clearAll();
          searchFilters.sharedWithMe();
          testLibrary.checkforNonExistanceOfTest(test_id);
        });
      });
      context("With published test", () => {
        before("Login to publish and share the test", () => {
          cy.login("teacher", Author[EMAIL], Author[PASS]);
        });
        it("Publish and Share the published test", () => {
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
        it("Assert the shared Test-Published ", () => {
          cy.login("teacher", DIST1_SCHOOL1[TEACHER2][EMAIL], DIST1_SCHOOL1[TEACHER2][PASS]);
          techersidebar.clickOnTestLibrary();
          searchFilters.clearAll();
          searchFilters.sharedWithMe();
          testLibrary.clickOnTestCardById(test_id);
          testLibrary.assertTestPublishedEdit(test_id);
        });
        it("Remove share-Published", () => {
          cy.login("teacher", Author[EMAIL], Author[PASS]);
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
          techersidebar.clickOnTestLibrary();
          searchFilters.clearAll();
          searchFilters.sharedWithMe();
          testLibrary.checkforNonExistanceOfTest(test_id);
        });
      });
    });
    context("Without giving edit permission-Individual", () => {
      //Testing the above context for View and duplicate permission
      context("With published test", () => {
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
          techersidebar.clickOnTestLibrary();
          searchFilters.clearAll();
          searchFilters.sharedWithMe();
          testLibrary.clickOnTestCardById(test_id);
          testLibrary.assertTestPublishedNoEdit(test_id);
        });
        it("Remove share-Published", () => {
          cy.login("teacher", Author[EMAIL], Author[PASS]);
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
          techersidebar.clickOnTestLibrary();
          searchFilters.clearAll();
          searchFilters.sharedWithMe();
          testLibrary.checkforNonExistanceOfTest(test_id);
        });
      });
      context("With draft test", () => {
        before("Creating Test without publishing", () => {
          cy.login("teacher", Author[EMAIL], Author[PASS]);
          techersidebar.clickOnTestLibrary();
          searchFilters.clearAll();
          searchFilters.getAuthoredByMe();
          testLibrary.clickOnTestCardById(test_id);
          testLibrary.clickOnDetailsOfCard();
          testLibrary.publishedToDraft();
        });
        it("Share the draft test", () => {
          testLibrary.header.clickOnShare();
          testLibrary.selectPeopletoshare(DIST1_SCHOOL1[TEACHER2][EMAIL], false);
          cy.wait(2000);
        });
        it("assert share- Draft", () => {
          cy.login("teacher", DIST1_SCHOOL1[TEACHER2][EMAIL], DIST1_SCHOOL1[TEACHER2][PASS]);
          techersidebar.clickOnTestLibrary();
          searchFilters.clearAll();
          searchFilters.sharedWithMe();
          testLibrary.clickOnTestCardById(test_id);
          testLibrary.assertTestDraftNoEdit();
        });
        it("remove share-Draft", () => {
          cy.login("teacher", Author[EMAIL], Author[PASS]);
          techersidebar.clickOnTestLibrary();
          searchFilters.clearAll();
          searchFilters.getAuthoredByMe();
          testLibrary.clickOnTestCardById(test_id);
          testLibrary.clickOnDetailsOfCard();
          testHeader.isDraft();
          testLibrary.header.clickOnShare();
          testLibrary.removeShare(DIST1_SCHOOL1[TEACHER2][NAME]);
        });
        it("Assert remove share-Draft", () => {
          cy.login("teacher", DIST1_SCHOOL1[TEACHER2][EMAIL], DIST1_SCHOOL1[TEACHER2][PASS]);
          techersidebar.clickOnTestLibrary();
          searchFilters.clearAll();
          searchFilters.sharedWithMe();
          testLibrary.checkforNonExistanceOfTest(test_id);
        });
      });
    });
    context("Multi-Share-draft-Individual", () => {
      before("Creating Test without publishing", () => {
        cy.login("teacher", Author[EMAIL], Author[PASS]);
        techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        searchFilters.getAuthoredByMe();
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.clickOnDetailsOfCard();
        testLibrary.header.clickOnShare();
        testLibrary.selectPeopletoshare(DIST1_SCHOOL1[TEACHER2][EMAIL], false);
        testLibrary.selectPeopletoshare(DIST1_SCHOOL1[TEACHER3][EMAIL], true);
      });
      it("assert share- Draft", () => {
        cy.login("teacher", DIST1_SCHOOL1[TEACHER2][EMAIL], DIST1_SCHOOL1[TEACHER2][PASS]);
        techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        searchFilters.sharedWithMe();
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.assertTestDraftNoEdit();
      });
      it("assert share- Draft", () => {
        cy.login("teacher", DIST1_SCHOOL1[TEACHER3][EMAIL], DIST1_SCHOOL1[TEACHER2][PASS]);
        techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        searchFilters.sharedWithMe();
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.assertTestDraftEdit(test_id);
      });
    });
    context("Multi-Share-published-Individual", () => {
      before("Creating Test  publishing", () => {
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
      it("Assert the shared Test-Published ", () => {
        cy.login("teacher", DIST1_SCHOOL1[TEACHER2][EMAIL], DIST1_SCHOOL1[TEACHER2][PASS]);
        techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        searchFilters.sharedWithMe();
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.assertTestPublishedNoEdit(test_id);
      });
      it("Assert the shared Test-Published ", () => {
        cy.login("teacher", DIST1_SCHOOL1[TEACHER3][EMAIL], DIST1_SCHOOL1[TEACHER2][PASS]);
        techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        searchFilters.sharedWithMe();
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.assertTestPublishedEdit(test_id);
      });
      it("User From Other District", () => {
        techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        searchFilters.getAuthoredByMe();
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.clickOnDetailsOfCard();
        testHeader.isDraft();
        testLibrary.header.clickOnShare();
        testLibrary.selectPeopletoshare(DIST2_SCHOOL1[TEACHER1][EMAIL], true, true);
      });
    });
  });
  context("Sharing School,District and Public Levels", () => {
    before("Login As Author", () => {
      cy.login("teacher", Author[EMAIL], Author[PASS]);
      testLibrary.createTest("default", false).then(id => {
        test_id = id;
      });
    });
    context("School- Allow Share", () => {
      it("Asserting Disabled State With Draft-state", () => {
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
      it("Sharing At School level", () => {
        testHeader.clickOnPublishButton();
        testLibrary.editsharing();
        testLibrary.getSchoolRadio().click({ force: true });
        // Enable sharing at School Level
        testLibrary.clickSharePop(true, true);
      });
      it(`for ${DIST1_SCHOOL1[TEACHER2][NAME]} From Same School`, () => {
        // Verify sharing for techer from same school
        testLibrary.verifySharedTest(DIST1_SCHOOL1[TEACHER2][EMAIL], test_id);
      });
    });

    context("School- Remove Share", () => {
      before("Login", () => {
        cy.login("teacher", Author[EMAIL], Author[PASS]);
      });

      it("Removesharing With School", () => {
        techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        searchFilters.getAuthoredByMe();
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.clickOnDetailsOfCard();
        testLibrary.header.clickOnShare();
        testLibrary.removeShare(DIST1_SCHOOL1[TEACHER2][SCHOOL]);
      });
      it(`for ${DIST1_SCHOOL1[TEACHER2][NAME]} From Same School`, () => {
        testLibrary.verifyRemovedShareTest(DIST1_SCHOOL1[TEACHER2][EMAIL], test_id);
      });
    });

    context("District- Allow share", () => {
      before("Login", () => {
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
        testLibrary.verifySharedTest(DIST1_SCHOOL2[TEACHER1][EMAIL], test_id);
      });
    });

    context("District- Remove Share", () => {
      before("Login", () => {
        cy.login("teacher", Author[EMAIL], Author[PASS]);
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
        testLibrary.verifyRemovedShareTest(DIST1_SCHOOL2[TEACHER1][EMAIL], test_id);
      });
    });

    context("Public- Allow Share", () => {
      before("Login", () => {
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
      it(`for ${DIST1_SCHOOL2[TEACHER2][NAME]} From Other District`, () => {
        testLibrary.verifySharedTestPublic(DIST2_SCHOOL1[TEACHER1][EMAIL], test_id);
      });
      it(`for ${DIST1_SCHOOL2[TEACHER1][NAME]}From Other School`, () => {
        testLibrary.verifySharedTestPublic(DIST1_SCHOOL2[TEACHER1][EMAIL], test_id);
      });
    });

    context("Public- Remove Share", () => {
      before("Login", () => {
        cy.login("teacher", Author[EMAIL], Author[PASS]);
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
        testLibrary.verifyRemovedsharedTestPublic(DIST2_SCHOOL1[TEACHER1][EMAIL], test_id);
      });
      it(`for ${DIST1_SCHOOL2[TEACHER1][NAME]}From Other School`, () => {
        testLibrary.verifyRemovedsharedTestPublic(DIST1_SCHOOL2[TEACHER1][EMAIL], test_id);
      });
    });
  });
});
