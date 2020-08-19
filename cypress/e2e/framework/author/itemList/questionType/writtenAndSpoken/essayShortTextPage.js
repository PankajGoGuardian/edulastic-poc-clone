// / <reference types="Cypress"/>
import EditToolBar from "../common/editToolBar";
import Header from "../../itemDetail/header";

class EssayShortTextPage {
  constructor() {
    this.editToolBar = new EditToolBar();
    this.header = new Header();
  }

  getQuestionEditor = () => cy.get(".fr-element").eq(0);

  getCorrectValue = () => cy.get('[wrap="wrap"]').find('[type="text"]');

  // scoring block -> move to common utitly
  getScoreInput = () => cy.get('[data-cy="maxscore"]');

  getGradingRubricModal = () => cy.get('[data-cy="GradingRubricModal"]');

  getScoringInstructions = () => cy.get('[data-cy="scoringInstructions"]');

  getBrowserSpellCheckOption = () => cy.get('[data-cy="browserSpellCheckOption"]');

  // Display block
  getSpecialCharactersOption = () => cy.get('[data-cy="specialCharactersOption"]');

  getCharactersToDisplayOption = () => cy.get('[data-cy="charactersToDisplayOption"]');

  getPlaceholderOption = () => cy.get('[data-cy="placeholderOption"]');

  getFontSizeOption = () => cy.get('[data-cy="fontSizeOption"]');

  // on preview
  getAnswerBox = () => cy.get('[data-cy="essayShortAuthorPreview"]');

  // ACTION STARTS

  // ACTION ENDS
}

export default EssayShortTextPage;
