export default class PlayListHeader {
  getSummaryButton = () => cy.get('[data-cy="description"]');

  getReviewButton = () => cy.get('[data-cy="review"]');

  getAddTestsButton = () => cy.get('[data-cy="addTests"]');

  getSettingsButton = () => cy.get('[data-cy="settings"]');

  getPublishButton = () => cy.get('[data-cy="publish"]');

  getSaveButton = () => cy.get('[data-cy="save"]');

  getShareButton = () => cy.get('[data-cy="share"]');

  getUseThisButton = () => cy.get('[data-cy="use-this"]');

  getEdit = () => cy.get('[data-cy="edit-playlist"]');

  clickOnDescription = () => {
    this.getSummaryButton.click({ force: true });
  };

  clickOnAddTests = () => {
    cy.server();
    cy.route("POST", "**/search/**").as("search");
    this.getAddTestsButton().click({ force: true });
    return cy.wait("@search");
  };

  clickOnReview = () => {
    cy.server();
    cy.route("PUT", "**/playlists/*").as("savePlayList");
    this.getReviewButton().click({ force: true });
    return cy.wait("@savePlayList");
  };

  clickOnSettings = () => {
    this.getSettingsButton().click();
    return cy.wait(2000);
  };

  clickOnPublish = () => {
    cy.server();
    cy.route("GET", "**/playlists/*").as("renderPlaylist");
    cy.route("PUT", "**/playlists/*/publish").as("publishPlaylist");
    this.getPublishButton().click({ force: true });
    cy.wait("@publishPlaylist").then(xhr => {
      expect(xhr.status).to.eq(200);
    });
    cy.wait("@renderPlaylist");
  };

  clickOnSave = () => {
    cy.server();
    cy.route("PUT", "**/playlists/**").as("saveOldPlayList");
    this.getSaveButton().click();
    return cy.wait("@saveOldPlayList");
  };

  clickOnShare = () => {
    this.getShareButton().click();
  };

  clickOnUseThis = () => {
    cy.server();
    cy.route("GET", "**/playlists/*").as("useThis");
    this.getUseThisButton().click({ force: true });
    cy.wait("@useThis");
  };

  clickOnEdit = () => {
    cy.server();
    cy.route("GET", "**/playlists/*").as("editPlayList");
    this.getEdit().click();
    return cy.wait("@editPlayList").then(xhr => xhr);
  };

  clickOnCustomization = () => {
    cy.server();
    cy.route("POST", "**/playlists/**").as("duplicatePlaylist");
    cy.route("GET", "**/playlists/*").as("getPlayList");
    this.getSaveButton().click();
    cy.wait("@getPlayList");
    return cy.wait("@duplicatePlaylist").then(xhr => xhr);
  };
}
