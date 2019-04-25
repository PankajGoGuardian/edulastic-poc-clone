import Header from "./header";

class PreviewItemPage {
  constructor() {
    this.header = new Header();
  }

  getCheckAnswer = () => cy.get('[data-cy="check-answer-btn"]').should("be.visible");

  getShowAnswer = () => cy.get('[data-cy="show-answers-btn"]').should("be.visible");

  getClear = () => cy.get('[data-cy="clear-btn"]').should("be.visible");

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
