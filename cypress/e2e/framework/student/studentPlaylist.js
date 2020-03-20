import PlayListReview from "../author/playlist/playListReview";

class StudenPlaylist extends PlayListReview {
  getPlaylistCardById = id => cy.get(`[data-cy="playlist-${id}"]`);

  getOpenDroppedPlaylist = () => cy.get('[data-cy="open-dropped-playlist"]');

  getPlaylistNameOnCardById = () => this.getPlaylistCardById(id).find('[data-cy="name"]');

  getPlaylistGradeOnCardById = () => this.getPlaylistCardById(id).find('[data-cy="grade"]');

  getPlaylistSubOnCardById = () => this.getPlaylistCardById(id).find('[data-cy="subject"]');

  getStartPractice = (mod, test) => this.getTestByTestByModule(mod, test).find(`[data-cy="START PRACTICE"]`);

  getResumePractice = (mod, test) => this.getTestByTestByModule(mod, test).find('[data-cy="RESUME PRACTICE"]');

  clickOpenDroppedPlaylist = () => this.getOpenDroppedPlaylist().click();

  clickOnPractiseByTestByMod = (mod, test) => this.clickOnPractiseResumeByTestcard(mod, test, true);

  clickOnResumeByTestByMod = (mod, test) => this.clickOnPractiseResumeByTestcard(mod, test);

  clickOnPractiseResumeByTestcard = (mod, test, start = false) => {
    cy.server();
    cy.route("GET", "**/attachments/*").as("loadPracticeTest");
    if (start) this.getStartPractice(mod, test).click();
    else this.getResumePractice(mod, test).click();
    cy.wait("@loadPracticeTest");
  };

  clickOnViewPlaylistById = id => {
    cy.server();
    cy.route("GET", "**/playlists/*").as("loadDropdPlaylist");
    this.getPlaylistCardById(id).click();
    cy.wait("@loadDropdPlaylist").then(xhr => expect(xhr.status).to.eq(200));
    cy.contains("PROFICIENCY");
  };
}
export default StudenPlaylist;
