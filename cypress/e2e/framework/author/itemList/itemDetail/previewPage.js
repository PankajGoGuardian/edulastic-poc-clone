import Header from "./header";
import { queColor } from "../../../constants/questionTypes";

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

  checkOnShowAnswer = () => this.getShowAnswer().click({ force: true });
  // *** ACTIONS END ***

  // *** APPHELPERS START ***

  checkScore = expectedScore => {
    const score = expectedScore.toString().split("/");
    console.log(score, score[0], score[1]);
    let label;
    let color;
    switch (+score[0]) {
      case 0:
        label = "Incorrect";
        color = queColor.LIGHT_RED1;
        break;
      case +score[1]:
        label = "Correct";
        color = queColor.LIGHT_GREEN1;
        break;
      default:
        label = "Partially Correct";
        color = queColor.ORANGE_3;
    }
    this.getCheckAnswer()
      .click()
      .then(() => {
        this.getScore().should("have.text", `${label} (${expectedScore})`);
        this.getScore()
          .parent()
          .should("have.css", "background-color", color);
      });

    return this;
  };

  verifyScore = score => {
    this.getScore().should("contain.text", `Score ${score}`);
  };

  // *** APPHELPERS END ***
}

export default PreviewItemPage;
