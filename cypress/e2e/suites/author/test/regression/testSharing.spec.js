/* eslint-disable prefer-const */
import TeacherSideBar from "../../../../framework/author/SideBarPage";
import SearchFilters from "../../../../framework/author/searchFiltersPage";
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import TestSummayTab from "../../../../framework/author/tests/testDetail/testSummaryTab";
import TestHeader from "../../../../framework/author/tests/testDetail/header";
import FileHelper from "../../../../framework/util/fileHelper";
import { COLLECTION } from "../../../../framework/constants/questionTypes";

const userData = require("../../../../../fixtures/users");

const { dist1, dist2 } = userData.testSharing;

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> test sharing`, () => {
  const techersidebar = new TeacherSideBar();
  const searchFilters = new SearchFilters();
  const testLibrary = new TestLibrary();
  const testSummayTab = new TestSummayTab();
  const testHeader = new TestHeader();
  let author;
  const email = "email";
  const pass = "pass";
  const name = "name";
  const school1 = "school1";
  const school2 = "school2";
  const teacher1 = "Teacher1";
  const teacher2 = "Teacher2";
  const teacher3 = "Teacher3";
  const dist1_school1 = dist1[school1];
  const dist1_school2 = dist1[school2];
  const dist2_school1 = dist2[school1];
  author = dist1_school1[teacher1];
  let test_id;
  // Using SAME test in both contexts

  context(`>test sharing 'individually'`, () => {
    before("Login As Author And Creat Test without publishing", () => {
      cy.login("teacher", author[email], author[pass]);
      testLibrary.createTest("default", false).then(id => {
        test_id = id;
      });
    });

    context(">with 'Can Edit, Add/Remove Items' permission", () => {
      // Testing the Sharing context for View and Edit permission
      context(">with 'draft' test", () => {
        before(">share the draft test", () => {
          testLibrary.seachTestAndGotoReviewById(test_id);
          testHeader.isDraft();
          testLibrary.header.clickOnShare();
          // share to other teacher(Should be within district) using thier E-mail
          testLibrary.selectPeopletoshare(dist1_school1[teacher2][email], true);
        });
        it(">assert share, 'draft status' and 'Edit, Add/Remove Items' permission", () => {
          cy.login("teacher", dist1_school1[teacher2][email], dist1_school1[teacher2][pass]);
          techersidebar.clickOnTestLibrary();
          searchFilters.clearAll();
          searchFilters.sharedWithMe();
          searchFilters.typeInSearchBox(test_id);
          testLibrary.clickOnTestCardById(test_id);
          testLibrary.assertTestDraftEdit(test_id);
        });
        it(">remove share", () => {
          // Login as Author and Remove share using thier names
          cy.login("teacher", author[email], author[pass]);
          testLibrary.seachTestAndGotoReviewById(test_id);
          testHeader.isDraft(); // Check Status of Test
          testLibrary.header.clickOnShare();
          testLibrary.removeShare();
        });
        it(">assert removed share", () => {
          // Check whether share is removed or not using test_id
          cy.login("teacher", dist1_school1[teacher2][email], dist1_school1[teacher2][pass]);
          techersidebar.clickOnTestLibrary();
          searchFilters.clearAll();
          searchFilters.sharedWithMe();
          searchFilters.typeInSearchBox(test_id);
          testLibrary.checkforNonExistanceOfTest(test_id);
        });
      });
      context(">with 'published' test", () => {
        before("login to publish and share the test", () => {
          cy.login("teacher", author[email], author[pass]);
        });
        before(">publish and share the published test", () => {
          testLibrary.seachTestAndGotoReviewById(test_id);
          // Publish the Draft Test Before Sharing
          testSummayTab.header.clickOnPublishButton();
          // Immediately after publishing a test a page with sharing options appears
          // Afer clicking edit sharing,normal sharing pop-up will appear
          testLibrary.editsharing();
          testLibrary.selectPeopletoshare(dist1_school1[teacher2][email], true);
        });
        it(">assert share, 'published status' and 'Edit, Add/Remove Items' permission", () => {
          cy.login("teacher", dist1_school1[teacher2][email], dist1_school1[teacher2][pass]);
          techersidebar.clickOnTestLibrary();
          searchFilters.clearAll();
          searchFilters.sharedWithMe();
          searchFilters.typeInSearchBox(test_id);
          testLibrary.clickOnTestCardById(test_id);
          testLibrary.assertTestPublishedEdit(test_id);
        });
        it(">remove share", () => {
          cy.login("teacher", author[email], author[pass]);
          testLibrary.seachTestAndGotoReviewById(test_id);
          testLibrary.header.clickOnShare();
          testLibrary.removeShare();
        });
        it(">assert removed share", () => {
          cy.login("teacher", dist1_school1[teacher2][email], dist1_school1[teacher2][pass]);
          techersidebar.clickOnTestLibrary();
          searchFilters.clearAll();
          searchFilters.sharedWithMe();
          searchFilters.typeInSearchBox(test_id);
          testLibrary.checkforNonExistanceOfTest(test_id);
        });
      });
    });
    context(">with 'Can View & Duplicate' permission", () => {
      //Testing the above context for View and duplicate permission
      context(">with 'published' test", () => {
        before("login to publish and share the test", () => {
          cy.login("teacher", author[email], author[pass]);
        });
        before(">publish and share the published test", () => {
          testLibrary.seachTestAndGotoReviewById(test_id);
          testLibrary.header.clickOnShare();
          testLibrary.selectPeopletoshare(dist1_school1[teacher2][email], false);
          cy.wait(2000);
        });
        it(">assert share, 'published status' and 'View & Duplicate' permission", () => {
          cy.login("teacher", dist1_school1[teacher2][email], dist1_school1[teacher2][pass]);
          techersidebar.clickOnTestLibrary();
          searchFilters.clearAll();
          searchFilters.sharedWithMe();
          searchFilters.typeInSearchBox(test_id);
          testLibrary.clickOnTestCardById(test_id);
          testLibrary.assertTestPublishedNoEdit(test_id);
        });
        it(">remove share", () => {
          cy.login("teacher", author[email], author[pass]);
          testLibrary.seachTestAndGotoReviewById(test_id);
          testLibrary.header.clickOnShare();
          testLibrary.removeShare();
        });
        it(">assert removed share", () => {
          cy.login("teacher", dist1_school1[teacher2][email], dist1_school1[teacher2][pass]);
          techersidebar.clickOnTestLibrary();
          searchFilters.clearAll();
          searchFilters.sharedWithMe();
          searchFilters.typeInSearchBox(test_id);
          testLibrary.checkforNonExistanceOfTest(test_id);
        });
      });
      context(">with 'draft' test", () => {
        before(">creating test without publishing", () => {
          cy.login("teacher", author[email], author[pass]);
          testLibrary.seachTestAndGotoReviewById(test_id);
          testLibrary.publishedToDraft();
        });
        before(">share the draft test", () => {
          testLibrary.header.clickOnShare();
          testLibrary.selectPeopletoshare(dist1_school1[teacher2][email], false);
          cy.wait(2000);
        });
        it(">assert share, 'draft status' and 'View & Duplicate' permission", () => {
          cy.login("teacher", dist1_school1[teacher2][email], dist1_school1[teacher2][pass]);
          techersidebar.clickOnTestLibrary();
          searchFilters.clearAll();
          searchFilters.sharedWithMe();
          searchFilters.typeInSearchBox(test_id);
          testLibrary.clickOnTestCardById(test_id);
          testLibrary.assertTestDraftNoEdit();
        });
        it(">remove share", () => {
          cy.login("teacher", author[email], author[pass]);
          testLibrary.seachTestAndGotoReviewById(test_id);
          testHeader.isDraft();
          testLibrary.header.clickOnShare();
          testLibrary.removeShare();
        });
        it(">assert removed share", () => {
          cy.login("teacher", dist1_school1[teacher2][email], dist1_school1[teacher2][pass]);
          techersidebar.clickOnTestLibrary();
          searchFilters.clearAll();
          searchFilters.sharedWithMe();
          searchFilters.typeInSearchBox(test_id);
          testLibrary.checkforNonExistanceOfTest(test_id);
        });
      });
    });
    context(">with 'Can View & Duplicate' permission with 'individual other district'", () => {
      //Testing the above context for View and duplicate permission
      context(">with 'draft' test", () => {
        before(">creating test without publishing", () => {
          cy.login("teacher", author[email], author[pass]);
          testLibrary.seachTestAndGotoReviewById(test_id);
        });
        before(">share the draft test", () => {
          testLibrary.header.clickOnShare();
          testLibrary.selectPeopletoshare(dist2_school1[teacher1][email], false, false);
          cy.wait(2000);
        });
        it(">assert share, 'draft status' and 'View & Duplicate' permission", () => {
          cy.login("teacher", dist2_school1[teacher1][email], dist2_school1[teacher1][pass]);
          techersidebar.clickOnTestLibrary();
          searchFilters.clearAll();
          searchFilters.sharedWithMe();
          searchFilters.typeInSearchBox(test_id);
          testLibrary.clickOnTestCardById(test_id);
          testLibrary.assertTestDraftNoEdit();
        });
        it(">remove share", () => {
          cy.login("teacher", author[email], author[pass]);
          testLibrary.seachTestAndGotoReviewById(test_id);
          testHeader.isDraft();
          testLibrary.header.clickOnShare();
          testLibrary.removeShare();
        });
        it(">assert removed share", () => {
          cy.login("teacher", dist2_school1[teacher1][email], dist2_school1[teacher1][pass]);
          techersidebar.clickOnTestLibrary();
          searchFilters.clearAll();
          searchFilters.sharedWithMe();
          searchFilters.typeInSearchBox(test_id);
          testLibrary.checkforNonExistanceOfTest(test_id);
        });
      });
      context(">with 'published' test", () => {
        before("login to publish and share the test", () => {
          cy.login("teacher", author[email], author[pass]);
        });
        before(">publish and share the published test", () => {
          testLibrary.seachTestAndGotoReviewById(test_id);
          testLibrary.header.clickOnPublishButton();
          testLibrary.editsharing();
          testLibrary.selectPeopletoshare(dist2_school1[teacher1][email], false, false);
          cy.wait(2000);
        });
        it(">assert share, 'published status' and 'View & Duplicate' permission", () => {
          cy.login("teacher", dist2_school1[teacher1][email], dist2_school1[teacher1][pass]);
          techersidebar.clickOnTestLibrary();
          searchFilters.clearAll();
          searchFilters.sharedWithMe();
          searchFilters.typeInSearchBox(test_id);
          testLibrary.clickOnTestCardById(test_id);
          testLibrary.assertTestPublishedNoEdit(test_id);
        });
        it(">remove share", () => {
          cy.login("teacher", author[email], author[pass]);
          testLibrary.seachTestAndGotoReviewById(test_id);
          testLibrary.header.clickOnShare();
          testLibrary.removeShare();
        });
        it(">assert removed share", () => {
          cy.login("teacher", dist2_school1[teacher1][email], dist2_school1[teacher1][pass]);
          techersidebar.clickOnTestLibrary();
          searchFilters.clearAll();
          searchFilters.sharedWithMe();
          searchFilters.typeInSearchBox(test_id);
          testLibrary.checkforNonExistanceOfTest(test_id);
        });
      });
    });
    context(">sharing with 'different permissions to two users at same time' in 'draft' state", () => {
      before(">creating test without publishing and share", () => {
        cy.login("teacher", author[email], author[pass]);
        testLibrary.seachTestAndGotoReviewById(test_id);
        testLibrary.publishedToDraft();
        testLibrary.header.clickOnShare();
        testLibrary.selectPeopletoshare(dist1_school1[teacher2][email], false);
        testLibrary.selectPeopletoshare(dist1_school1[teacher3][email], true);
      });
      it(">assert share, 'draft status' and 'View & Duplicate' permission", () => {
        cy.login("teacher", dist1_school1[teacher2][email], dist1_school1[teacher2][pass]);
        techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        searchFilters.sharedWithMe();
        searchFilters.typeInSearchBox(test_id);
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.assertTestDraftNoEdit();
      });
      it(">assert share, 'draft status' and 'Edit, Add/Remove Items' permission", () => {
        cy.login("teacher", dist1_school1[teacher3][email], dist1_school1[teacher2][pass]);
        techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        searchFilters.sharedWithMe();
        searchFilters.typeInSearchBox(test_id);
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.assertTestDraftEdit(test_id);
      });
    });
    context(">sharing with 'different permissions to two users at same time' in 'published' state", () => {
      before("publish the test", () => {
        cy.login("teacher", author[email], author[pass]);
        testLibrary.seachTestAndGotoReviewById(test_id);
        testSummayTab.header.clickOnPublishButton();
        /* Proceeding without updating sharing- it should be updated automatically i.e. published or draft */
      });
      it(">assert share, 'published status' and 'View & Duplicate' permission", () => {
        cy.login("teacher", dist1_school1[teacher2][email], dist1_school1[teacher2][pass]);
        techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        searchFilters.sharedWithMe();
        searchFilters.typeInSearchBox(test_id);
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.assertTestPublishedNoEdit(test_id);
      });
      it(">assert share, 'published status' and 'Edit, Add/Remove Items' permission", () => {
        cy.login("teacher", dist1_school1[teacher3][email], dist1_school1[teacher2][pass]);
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
      cy.login("teacher", author[email], author[pass]);
      testLibrary.createTest("default", false).then(id => {
        test_id = id;
      });
    });
    context(">sharing at 'school level'", () => {
      it(">asserting disabled state with draft-state", () => {
        testLibrary.seachTestAndGotoReviewById(test_id);
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
      it(`>assert share and 'View & Duplicate' permission for '${
        dist1_school1[teacher2][name]
      }' from same school`, () => {
        // Verify sharing for techer from same school
        cy.login("teacher", dist1_school1[teacher2][email], dist1_school1[teacher2][pass]);
        testLibrary.searchByCollection(COLLECTION.school);
        testLibrary.verifyCollectionOnTestCardbyId(test_id, COLLECTION.school.split(" ")[0].toUpperCase());
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.verifyTestCollectionOnTestCardPopUp(COLLECTION.school);
        testLibrary.assertTestPublishedNoEdit(test_id);
      });
    });

    context(">remove share for 'school'", () => {
      before("Login", () => {
        cy.login("teacher", author[email], author[pass]);
      });

      before(">remove sharing with school", () => {
        testLibrary.seachTestAndGotoReviewById(test_id);
        testLibrary.header.clickOnShare();
        testLibrary.removeShare();
      });
      it(`>assert removed share with '${dist1_school1[teacher2][name]}' from same school`, () => {
        cy.login("teacher", dist1_school1[teacher2][email], dist1_school1[teacher2][pass]);
        testLibrary.searchByCollection(COLLECTION.school);
        testLibrary.checkforNonExistanceOfTest(test_id);
      });
    });

    context(">sharing at 'district level'", () => {
      before("Login", () => {
        cy.login("teacher", author[email], author[pass]);
      });

      before(">sharing at district level", () => {
        testLibrary.seachTestAndGotoReviewById(test_id);
        testLibrary.header.clickOnShare();
        testLibrary.getDistrictRadio().click({ force: true });
        testLibrary.clickSharePop();
      });

      it(`>assert share and 'View & Duplicate' permission for '${
        dist1_school2[teacher1][name]
      }' from other school`, () => {
        // Verify sharing for techer from different school but from same district
        cy.login("teacher", dist1_school2[teacher1][email], dist1_school2[teacher1][pass]);
        testLibrary.searchByCollection(COLLECTION.district);
        testLibrary.verifyCollectionOnTestCardbyId(test_id, COLLECTION.district.split(" ")[0].toUpperCase());
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.verifyTestCollectionOnTestCardPopUp(COLLECTION.district);
        testLibrary.assertTestPublishedNoEdit(test_id);
      });
    });

    context(">remove share for 'district'", () => {
      before("Login", () => {
        cy.login("teacher", author[email], author[pass]);
      });

      before(">remove sharing with district", () => {
        testLibrary.seachTestAndGotoReviewById(test_id);
        testLibrary.header.clickOnShare();
        testLibrary.removeShare();
      });
      it(`>assert removed shared with '${dist1_school2[teacher1][name]}' from other school`, () => {
        cy.login("teacher", dist1_school2[teacher1][email], dist1_school2[teacher1][pass]);
        testLibrary.searchByCollection(COLLECTION.district);
        testLibrary.checkforNonExistanceOfTest(test_id);
        // testLibrary.verifyRemovedShareTest(DIST1_SCHOOL2[TEACHER1][EMAIL], test_id);
      });
    });

    context(">sharing at 'public level'", () => {
      before("Login", () => {
        cy.login("teacher", author[email], author[pass]);
      });

      before(">sharing at public level", () => {
        testLibrary.seachTestAndGotoReviewById(test_id);
        testLibrary.header.clickOnShare();
        testLibrary.sharingEnabledPublic();
        testLibrary.getPublicRadio().click({ force: true });
        testLibrary.clickSharePop();
      });
      it(`>assert share and 'View & Duplicate' permission for '${
        dist1_school2[teacher2][name]
      }' from other district`, () => {
        cy.login("teacher", dist2_school1[teacher1][email], dist2_school1[teacher1][pass]);
        testLibrary.searchByCollection(COLLECTION.public);
        testLibrary.verifyCollectionOnTestCardbyId(test_id, COLLECTION.public.split(" ")[0].toUpperCase());
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.verifyTestCollectionOnTestCardPopUp(COLLECTION.public);
        testLibrary.assertTestPublishedNoEdit(test_id);
      });
      it(`>assert share and 'View & Duplicate' for '${
        dist1_school2[teacher1][name]
      }' permission for from other school`, () => {
        cy.login("teacher", dist1_school2[teacher1][email], dist1_school2[teacher1][pass]);
        testLibrary.searchByCollection(COLLECTION.public);
        testLibrary.verifyCollectionOnTestCardbyId(test_id, COLLECTION.public.split(" ")[0].toUpperCase());
        testLibrary.clickOnTestCardById(test_id);
        testLibrary.verifyTestCollectionOnTestCardPopUp(COLLECTION.public);
        testLibrary.assertTestPublishedNoEdit(test_id);
      });
    });

    context(">remove share for 'district'", () => {
      before("Login", () => {
        cy.login("teacher", author[email], author[pass]);
      });

      before(">remove sharing with district", () => {
        testLibrary.seachTestAndGotoReviewById(test_id);
        testLibrary.header.clickOnShare();
        testLibrary.removeShare();
      });
      it(`>assert removed share with '${dist1_school2[teacher2][name]}' from other district`, () => {
        cy.login("teacher", dist2_school1[teacher1][email], dist2_school1[teacher1][pass]);
        testLibrary.searchByCollection(COLLECTION.public);
        testLibrary.checkforNonExistanceOfTest(test_id);
      });
      it(`>assert removed share with '${dist1_school2[teacher1][name]}'from other school`, () => {
        cy.login("teacher", dist1_school2[teacher1][email], dist1_school2[teacher1][pass]);
        testLibrary.searchByCollection(COLLECTION.public);
        testLibrary.checkforNonExistanceOfTest(test_id);
      });
    });
  });
});
