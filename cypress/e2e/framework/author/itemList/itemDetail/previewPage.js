import Header from "./header";

class PreviewItemPage {
  constructor() {
    this.header = new Header();
  }

  getCheckAnswer = () =>
    cy
      .get("body")
      .contains("Check Answer")
      .should("be.visible");

  getShowAnswer = () =>
    cy
      .get("body")
      .contains("Show Answers")
      .should("be.visible");

  getClear = () =>
    cy
      .get("body")
      .contains("Clear")
      .should("be.visible");

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
