import PlayListReview from "./playListReview";
import PlayListSearchContainer from "./searchConatinerPage";

class PlaylistCustom extends PlayListReview {
  constructor() {
    super();
    this.searchContainer = new PlayListSearchContainer();
  }

  /* GET ELEMENTS */

  getManageContentButton = () => cy.get('[data-cy="manage-content"]');

  getOkWhileCustomize = () =>
    cy
      .get(".ant-modal-confirm-btns")
      .find("button")
      .contains("span", "Continue");

  getUpdatePlaylist = () => cy.get('[data-cy="publish-customized-playlist"]');

  clickOnManageContent = (customize = false) => {
    cy.server();
    cy.route("POST", "**/playlists/**").as("duplicate-playlist");
    //  this.searchContainer.routeTestSearch();
    this.getManageContentButton().then($ele => {
      if (Cypress.$('[placeholder="Search by keywords"]').length === 0) cy.wrap($ele).click();
    });

    if (customize) {
      cy.wait(500);
      this.getOkWhileCustomize().click({ force: true });
      return cy
        .wait("@duplicate-playlist")
        .then(xhr =>
          cy.saveplayListDetailToDelete(xhr.response.body.result._id).then(() => xhr.response.body.result._id)
        );
    } else return cy.wait(2000);
  };

  clickUpdatePlaylist = () => {
    cy.server();
    cy.route("PUT", "**/playlists/*").as("update-playlist");
    this.getUpdatePlaylist().click();
    cy.wait("@update-playlist").then(xhr => {
      expect(xhr.status).to.eq(200);
    });
  };

  /* APP HELPERS */
  dragTestFromSearchToModule = (sourcemod, test) => {
    this.clickExpandByModule(sourcemod);
    this.getModuleRowByModule(sourcemod).as("target-container");
    this.searchContainer
      .getTestInSearchResultsById(test)
      .first()
      .as("source-container");

    const opts = {
      offsetX: 0,
      offsetY: 0
    };

    cy.get("@source-container")
      .trigger("dragstart")
      .trigger("drag");

    cy.get("@target-container").then($el => {
      const { x, y } = $el.get(0).getBoundingClientRect();
      cy.wrap($el.get(0)).as("target");
      cy.get("@target").trigger("dragover");
      cy.get("@target").trigger("drop", {
        clientX: x + opts.offsetX,
        clientY: y + opts.offsetY
      });
    });
  };
}

export default PlaylistCustom;
