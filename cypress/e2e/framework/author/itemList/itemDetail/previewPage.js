import Header from "./header";

class PreviewItemPage {
  constructor() {
    this.header = new Header();
  }
  // *** ELEMENTS START ***

  getCheckAnswer = () => cy.get('[data-cy="check-answer-btn"]');

  getShowAnswer = () => cy.get('[data-cy="show-answers-btn"]');

  getClear = () => cy.get('[data-cy="clear-btn"]');

  getAntMsg = () => cy.get(".ant-message-custom-content");

  getScore = () => cy.get('[data-cy="score"]');

  // *** ELEMENTS END ***

  // *** ACTIONS START ***

  clickOnClear = () => this.getClear().click({ force: true });

  checkOnCheckAnswer = () => this.getCheckAnswer().click({ force: true });

  // *** ACTIONS END ***

  // *** APPHELPERS START ***

  checkScore = expectedScore => {
    this.getCheckAnswer()
      .click()
      .then(() => {
        this.getAntMsg().should("contain", `score: ${expectedScore}`);
      });

    return this;
  };

  verifyScore = score => {
    this.getScore().should("contain.text", `Score ${score}`);
  };

  // *** APPHELPERS END ***
}

export default PreviewItemPage;
