import PlayListReview from "../author/playlist/playListReview";

class StudenPlaylist extends PlayListReview {
  getPlaylistCardById = id => cy.get(`[data-cy="playlist-${id}"]`);

  getOpenDroppedPlaylist = () => cy.get('[data-cy="open-dropped-playlist"]');

  getPlaylistNameOnCardById = () => this.getPlaylistCardById(id).find('[data-cy="name"]');

  getPlaylistGradeOnCardById = () => this.getPlaylistCardById(id).find('[data-cy="grade"]');

  getPlaylistSubOnCardById = () => this.getPlaylistCardById(id).find('[data-cy="subject"]');

  clickOpenDroppedPlaylist = () => this.getOpenDroppedPlaylist().click();

  clickOnPractiseByTestByMod = (mod, test) => this.clickOnPractiseResumeByTestcard(mod, test, true);

  clickOnResumeByTestByMod = (mod, test) => this.clickOnPractiseResumeByTestcard(mod, test);

  clickOnPractiseResumeByTestcard = (mod, test, start = false) => {
    cy.server();
    cy.route("GET", "**/attachments/*").as("loadPracticeTest");
    if (start)
      this.getTestByTestByModule(mod, test)
        .find(`[data-cy="START PRACTICE"]`)
        .click();
    else
      this.getTestByTestByModule(mod, test)
        .find('[data-cy="RESUME PRACTICE"]')
        .click();
    cy.wait("@loadPracticeTest");
  };
  clickOnViewPlaylistById = id => {
    cy.server();
    cy.route("GET", "**/playlists/*").as("loadDropdPlaylist");
    this.getPlaylistCardById(id).click();
    cy.wait("@loadDropdPlaylist").then(xhr => expect(xhr.status).to.eq(200));
  };
}
export default StudenPlaylist;
