// / <reference types="Cypress"/>
import EditToolBar from "../common/editToolBar";
import Header from "../../itemDetail/header";
import EditItemPage from "../../itemDetail/editPage";
import Helpers from "../../../../util/Helpers";

class EssayShortTextPage {
  constructor() {
    this.editItemPage = new EditItemPage();
    this.editToolBar = new EditToolBar();
    this.header = new Header();
  }

  getQuestionEditor = () => cy.get(".fr-element").eq(0);

  getCorrectValue = () => cy.get('[wrap="wrap"]').find('[type="text"]');

  getAddAlternative = () => cy.get('[data-cy="alternate"]');

  getAddedAlternateTab = () => cy.contains("span", "Alternate 1");

  // scoring block -> move to common utitly

  getPontsInput = () => cy.get('[data-cy="points"]');

  getScoringOption = () => cy.get('[data-cy="scoringOption"]');

  updatePoints = points => this.getPontsInput().type(`{selectall}${points}`);

  getScoreInput = () => cy.get('[data-cy="maxscore"]');

  getGradingRubricModal = () => cy.get('[data-cy="GradingRubricModal"]');

  getScoringInstructions = () => cy.get('[data-cy="scoringInstructions"]');

  getBrowserSpellCheckOption = () => cy.get('[data-cy="browserSpellCheckOption"]');

  deleteAlternativeAnswer = () => cy.get('[data-cy="del-alter"]');

  // advance options
  clickOnAdvancedOptions() {
    this.editItemPage.showAdvancedOptions();
    return this;
  }

  // Display block

  getInputTypeSelect = () => cy.get('[data-cy="inputTypeSelect"]');

  getSpecialCharactersOption = () => cy.get('[data-cy="specialCharactersOption"]');

  getPlaceholderOption = () => cy.get('[data-cy="placeholder"]').next();

  getFontSizeOption = () => cy.get('[data-cy="fontSizeOption"]');

  getFontSizeSelect() {
    return Helpers.getElement("fontSizeSelect");
  }

  // on preview
  getAnswerBox = () => cy.get('[data-cy="essayShortAuthorPreview"]');

  getSpecialCharacterOption = () => cy.get("[class^=Addon]");

  getQuestionTextInpreview = () => cy.get('[data-cy="styled-wrapped-component"]');

  getShowAnswerContainer = () => cy.get("[class^=ShortTextPreview]");

  getSpecialCharacterInput = () => cy.get('[data-cy="charactersToDisplay"]').next();

  // ACTION STARTS

  selectFont(value) {
    this.getFontSizeSelect().click();
    this.getFontSize(value).click();
  }

  checkFontSize(fontSize) {
    this.header.preview();
    this.getQuestionTextInpreview()
      .should("have.css", "font-size")
      .and("eq", fontSize);

    this.header.edit();
  }

  selectAllowMethod = value => {
    this.getScoringOption()
      .click()
      .then(() => {
        cy.get(".ant-select-dropdown-menu")
          .contains(value)
          .click();
      });
    this.getScoringOption().should("contain.text", value);
  };

  selectSpecialCharacterInPreview = value => {
    this.getSpecialCharacterOption().click({ force: true });
    cy.get("[class^=CharacterMap]")
      .children()
      .eq(2)
      .click();
    this.getAnswerBox().should("have.attr", "value", value);
  };

  selectFontSize(option) {
    const selectOp = `[data-cy="${this.fontSizeOption[option]}"]`;
    this.getFontSizeOption()
      .should("be.visible")
      .click();

    cy.get(selectOp)
      .should("be.visible")
      .click({ force: true });

    this.getFontSizeOption()
      .find(".ant-select-selection-selected-value")
      .should("contain", option);

    return this;
  }
  getFontSize(value) {
    return Helpers.getElement(value);
  }

  selectInputType = value => {
    this.getInputTypeSelect()
      .click()
      .then(() => {
        cy.get(".ant-select-dropdown-menu")
          .contains(value)
          .click();
      });
    this.getInputTypeSelect().should("contain.text", value);
  };

  // ACTION ENDS
}

export default EssayShortTextPage;
