import PlayListLibrary from "../../../../framework/author/playlist/playListLibrary";
//import Playlist from "../../../../framework/author/playlist/playListCustomization";
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import TeacherSideBar from "../../../../framework/author/SideBarPage";

describe("Playlist customization", () => {
  const teacher1 = {
    email: "ts3@yopmail.com",
    pass: "snapwiz"
  };

  const playListLibrary = new PlayListLibrary();
  //const container = new PlayListSearchContainer();
  const testToCreate = ["search_1", "search_2"];
  const originalTestIds = [];
  const testName = "test search 1 ";
  const testId = "5e70b89ac513dc0008b25fe0";
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
      playListLibrary.playlistCustom.clickOnManageContent();
      playListLibrary.searchContainer.getKeywordsSearchBar();
      playListLibrary.playlistCustom.getManageContentButton().click();
      cy.contains("Summary").should("be.visible");
    });
  });

  context("Search from folder", () => {
    before("Go to Resource Container", () => {
      playListLibrary.playlistCustom.clickOnManageContent();
    });

    it("search By Name", () => {
      playListLibrary.searchContainer.typeInSearchBar(`${testName}`);
      playListLibrary.searchContainer
        .getTestInSearchResultsById("5e70b870c513dc0008b25fde")
        .should("contain", `${testName}`);
    });
    it("Search by Id", () => {
      playListLibrary.searchContainer.getKeywordsSearchBar().clear();
      playListLibrary.searchContainer.typeInSearchBar(`${testId}`);
      playListLibrary.searchContainer.getTestInSearchResultsById("5e70b89ac513dc0008b25fe0").should("be.visible");
    });
    it("Search By standard", () => {
      playListLibrary.searchContainer.getKeywordsSearchBar().clear();
      playListLibrary.searchContainer.typeInSearchBar(`${testStandard.standard1}`);
      playListLibrary.searchContainer.getTestInSearchResultsById("5e70b870c513dc0008b25fde").should("be.visible");
      playListLibrary.searchContainer.getTestInSearchResultsById("5e70b89ac513dc0008b25fe0").should("be.visible");
      playListLibrary.searchContainer.getKeywordsSearchBar().clear();
      playListLibrary.searchContainer.typeInSearchBar(`${testStandard.standard2}`);
      playListLibrary.searchContainer.getSearchContainer().should("contain", "test search 2 ");
    });
    it("Search by Tag", () => {
      playListLibrary.searchContainer.getKeywordsSearchBar().clear();
      playListLibrary.searchContainer.typeInSearchBar(`${testTag.tag1}`);
      playListLibrary.searchContainer.getSearchContainer("5e70b870c513dc0008b25fde").should("be.visible");
      playListLibrary.searchContainer.getKeywordsSearchBar().clear();
      playListLibrary.searchContainer.typeInSearchBar(`${testTag.tag2}`);
      playListLibrary.searchContainer.getSearchContainer().should("contain", "No Data");
    });
  });
});
