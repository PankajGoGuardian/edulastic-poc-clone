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
  const testId = {
    testId1: "5e70b870c513dc0008b25fde",
    testId2: "5e70b89ac513dc0008b25fe0",
    testId3: "5e7c920bc76d000007405675"
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
      playListLibrary.playlistCustom.clickOnManageContent();
      playListLibrary.playlistCustom.searchContainer.getKeywordsSearchBar();
      playListLibrary.playlistCustom.getManageContentButton().click();
      cy.contains("Summary").should("be.visible");
    });
  });

  context("Search from search bar", () => {
    before("Go to Resource Container", () => {
      playListLibrary.playlistCustom.clickOnManageContent();
    });

    it("search By Name", () => {
      playListLibrary.playlistCustom.searchContainer.typeInSearchBar(`${testName}`);
      playListLibrary.playlistCustom.searchContainer
        .getTestInSearchResultsById(`${testId.testId1}`)
        .should("contain", `${testName}`);
    });
    it("Search by Id", () => {
      playListLibrary.playlistCustom.searchContainer.typeInSearchBar(`${testId.testId2}`);
      playListLibrary.playlistCustom.searchContainer
        .getTestInSearchResultsById(`${testId.testId2}`)
        .should("be.visible");
    });
    it("Search By standard", () => {
      playListLibrary.playlistCustom.searchContainer.typeInSearchBar(`${testStandard.standard1}`);
      playListLibrary.playlistCustom.searchContainer
        .getTestInSearchResultsById(`${testId.testId1}`)
        .should("be.visible");
      playListLibrary.playlistCustom.searchContainer
        .getTestInSearchResultsById(`${testId.testId2}`)
        .should("be.visible");
      playListLibrary.playlistCustom.searchContainer.typeInSearchBar(`${testStandard.standard2}`);
      playListLibrary.playlistCustom.searchContainer.getSearchContainer().should("contain", "test search 2 ");
    });
    it("Search by Tag", () => {
      playListLibrary.playlistCustom.searchContainer.typeInSearchBar(`${testTag.tag1}`);
      playListLibrary.playlistCustom.searchContainer.getSearchContainer(`${testId.testId1}`).should("be.visible");
      playListLibrary.playlistCustom.searchContainer.typeInSearchBar(`${testTag.tag2}`);
      playListLibrary.playlistCustom.searchContainer.getSearchContainer().should("contain", "No Data");
    });
  });

  context("search from folder", () => {
    it("Authored By Me", () => {
      playListLibrary.playlistCustom.searchContainer.getTestFilter().click();
      playListLibrary.playlistCustom.searchContainer.getAuthoredbyMeFolder().click();
      playListLibrary.playlistCustom.searchContainer.getTestFilter().click();
      playListLibrary.playlistCustom.searchContainer
        .getTestInSearchResultsById(`${testId.testId1}`)
        .should("be.visible");
      playListLibrary.playlistCustom.searchContainer.getTestFilter().click();
      playListLibrary.playlistCustom.searchContainer.setGrade("Grade 4");
      playListLibrary.playlistCustom.searchContainer.getTestFilter().click();
      playListLibrary.playlistCustom.searchContainer
        .getTestInSearchResultsById(`${testId.testId1}`)
        .should("be.visible");
      playListLibrary.playlistCustom.searchContainer.getTestFilter().click();
      playListLibrary.playlistCustom.searchContainer.setSubject("Mathematics");
      playListLibrary.playlistCustom.searchContainer.getTestFilter().click();
      playListLibrary.playlistCustom.searchContainer
        .getTestInSearchResultsById(`${testId.testId2}`)
        .should("be.visible");
      playListLibrary.playlistCustom.searchContainer.getTestFilter().click();
      playListLibrary.playlistCustom.searchContainer.setStatus("Draft");
      playListLibrary.playlistCustom.searchContainer.getTestFilter().click();
      playListLibrary.playlistCustom.searchContainer
        .getTestInSearchResultsById(`${testId.testId3}`)
        .should("be.visible");
    });

    it("Entire library", () => {
      playListLibrary.playlistCustom.searchContainer.getTestFilter().click();
      playListLibrary.playlistCustom.searchContainer.getEntireLibrary().click();
      playListLibrary.playlistCustom.searchContainer.setStatus("All");
      playListLibrary.playlistCustom.searchContainer.getTestFilter().click();
      playListLibrary.playlistCustom.searchContainer
        .getTestInSearchResultsById(`${testId.testId2}`)
        .should("be.visible");
      playListLibrary.playlistCustom.searchContainer.getTestFilter().click();
      playListLibrary.playlistCustom.searchContainer.setSubject("Mathematics");
      playListLibrary.playlistCustom.searchContainer.getTestFilter().click();
      playListLibrary.playlistCustom.searchContainer
        .getTestInSearchResultsById(`${testId.testId1}`)
        .should("be.visible");
      playListLibrary.playlistCustom.searchContainer.getTestFilter().click();
      playListLibrary.playlistCustom.searchContainer.setGrade("Grade 8");
      playListLibrary.playlistCustom.searchContainer.getTestFilter().click();
      playListLibrary.playlistCustom.searchContainer
        .getTestInSearchResultsById(`${testId.testId1}`)
        .should("be.visible");
    });
  });
});
