import playlistCustom from "../../../../framework/author/playlist/playListCustomizationPage";
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import TeacherSideBar from "../../../../framework/author/SideBarPage";

describe("Playlist customization", () => {
  const teacher1 = {
    email: "ts3@yopmail.com",
    pass: "snapwiz"
  };

  const playListCustomization = new playlistCustom();
  const testToCreate = ["search_1", "search_2"];
  const testName = "test search 1 ";
  const testId = {
    testId1: "5e70b870c513dc0008b25fde",
    testId2: "5e70b89ac513dc0008b25fe0",
    testId3: "5e832816702a3600074b2edc",
    testId4: "5e7c920bc76d000007405675",
    testId5: "5e831ac97c24fd0007a20255",
    testId6: "5e832e48252e620008b24043",
    testId7: "5e832e77252e620008b24047",
    testId8: "5e8478a6fd94480008873f85"
  };
  const collection = {
    col1: "School Library",
    col2: "District Library",
    col3: "Public Library",
    col4: "Private Library"
  };
  const testStandard = {
    standard1: "8.G.C.9",
    standard2: "8.G.C.9 7.EE.A.1"
  };
  const testTag = {
    tag1: "test tag 1 ",
    tag2: "wrong tag"
  };
  const sidebar = new TeacherSideBar();

  /*   before(">create test", () => {
          cy.login("teacher", teacher1.email, teacher1.pass);
          testToCreate.forEach((test, i) => {
              testLibrary.createTest(test).then(id => {
                  originalTestIds[i] = id;
                  cy.contains("Share With Others");
              });
          });
      }); */
  context(">Content managment toggle button", () => {
    /*   before(">Create new playlist", () => {
              cy.deleteAllAssignments("", teacher1.email);
              playListLibrary.createPlayList(playListData).then(id => {
                  playListId = id;
              })
  
          });
  
          before(">Add Test to module", () => {
              playListLibrary.searchFilter.clearAll();
              playListLibrary.searchFilter.getAuthoredByMe();
              originalTestIds.forEach(id => {
                  playListLibrary.addTestTab.addTestByIdByModule(id, 1);
              });
              playListLibrary.header.clickOnReview();
              playListLibrary.header.clickOnPublish();
              playListLibrary.header.clickOnUseThis();
          }); */

    before("Log in as tecaher", () => {
      cy.login("teacher", "playschooltecaher@snapwiz.com", "snapwiz");
      sidebar.clickOnRecentUsedPlayList("Test Search Playlist");
    });
    it("ManageContent toggle", () => {
      cy.contains("Summary").should("be.visible");
      playListCustomization.clickOnManageContent();
      playListCustomization.searchContainer.getKeywordsSearchBar();
      playListCustomization.getManageContentButton().click();
      cy.contains("Summary").should("be.visible");
    });
  });

  context("Search from search bar", () => {
    before("Go to Resource Container", () => {
      playListCustomization.clickOnManageContent();
    });
    it("search By Name", () => {
      playListCustomization.searchContainer.typeInSearchBar(`${testName}`);
      playListCustomization.searchContainer
        .getTestInSearchResultsById(`${testId.testId1}`)
        .should("contain", `${testName}`);
    });
    it("Search by Id", () => {
      playListCustomization.searchContainer.typeInSearchBar(`${testId.testId2}`);
      playListCustomization.searchContainer.verifySearchResultVisible(`${testId.testId2}`);
    });
    it("Search By standard", () => {
      playListCustomization.searchContainer.typeInSearchBar(`${testStandard.standard1}`);
      playListCustomization.searchContainer.verifySearchResultVisible(`${testId.testId1}`);
      playListCustomization.searchContainer.verifySearchResultVisible(`${testId.testId2}`);
      playListCustomization.searchContainer.typeInSearchBar(`${testStandard.standard2}`);
      playListCustomization.searchContainer.getSearchContainer().should("contain", "test search 2 ");
    });
    it("Search by Tag", () => {
      playListCustomization.searchContainer.typeInSearchBar(`${testTag.tag1}`);
      playListCustomization.searchContainer.verifySearchResultVisible(`${testId.testId1}`);
      playListCustomization.searchContainer.typeInSearchBar(`${testTag.tag2}`);
      playListCustomization.searchContainer.getSearchContainer().should("contain", "No Data");
    });
  });

  context("search from Authored by me folder", () => {
    it("Verifiy grade,subject and status filter", () => {
      playListCustomization.searchContainer.setFilters({ authoredByme: true });
      playListCustomization.searchContainer.verifySearchResultVisible(`${testId.testId1}`);

      playListCustomization.searchContainer.setFilters({ grade: "Grade 4" });
      playListCustomization.searchContainer.verifySearchResultVisible(`${testId.testId1}`);
      playListCustomization.searchContainer.VerififySearchResultNotVisible(`${testId.testId8}`);

      playListCustomization.searchContainer.setFilters({ status: "Draft" });
      playListCustomization.searchContainer.VerififySearchResultNotVisible(`${testId.testId8}`);
      playListCustomization.searchContainer.verifySearchResultVisible(`${testId.testId4}`);

      playListCustomization.searchContainer.setFilters({ status: "Published", subject: "Mathematics" });
      playListCustomization.searchContainer.verifySearchResultVisible(`${testId.testId2}`);
      playListCustomization.searchContainer.VerififySearchResultNotVisible(`${testId.testId8}`);
    });
    it("Verify collection dropdwon", () => {
      playListCustomization.searchContainer.setFilters({ collection: collection.col1 });
      playListCustomization.searchContainer.verifySearchResultVisible(`${testId.testId1}`);
      playListCustomization.searchContainer.VerififySearchResultNotVisible(`${testId.testId2}`);

      playListCustomization.searchContainer.setFilters({ collection: collection.col2 });
      playListCustomization.searchContainer.verifySearchResultVisible(`${testId.testId2}`);
      playListCustomization.searchContainer.VerififySearchResultNotVisible(`${testId.testId3}`);

      playListCustomization.searchContainer.setFilters({ collection: collection.col3 });
      playListCustomization.searchContainer.verifySearchResultVisible(`${testId.testId3}`);
      playListCustomization.searchContainer.VerififySearchResultNotVisible(`${testId.testId2}`);

      playListCustomization.searchContainer.setFilters({ collection: collection.col4 });
      playListCustomization.searchContainer.verifySearchResultVisible(`${testId.testId3}`);
      playListCustomization.searchContainer.VerififySearchResultNotVisible(`${testId.testId6}`);
    });
  });

  context("search from Entire Library folder", () => {
    it("Verify collection dropdwon", () => {
      playListCustomization.searchContainer.setFilters({ collection: collection.col1 });
      playListCustomization.searchContainer.verifySearchResultVisible(`${testId.testId1}`);
      playListCustomization.searchContainer.VerififySearchResultNotVisible(`${testId.testId2}`);

      playListCustomization.searchContainer.setFilters({ collection: collection.col2 });
      playListCustomization.searchContainer.verifySearchResultVisible(`${testId.testId2}`);
      playListCustomization.searchContainer.VerififySearchResultNotVisible(`${testId.testId3}`);

      playListCustomization.searchContainer.setFilters({ collection: collection.col3 });
      playListCustomization.searchContainer.verifySearchResultVisible(`${testId.testId3}`);
      playListCustomization.searchContainer.VerififySearchResultNotVisible(`${testId.testId2}`);

      playListCustomization.searchContainer.setFilters({ collection: collection.col4 });
      playListCustomization.searchContainer.verifySearchResultVisible(`${testId.testId3}`);
      playListCustomization.searchContainer.VerififySearchResultNotVisible(`${testId.testId6}`);
    });
    it("Verify grade, subject", () => {
      playListCustomization.searchContainer.setFilters({ entireLibrary: true, status: "All" });
      playListCustomization.searchContainer.verifySearchResultVisible(`${testId.testId3}`);
      playListCustomization.searchContainer.VerififySearchResultNotVisible(`${testId.testId4}`);

      playListCustomization.searchContainer.setFilters({ grade: "Grade 8" });
      playListCustomization.searchContainer.verifySearchResultVisible(`${testId.testId3}`);
      playListCustomization.searchContainer.VerififySearchResultNotVisible(`${testId.testId8}`);
      playListCustomization.searchContainer.setFilters({ subject: "Mathematics" });

      playListCustomization.searchContainer.verifySearchResultVisible(`${testId.testId5}`);
      playListCustomization.searchContainer.VerififySearchResultNotVisible(`${testId.testId8}`);
      playListCustomization.getManageContentButton().click();
    });
  });
  context("search from Shared with me folder", () => {
    it("Shared with Me", () => {
      playListCustomization.clickOnManageContent();
      playListCustomization.searchContainer.setFilters({ SharedWithMe: true });
      playListCustomization.searchContainer.verifySearchResultVisible(`${testId.testId6}`);

      playListCustomization.searchContainer.setFilters({ grade: "Grade 8" });
      playListCustomization.searchContainer.verifySearchResultVisible(`${testId.testId6}`);

      playListCustomization.searchContainer.setFilters({ subject: "ELA" });
      playListCustomization.searchContainer.verifySearchResultVisible(`${testId.testId7}`);
    });
  });
});
