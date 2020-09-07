export default class PlayListHeader {
  // *** ELEMENTS START ***

  getSummaryButton = () => cy.get('[data-cy="summary"]');

  getReviewButton = () => cy.get('[data-cy="review"]');

  getAddTestsButton = () => cy.get('[data-cy="addTests"]');

  getSettingsButton = () => cy.get('[data-cy="settings"]');

  getPublishButton = () => cy.get('[data-cy="publish"]');

  getSaveButton = () => cy.get('button[data-cy="save"]');

  getShareButton = () => cy.get('[data-cy="share"]');

  getUseThisButton = () => cy.get('[data-cy="use-this"]');

  getEdit = () => cy.get('[data-cy="edit-playlist"]');

  getClone = () => cy.get('[data-cy="clone"]');

  getOKInPopUp = () => cy.get("button").contains("span", "Continue");

  getRemoveFromFavoriteInDropDown = () =>
    cy
      .get(".ant-dropdown-menu-item")
      .filter((i, $ele) => Cypress.dom.isVisible($ele))
      .contains("Remove from Favorite");

  getDeletePlaylist = () => cy.get('[data-cy="delete-playlist"]');

  // *** ELEMENTS END ***

  // *** ACTIONS START ***
  getDropPlaylist = () => cy.get('[data-cy="drop-playlist"]');

  clickOnDescription = () => this.getSummaryButton().click({ force: true });

  clickOnReview = (newPlaylist = false) => {
    cy.server();
    cy.route("PUT", "**/playlists/*").as("savePlayList");
    cy.route("POST", "**/search/tests").as("search-test-in-container");
    this.getReviewButton().click({ force: true });

    if (!newPlaylist) return cy.wait("@savePlayList");
    else return cy.get('[data-cy="playlist-grade"]', { timeout: 20000 });
  };

  clickOnSettings = () => {
    cy.server();
    cy.route("PUT", "**/playlists/*").as("savePlayList");
    this.getSettingsButton().click();
    return cy.wait("@savePlayList");
  };

  clickOnPublish = () => {
    cy.server();
    cy.route("GET", "**/playlists/*").as("renderPlaylist");
    cy.route("PUT", "**/playlists/*/publish").as("publishPlaylist");
    this.getPublishButton().click({ force: true });
    cy.wait("@publishPlaylist").then(xhr => {
      expect(xhr.status).to.eq(200);
    });
    return cy.get('[data-cy="module-name"]', { timeout: 20000 });
  };

  clickOnSave = () => {
    cy.server();
    cy.route("PUT", "**/playlists/**").as("saveOldPlayList");
    this.getSaveButton().click({ force: true });
    return cy.wait("@saveOldPlayList");
  };

  clickOnShare = () => {
    this.getShareButton().click();
  };

  clickOnUseThis = () => {
    cy.server();
    cy.route("POST", "**/playlists/*/use-this").as("change-my-playlist");
    cy.route("GET", "**/user-context?name=LAST_ACCESSED_PLAYLIST").as("get-my-playlist");
    this.getUseThisButton().click({ force: true });
    cy.wait("@change-my-playlist").then(xhr => expect(xhr.status).to.eq(200));
    cy.wait("@get-my-playlist");
    return cy.get('[data-cy="insights"]', { timeout: 20000 });
  };

  clickOnEdit = () => {
    cy.server();
    cy.route("GET", "**/playlists/*").as("editPlayList");
    this.getEdit().click();
    return cy.wait("@editPlayList").then(xhr => xhr);
  };

  clickOnDropPlalist = () => {
    cy.server();
    cy.route("GET", "**/user-playlist-activity/*").as("getPlaylistUsers");
    this.getDropPlaylist().click();
    cy.wait("@getPlaylistUsers");
  };

  clickRemoveFromFavorite = () => {
    cy.server();
    cy.route("DELETE", "**/playlists/use/*").as("delete-from-fav");
    this.getClone()
      .next()
      .click();
    this.getRemoveFromFavoriteInDropDown().click({ force: true });
    this.getOKInPopUp().click({ force: true });
    cy.wait("@delete-from-fav");
  };

  clickOnClone = () => {
    cy.server();
    cy.route("POST", /duplicate/g).as("duplicate-playlist");
    this.getClone().click({ force: true });
    return cy.wait("@duplicate-playlist").then(xhr => {
      cy.saveplayListDetailToDelete(xhr.response.body.result._id);
      return cy.wait(1).then(() => xhr.response.body.result._id);
    });
  };

  clickDeletePlaylist = id => {
    cy.server();
    cy.route("DELETE", "**/playlists/*").as("delete-playlist");
    this.getDeletePlaylist().click({ force: true });
    this.getOKInPopUp().click({ force: true });
    cy.wait("@delete-playlist").then(xhr => {
      expect(xhr.status, `deleting playlist ${xhr.status === 200 ? "success" : "failed"}`).to.eq(200);
      if (id) cy.deletePlaylistEntry(id);
    });
  };

  // *** ACTIONS END ***

  // *** APPHELPERS START ***

  // *** APPHELPERS END ***
}
