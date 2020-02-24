import Header from "./header";

class PreviewItemPage {
  constructor() {
    this.header = new Header();
  }

  getCheckAnswer = () => cy.get('[data-cy="check-answer-btn"]');

  getShowAnswer = () => cy.get('[data-cy="show-answers-btn"]');

  getClear = () => cy.get('[data-cy="clear-btn"]');

  getAntMsg = () => cy.get(".ant-message-custom-content");

  clickOnClear = () => this.getClear().click({ force: true });

  checkOnCheckAnswer = () => this.getCheckAnswer().click({ force: true });

  checkScore = expectedScore => {
    this.getCheckAnswer()
      .click()
      .then(() => {
        this.getAntMsg().should("contain", `score: ${expectedScore}`);
      });

    return this;
  };

  getScore = () => cy.get('[data-cy="score"]');

  verifyScore = score => {
    this.getScore().should("contain.text", `Score ${score}`);
  };
}

export default PreviewItemPage;
