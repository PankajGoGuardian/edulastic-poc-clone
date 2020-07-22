// / <reference types="Cypress"/>
import EditToolBar from "../common/editToolBar";
import Header from "../../itemDetail/header";

class EssayShortTextPage {
  constructor() {
    this.editToolBar = new EditToolBar();
    this.header = new Header();
  }

  // getQuestionEditor = () => cy.get(".fr-element").eq(0); Can be removed if below line works fine
  getQuestionEditor = () => cy.get('[data-cy="compose-question-quill-component"]');

  // scoring block -> move to common utitly
  getScoreInput = () => cy.get('[data-cy="maxscore"]');

  getGradingRubricModal = () => cy.get('[data-cy="GradingRubricModal"]');

  getScoringInstructions = () => cy.get('[data-cy="scoringInstructions"]');

  getSetShowWordLimit = () => cy.get('[data-cy="setShowWordLimit"]');

  getShowWordCount = () => cy.get('[data-cy="showWordCount"]');

  getBrowserSpellCheckOption = () => cy.get('[data-cy="browserSpellCheckOption"]');

  // Display block
  getSpecialCharactersOption = () => cy.get('[data-cy="specialCharactersOption"]');

  getCharactersToDisplayOption = () => cy.get('[data-cy="charactersToDisplayOption"]');

  getPlaceholderOption = () => cy.get('[data-cy="placeholderOption"]');

  getFontSizeOption = () => cy.get('[data-cy="fontSizeOption"]');


  // on preview
  // ACTION STARTS

  clcikOnCopy = () => this.getCopy().click();

  clickOnpaste = () => this.getPaste().click();

  clickOnCut = () => this.getCut().click();

// ACTION ENDS
}

export default EssayShortTextPage;
