import EditToolBar from "../common/editToolBar";
import Header from "../../itemDetail/header";

class EssayPlainTextPage {
  constructor() {
    this.editToolBar = new EditToolBar();
    this.header = new Header();
  }

  // question Authoring

  getQuestionEditor = () => cy.get('[data-cy="questiontext"]').find('[contenteditable="true"]');

  // Action formatting options
  getCopyCheckBox = () => cy.get('[data-cy="questionEssayPlainEditCopy"]');

  getCutCheckBox = () => cy.get('[data-cy="questionEssayPlainEditCut"]');

  getPasteCheckBox = () => cy.get('[data-cy="questionEssayPlainEditPaste"]');

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

  getMinHeightOption = () => cy.get('[data-cy="minHeightOption"]');

  getMaxHeightOption = () => cy.get('[data-cy="maxHeightOption"]');

  getPlaceholderOption = () => cy.get('[data-cy="placeholderOption"]');

  getFontSizeOption = () => cy.get('[data-cy="fontSizeOption"]');

  // on preview
  getTextEditor = () => cy.get(".ant-input").should("be.visible");

  getCopy = () => cy.get('[data-cy="questionPlainEssayAuthorPreviewToolCopy"]');

  getCut = () => cy.get('[data-cy="questionPlainEssayAuthorPreviewToolCut"]');

  getPaste = () => cy.get('[data-cy="questionPlainEssayAuthorPreviewToolPaste"]');

  getWordCount = () => cy.get('[data-cy="questionPlainEssayAuthorPreviewWordCount"]');

  // ACTION STARTS

  clcikOnCopy = () => this.getCopy().click();

  clickOnpaste = () => this.getPaste().click();

  clickOnCut = () => this.getCut().click();

  // ACTION ENDS
}

export default EssayPlainTextPage;
