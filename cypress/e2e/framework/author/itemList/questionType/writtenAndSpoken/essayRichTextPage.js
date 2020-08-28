import EditToolBar from "../common/editToolBar";
import Header from "../../itemDetail/header";
import EditItemPage from "../../itemDetail/editPage";
import { questionGroup, questionType, queColor } from "../../../../constants/questionTypes";
import Helpers from "../../../../util/Helpers";

class EssayRichTextPage {
  constructor() {
    this.editItemPage = new EditItemPage();
    this.editToolBar = new EditToolBar();
    this.header = new Header();
  }

  getQuestionEditor = () => cy.get(".fr-element").eq(0);
  // Text formatting options

  // scoring block -> move to common utitly
  getScoreInput = () => cy.get('[data-cy="maxscore"]');

  getGradingRubricModal = () => cy.get('[data-cy="GradingRubricModal"]');

  getScoringInstructions = () => cy.get('[data-cy="scoringInstructions"]');

  getSetShowWordLimit = () => cy.get('[data-cy="setShowWordLimit"]');

  getShowWordCount = () => cy.get('[data-cy="showWordCount"]');

  getBrowserSpellCheckOption = () => cy.get('[data-cy="browserSpellCheckOption"]');

  getPlaceHolderInPreview = () => this.getPreviewBox().find("[class^=fr-placeholder]");

  getFontSizeSelect() {
    return Helpers.getElement("fontSizeSelect");
  }

  getFontSize(value) {
    return Helpers.getElement(value);
  }

  // advance options
  clickOnAdvancedOptions() {
    this.editItemPage.showAdvancedOptions();
    return this;
  }

  // Display block
  getSpecialCharactersOption = () => cy.get('[data-cy="specialCharactersOption"]');

  getCharactersToDisplay = () => cy.get('[data-cy="charactersToDisplay"]').next();

  getMinHeightOption = () => cy.get('[data-cy="minHeightOption"]').next();

  getMaxHeightOption = () => cy.get('[data-cy="maxHeightOption"]').next();

  getPlaceholderOption = () => cy.get('[data-cy="placeholder"]').next();

  getFontSizeOption = () => cy.get('[data-cy="fontSizeOption"]');

  getWordlimitOptions = () => cy.get('[data-cy="wordLimitOptions"]');

  getWordLimitInput = () => cy.get('[data-cy="wordLimitInput"]');

  getWordCount = () => cy.get('[data-cy="questionPlainEssayAuthorPreviewWordCount"]');

  // on preview
  getTextEditor = () => cy.get('*[class^="EssayRichTextPreview"]').find('[contenteditable="true"]');

  getTextInPreview = () => this.getTextEditor().find("p");

  getWordCount = () => cy.get('[data-cy="questionRichEssayAuthorPreviewWordCount"]');

  getPreviewBox = () => cy.get('[data-cy="previewBoxContainer"]');

  getPreviewBoxContainer = () => this.getPreviewBox().find('[contenteditable="true"]');

  getSpecialCharacterOptionInPreview = () => cy.get('[data-cmd="specialCharacters"]');

  // TOOL BAR Options

  getToolBarOptionInPreview = value => cy.get(`[data-cmd="${value}"]`);

  getMathInputField = () => cy.get('[data-cy="answer-math-input-field"]');

  getToolBarOptionInEditMode = value => cy.get(`[data-cy="${value}"]`);

  selectOptions = value => cy.get(`[data-param1="${value}"]`).click();

  verifySeparatorVisibilityAfter = value => {
    this.getToolBarOptionInPreview(value)
      .next()
      .should("have.class", "fr-separator");
  };

  verifyMathInput = value => {
    this.getMathInputField().type(value);
    cy.get("button")
      .contains("OK")
      .click({ force: true })
      .then(() => {
        cy.get(`[data-latex="${value}"`).should("be.visible");
      });
  };

  selectToolBarOptionInEditMode = value => {
    this.getToolBarOptionInEditMode(value).then($ele => {
      if ($ele.css("background-color") !== queColor.BLUE_2) {
        cy.wrap($ele).click();
      }
    });
    this.getToolBarOptionInEditMode(value).should("have.css", "background-color", queColor.BLUE_2);
  };

  unselectAllToolBarOptions = value => {
    this.getToolBarOptionInEditMode(value).then($ele => {
      if ($ele.css("background-color") === queColor.BLUE_2) {
        cy.wrap($ele).click();
      }
    });
  };

  addTableWithCells = (row, column) => {
    cy.get('[data-cmd="tableInsert"]')
      .find(`[data-row="${row}"][data-col="${column}"]`)
      .click();
  };

  getInsertLinkInputWithIndex = index => cy.get("[class^=fr-link-attr]").eq(index);

  insertLink = (url, text) => {
    this.getInsertLinkInputWithIndex(0).type(url);
    this.getInsertLinkInputWithIndex(1).type(text);
    cy.get('[data-cmd="linkInsert"]').click();
  };
  // ACTION STARTS
  createQuestion(queKey = "default", queIndex = 0, onlyItem = true) {
    const item = new EditItemPage();

    item.createNewItem(onlyItem);
    item.chooseQuestion(questionGroup.WRITING, questionType.ESSAY_RICH);
    cy.fixture("questionAuthoring").then(authoringData => {
      const { quetext, setAns } = authoringData.ESSAY_RICH[queKey];

      if (quetext) {
        const text = `Q${queIndex + 1} - ${quetext}`;
        this.getQuestionEditor().type(text);
      }
      if (setAns.points) {
        this.setPoints(setAns.points);
      }
    });
  }

  selectSpecialCharacterInPreview = value => {
    this.getSpecialCharacterOptionInPreview().click();
    cy.get('[data-param1="Custom"]').click();
    cy.get(`[data-param1="${value}"]`).click({ force: true });
    this.getPreviewBoxContainer().should("have.text", value);
  };

  selectFont(value) {
    this.getFontSizeSelect().click();
    this.getFontSize(value).click();
  }

  checkFontSize(fontSize) {
    this.header.preview();
    this.getPreviewBoxContainer()
      .should("have.css", "font-size")
      .and("eq", fontSize);
    this.header.edit();
  }

  selectWordlimitOption = value => {
    this.getWordlimitOptions()
      .click()
      .then(() => {
        cy.get(".ant-select-dropdown-menu")
          .contains(value)
          .click();
      });
    this.getWordlimitOptions().should("contain.text", value);
  };

  verifyMinAndMaxHeightInPreview = (min, max) => {
    this.header.preview();
    this.getPreviewBox()
      .find("[class^=fr-wrapper]")
      .should("have.css", "max-height", `${max}px`);
    this.getPreviewBox()
      .find("[class^=fr-element]")
      .should("have.css", "min-height", `${min - 1}px`);
  };
  // ACTION ENDS
}

export default EssayRichTextPage;
