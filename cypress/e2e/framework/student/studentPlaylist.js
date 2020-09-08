import PlayListReview from "../author/playlist/playListReview";

class StudenPlaylist extends PlayListReview {
  getPlaylistNameOnCardById = () => this.getPlaylistCardById(id).find('[data-cy="name"]');

  getPlaylistGradeOnCardById = () => this.getPlaylistCardById(id).find('[data-cy="grade"]');

  getPlaylistSubOnCardById = () => this.getPlaylistCardById(id).find('[data-cy="subject"]');

  getStartPractice = (mod, test) => this.getTestByTestByModule(mod, test).find(`[data-cy="START PRACTICE"]`);

  getResumePractice = (mod, test) => this.getTestByTestByModule(mod, test).find('[data-cy="RESUME PRACTICE"]');

  clickOnPractiseByTestByMod = (mod, test) => this.clickOnPractiseResumeByTestcard(mod, test, true);

  clickOnResumeByTestByMod = (mod, test) => this.clickOnPractiseResumeByTestcard(mod, test);

  clickOnPractiseResumeByTestcard = (mod, test, start = false) => {
    cy.server();
    cy.route("GET", "**/attachments/*").as("loadPracticeTest");
    if (start) this.getStartPractice(mod, test).click();
    else this.getResumePractice(mod, test).click();
    cy.wait("@loadPracticeTest");
  };
}
export default StudenPlaylist;
