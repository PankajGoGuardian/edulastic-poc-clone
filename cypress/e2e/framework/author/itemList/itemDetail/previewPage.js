import Header from "./header";

class PreviewItemPage {
  constructor() {
    this.header = new Header();
  }

  getCheckAnswer = () => cy.get('[data-cy="check-answer-btn"]');

  getShowAnswer = () => cy.get('[data-cy="show-answers-btn"]');

  getClear = () => cy.get('[data-cy="clear-btn"]');

  getAntMsg = () => cy.get(".ant-message-notice-content");

  checkScore = expectedScore => {
    this.getCheckAnswer()
      .click()
      .then(() => {
        this.getAntMsg().should("contain", `score: ${expectedScore}`);
      });

    return this;
  };
}

export default PreviewItemPage;
