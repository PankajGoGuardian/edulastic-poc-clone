import PlayListLibrary from "../../framework/author/playlist/playListLibrary";
import PlaylistCustom from "../../framework/author/playlist/playListCustomizationPage";
import FileHelper from "../../framework/util/fileHelper";

describe(`${FileHelper.getSpecName(Cypress.spec.name)}>> play list basics`, () => {
  const playListLibrary = new PlayListLibrary();
  const playlistcustom = new PlaylistCustom();
  const playListData = {
    name: "TEST PLAYLIST",
    grade: "Grade 10",
    subject: "Mathematics",
    tests: ["5eddd450da6952de6c20cf63", "5eddd46ada6952de6c20e6ba", "5ef98fa8740c36427e5e4f27"]
  };

  before("login", () => {
    cy.login("teacher", "ashishsnap@snawpiz.com");
  });

  context(">  authoring", () => {
    it(">author playlist", () => {
      cy.visit("/author/playlists/5f1c40383db19e000700b0b7/edit");
      cy.wait(5000);
      //    playListLibrary.sidebar.clickOnPlayListLibrary();
      //   playListLibrary.clickOnNewPlayList();
      //   playListLibrary.playListSummary.setName(playListData.name);
      //   playListLibrary.playListSummary.selectGrade(playListData.grade, true);
      //   playListLibrary.playListSummary.selectSubject(playListData.subject, true);

      // create moduel
      playListLibrary.header.clickOnReview();
      //   cy.contains("Add Module").click();
      //   cy.get('[data-cy="module-group-name"]').type(`CH_1`);
      //   cy.get('[data-cy="module-name"]').type("UNIT-1");
      //   cy.get('[data-cy="module-id"]').type("1");
      //   cy.contains("ADD").click();

      // adding test
      playListData.tests.forEach(testId => {
        // playListLibrary.playlistCustom.searchContainer.typeInSearchBar(testId);
        playlistcustom.dragTestFromSearchToModule(1, testId);
      });
      cy.get('[data-cy="save"]').click();
    });
  });
});
