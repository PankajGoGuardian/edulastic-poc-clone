/* eslint-disable class-methods-use-this */
import Header from "../../itemDetail/header";
import Helpers from "../../../../util/Helpers";
import EditItemPage from "../../itemDetail/editPage";
import { questionType, questionGroup, questionTypeKey } from "../../../../constants/questionTypes";
import { CypressHelper } from "../../../../util/cypressHelpers";

class ChoiceMatrixStandardPage {
  constructor() {
    this.header = new Header();

    this.numerationOption = {
      Numerical: "number",
      "Uppercase alphabet": "upper-alpha",
      "Lowercase alphabet": "lower-alpha"
    };

    this.fontSizeOption = {
      Small: "small",
      Normal: "normal",
      Large: "large",
      "Extra Large": "xlarge",
      Huge: "xxlarge"
    };

    this.matrixOption = {
      Inline: "inline",
      Table: "table"
    };

    this.stemNumerationOption = {
      Numerical: "number",
      "Uppercase alphabet": "upper-alpha",
      "Lowercase alphabet": "lower-alpha"
    };

    this.scoringTypeOption = { "Exact match": "exactMatch", "Partial match": "partialMatch" };
  }

  // question content
  getQuestionEditor = () => cy.get('[data-cy="questiontext"]').find('[contenteditable="true"]');

  setQuestionEditorText = text =>
    this.getQuestionEditor()
      .clear({ force: true })
      .type(text);

  markAnswerInput = (index, element, target) =>
    cy
      .get("tbody > tr")
      .eq(index)
      .find("td")
      .eq(element)
      .find(target)
      .click();

  // choices
  getChoiceByIndex(index) {
    /*  const selector = `#idlist1${index}`;
    return cy
      .get(selector)
      .next()
      .find(".ql-editor");
 */
    return this.getallChoices().eq(index);
  }

  deleteChoiceByIndex(index) {
    const selector = `[data-cy=deletelist1${index}]`;
    cy.get(selector).click();
    return this;
  }

  getallChoices() {
    return cy
      .get('[data-cy="sortable-list-container"]')
      .first()
      .find(".fr-element");
    // .find(".ql-editor");
  }

  addNewChoice() {
    cy.get(":nth-child(2) > [data-cy=addButton]")
      .should("be.visible")
      .click();
    return this;
  }

  // steams
  getSteamByIndex(index) {
    /*  const selector = `#idlist2${index}`;
    return cy
      .get(selector)
      .next()
      .find(".ql-editor"); */
    return this.getallSteam().eq(index);
  }

  deleteSteamByIndex(index) {
    const selector = `[data-cy=deletelist2${index}]`;
    cy.get(selector).click();
    return this;
  }

  getallSteam() {
    return cy
      .get('[data-cy="sortable-list-container"]')
      .eq(1)
      .find(".fr-element");
    // .find(".ql-editor");
  }

  addNewSteam() {
    cy.get(":nth-child(3) > [data-cy=addButton]")
      .should("be.visible")
      .click();
    return this;
  }

  getMaxScore() {
    return cy.get('[data-cy="maxscore"]').should("be.visible");
  }

  selectScoringType(option) {
    const selectOp = `[data-cy="${this.scoringTypeOption[option]}"]`;
    cy.get('[data-cy="scoringType"]')
      .should("be.visible")
      .click();

    cy.get(selectOp)
      .should("be.visible")
      .click();

    cy.get('[data-cy="scoringType"]')
      .find(".ant-select-selection-selected-value")
      .should("contain", option);

    return this;
  }

  getPenalty() {
    return cy.get('[data-cy="penalty"]').should("be.visible");
  }

  getMinScore() {
    return cy.get('[data-cy="minscore"]').should("be.visible");
  }

  getEnableAutoScoring() {
    return cy.contains("Enable auto scoring").should("be.visible");
  }

  getPoints() {
    return cy.get('[data-cy="points"]').should("be.visible");
  }

  // correct ans
  getCorrectAnsTableRow() {
    return cy
      .get('[data-cy="matrixTable"]')
      .children()
      .get("tr.ant-table-row");
  }

  addAlternate() {
    cy.get('[data-cy="alternate"]')
      .should("be.visible")
      .click();
    return this;
  }

