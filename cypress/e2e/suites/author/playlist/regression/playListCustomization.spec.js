import PlayListLibrary from "../../../../framework/author/playlist/playListLibrary";
import Playlist from "../../../../framework/author/playlist/playListCustomization";
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import TeacherSideBar from "../../../../framework/author/SideBarPage";

describe("Playlist customization", () => {
  const teacher1 = {
    email: "ts3@yopmail.com",
    pass: "snapwiz"
  };

  const playListLibrary = new PlayListLibrary();
  const playlistCustmization = new Playlist();
  const testLibrary = new TestLibrary();
  const testToCreate = ["search_1", "search_2"];
  const originalTestIds = [];
  const playListData = {
    name: "New playlist 1",
    grade: "Grade 6",
    subject: "Mathematics"
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
      cy.login("Teacher", "ts3@yopmail.com", "snapwiz");
      sidebar.clickOnRecentUsedPlayList("customization playlist 1");
    });

    it("ManageContent toggle", () => {
      cy.contains("Summary").should("be.visible");
      playlistCustmization.clickOnManageContent();
      playlistCustmization.clickOnKeyword();
      playlistCustmization.getKeywordsSearchBar();
      playlistCustmization.clickOnStandard();
      playlistCustmization.getStandardSearchBar();
      playlistCustmization.clickOnManageContent();
      cy.contains("Summary").should("be.visible");
    });
  });
});
