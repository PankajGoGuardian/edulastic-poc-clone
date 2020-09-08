import PlayListReview from "./playListReview";

class PlaylistCustom extends PlayListReview {
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
    this.clickOpenCustomizationTab();

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
}

export default PlaylistCustom;