  getAlternateTabs() {
    return cy.get("[data-cy=tabs]").contains("span", "Alternate");
  }

  deleteAlternate() {
    cy.get('[data-cy="del-alter"]')
      .should("be.visible")
      .click();

    // switch back to correct ans tab
    cy.get("[data-cy=correct]")
      .should("be.visible")
      .click();
    return this;
  }

  getMultipleResponse() {
    return cy.contains("Multiple responses").should("be.visible");
  }

  // advance options
  clickOnAdvancedOptions() {
    cy.get("body")
      .contains("ADVANCED OPTIONS")
      .should("be.visible")
      .click();
    return this;
  }

  selectMatrixStyle(option) {
    const selectOp = `[data-cy="${this.matrixOption[option]}"]`;
    cy.get('[data-cy="matrixStyle"]')
      .should("be.visible")
      .click()
      .as("matrixStyle");

    cy.get(selectOp)
      .should("be.visible")
      .click();

    cy.get("@matrixStyle")
      .find(".ant-select-selection-selected-value")
      .should("contain", option);

    return this;
  }

  selectStemNumeration(option) {
    const selectOp = `[data-cy="${this.stemNumerationOption[option]}"]`;
    cy.get('[data-cy="stemNum"]')
      .should("be.visible")
      .click();

    cy.get(selectOp)
      .should("be.visible")
      .click();

    cy.get('[data-cy="stemNum"]')
      .find(".ant-select-selection-selected-value")
      .should("contain", option);

    return this;
  }

  selectFontSize(option) {
    const selectOp = `[data-cy="${this.fontSizeOption[option]}"]`;
    cy.get('[data-cy="fontSizeSelect"]')
      .should("be.visible")
      .click();

    cy.get(selectOp)
      .should("be.visible")
      .click();

    cy.get('[data-cy="fontSizeSelect"]')
      .find(".ant-select-selection-selected-value")
      .should("contain", option);

    return this;
  }

  getLayout() {
    return Helpers.getElement("layout").should("be.visble");
  }

  getFontSizeSelect() {
    return Helpers.getElement("fontSizeSelect");
  }

  getSmallFontSizeOption() {
    return Helpers.getElement("small");
  }

  getNormalFontSizeOption() {
    return Helpers.getElement("normal");
  }

  getLargeFontSizeOption() {
    return Helpers.getElement("large");
  }

  getExtraLargeFontSizeOption() {
    return Helpers.getElement("xlarge");
  }

  getHugeFontSizeOption() {
    return Helpers.getElement("xxlarge");
  }

  getMatrixTable() {
    return Helpers.getElement("matrixTable")
      .find("table")
      .should("be.visible");
  }

  getStemNumerationSelect() {
    return Helpers.getElement("stemNum");
  }

  checkFontSize(fontSize) {
    this.header.preview();
    this.getMatrixTable()
      .should("have.css", "font-size")
      .and("eq", fontSize);

    this.header.edit();
  }

  checkMatrixStyle(option) {
    this.header.preview();

    if (option === "Inline") {
      this.getMatrixTable()
        .find("thead th div > span")
        .each($el => {
          cy.wrap($el).should("be.empty");
        });
    }

    if (option === "Table") {
      this.getMatrixTable()
        .find("thead tr")
        .eq(1)
        .find("div")
        .each($el => {
          cy.wrap($el).should("not.be.empty");
        });
    }

    this.header.edit();
  }

  checkDividers(checked) {
    this.header.preview();

    if (checked) {
      this.getMatrixTable()
        .find("tbody td")
        .each($el => {
          cy.wrap($el)
            .should("have.css", "border-top-width")
            .and("eq", "1px");

          cy.wrap($el)
            .should("have.css", "border-bottom-width")
            .and("eq", "1px");
        });
    } else {
      this.getMatrixTable()
        .find("tbody td")
        .each($el => {
          cy.wrap($el)
            .should("have.css", "border-top-width")
            .and("eq", "0px");

          cy.wrap($el)
            .should("have.css", "border-bottom-width")
            .and("eq", "0px");
        });
    }

    this.header.edit();
  }

  checkStemNumeration(type) {
    this.header.preview();
    const upperLetters = ["A", "B", "C", "D"];
    const lowerLetters = ["a", "b", "c", "d"];

    // eslint-disable-next-line default-case
    switch (type) {
      case "number":
        this.getMatrixTable()
          .find("tbody tr td:first-child")
          .each(($el, index) => {
            cy.wrap($el).should("contain", `${index + 1}`);
          });
        break;
      case "upper-alpha":
        this.getMatrixTable()
          .find("tbody tr td:first-child")
          .each(($el, index) => {
            cy.wrap($el).should("contain", upperLetters[index]);
          });
        break;
      case "lower-alpha":
        this.getMatrixTable()
          .find("tbody tr td:first-child")
          .each(($el, index) => {
            cy.wrap($el).should("contain", lowerLetters[index]);
          });
        break;
    }

    this.header.edit();
  }

  getStemColumnTitle() {
    return Helpers.getElement("stemColumnTitle")
      .next()
      .find(".ql-editor");
  }

  checkTableTitle(text) {
    this.header.preview();

    this.getMatrixTable()
      .find("thead")
      .should("contain", text);

    this.header.edit();
  }

  checkTableColumnWidth(columnIndex, width) {
    this.header.preview();

    this.getMatrixTable()
      .find("tbody tr")
      .eq(0)
      .find("td")
      .eq(columnIndex)
      .should("have.css", "width")
      .and("eq", `${width}px`);

    this.header.edit();
  }

  getOptionRowTitle() {
    return Helpers.getElement("optionRowTitle")
      .next()
      .find(".ql-editor");
  }

  getStemWidth() {
    return Helpers.getElement("stemWidth");
  }

  getOptionWidth() {
    return Helpers.getElement("optionWidth");
  }

  getDividersCheckbox() {
    return Helpers.getElement("dividersCheckbox");
  }

  createQuestion(queType, queKey = "default", queIndex = 0) {
    const item = new EditItemPage();
    item.createNewItem();
    item.chooseQuestion(questionGroup.MCQ, questionType[queType]);
    cy.fixture("questionAuthoring").then(authoringData => {
      const { quetext, choices, setAns, steams } = authoringData[queType][queKey];

      if (quetext) {
        const text = `Q${queIndex + 1} - ${quetext}`;
        this.setQuestionEditorText(text);
      }

      if (choices) {
        const choicesCount = choices.length;
        this.getallChoices().then(allChoices => {
          const defaultChoiceCount = allChoices.length;
          let choiceDiff = defaultChoiceCount - choicesCount;
          while (choiceDiff > 0) {
            this.deleteChoiceByIndex(0);
            choiceDiff -= 1;
          }
          while (choiceDiff < 0) {
            this.addNewChoice();
            choiceDiff += 1;
          }
          choices.forEach((choice, index) => {
            this.getChoiceByIndex(index)
              .clear()
              .type(choice);
          });
        });
      }

      if (steams) {
        const steamsCount = steams.length;
        this.getallSteam().then(allSteams => {
          const defaultSteamCount = allSteams.length;
          let steamDiff = defaultSteamCount - steamsCount;
          while (steamDiff > 0) {
            this.deleteSteamByIndex(0);
            steamDiff -= 1;
          }
          while (steamDiff < 0) {
            this.addNewSteam();
            steamDiff += 1;
          }
          steams.forEach((steam, index) => {
            this.getSteamByIndex(index)
              .clear()
              .type(steam);
          });
        });
      }

      if (setAns) {
        const { correct, points, evaluation } = setAns;
        /*  this.getPoints()
          .clear()
          .type(`{rightarrow}${points}`);
 */
        Object.keys(correct).forEach(chKey => {
          this.getCorrectAnsTableRow()
            .contains(chKey)
            .closest("tr")
            .then(ele => {
              cy.wrap(ele)
                .find("input")
                .eq(steams.indexOf(correct[chKey]))
                .click();
            });
        });

        this.clickOnAdvancedOptions();
        // set evaluation type
        if (evaluation) {
          // this.getEnableAutoScoring().click({ force: true });
          CypressHelper.selectDropDownByAttribute("scoringType", evaluation);
        }

        this.header.save();
        item.updateItemLevelScore(points);
        item.header.save(true);
      }
    });
  }
}

export default ChoiceMatrixStandardPage;
