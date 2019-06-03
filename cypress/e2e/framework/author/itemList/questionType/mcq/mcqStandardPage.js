import EditToolBar from "../common/editToolBar";
import Header from "../../itemDetail/header";
import EditPage from "../../itemDetail/editPage";
import { questionType, questionGroup } from "../../../../constants/questionTypes";

class MCQStandardPage {
  constructor() {
    this.orientationOption = { Horizontal: "horizontal", Vertical: "vertical" };

    this.styleOptions = { Standard: "standard", Block: "block", "Radio Button Below": "radioBelow" };

    this.labelOption = {
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

    this.scoringTypeOption = { "Exact match": "exactMatch", "Partial match": "partialMatch" };

    this.editToolBar = new EditToolBar();

    this.formates = [
      {
        sel: ".ql-bold",
        tag: "strong"
      },
      {
        sel: ".ql-italic",
        tag: "em"
      },
      {
        sel: ".ql-underline",
        tag: "u"
      },
      {
        sel: ".ql-strike",
        tag: "s"
      },
      {
        sel: '[value="sub"]',
        tag: "sub"
      },
      {
        sel: '[value="super"]',
        tag: "sup"
      },
      {
        sel: '[value="1"]',
        tag: "h1"
      },
      {
        sel: '[value="2"]',
        tag: "h2"
      },
      {
        sel: ".ql-blockquote",
        tag: "blockquote"
      },
      {
        sel: ".ql-code-block",
        tag: "pre"
      }
    ];

    this.header = new Header();
  }

  // question content
  getQuestionEditor = () => cy.get('[data-cy="questiontext"]').find('[contenteditable="true"]');

  // choices
  getChoiceByIndex = index => {
    // const selector = `#idprefix${index}`;
    return cy
      .get('[data-cy="compose-question-quill-component"]')
      .eq(index)
      .find(".fr-element");
  };

  deleteChoiceByIndex(index) {
    const selector = `[data-cy=deleteprefix${index}]`;
    cy.get(selector).click();
    return this;
  }

  getAllChoices = () =>
    cy
      .get('[data-cy="sortable-list-container"]')
      .first()
      .find(".fr-element");
  // .find(".ql-editor");

  getAllAnsChoicesLabel = () =>
    cy
      .get('[data-cy="tabs"]')
      .parent()
      .find("label");

  addNewChoice() {
    cy.get('[data-cy="add-new-ch"]')
      .should("be.visible")
      .click();
    return this;
  }

  // correct ans

  getPoints = () => cy.get('[data-cy="points"]').should("be.visible");

  getCorrectAnsOptions = () =>
    cy
      .contains("div", "Set Correct Answer(s)")
      .next()
      .children()
      .contains("label");

  addAlternate() {
    cy.get('[data-cy="alternate"]')
      .should("be.visible")
      .click();
    return this;
  }

  getAlternates = () =>
    cy
      .contains("div", "Set Correct Answer(s)")
      .next()
      .contains("span", "Alternate");

  deleteAlternate() {
    return this;
  }

  getMultipleResponse = () => cy.get('[data-cy="multi"]').closest("label");

  // advance options
  clickOnAdvancedOptions() {
    cy.contains("span", "Advanced Options")
      .should("be.visible")
      .click();
    return this;
  }

  getStyleOption = () => cy.get('[data-cy="styleSelect"]').should("be.visible");

  selectChoicesStyle(option) {
    const selectOp = `[data-cy="${this.styleOptions[option]}"]`;
    this.getStyleOption().click();
    cy.get(selectOp)
      .should("be.visible")
      .click();

    this.getStyleOption()
      .find(".ant-select-selection-selected-value")
      .should("contain", option);

    return this;

    /*    cy.contains("label", "Style")
      .next()
      .find('[data-cy="selectStyle"]')
      .select(option)
      .should("have.value", this.styleOptions[option]);
    return this; */
  }

  getLabelType = () => cy.get('[data-cy="labelTypeSelect"]').should("be.visible");

  selectLabelType(option) {
    const selectOp = `[data-cy="${this.labelOption[option]}"]`;
    this.getLabelType().click();

    cy.get(selectOp)
      .should("be.visible")
      .click();

    this.getLabelType()
      .find(".ant-select-selection-selected-value")
      .should("contain", option);

    return this;
  }

  selectOrientation(option) {
    const selectOp = `[data-cy="${this.orientationOption[option]}"]`;
    cy.get('[data-cy="orientationSelect"]')
      .should("be.visible")
      .click();

    cy.get(selectOp)
      .should("be.visible")
      .click();

    cy.get('[data-cy="orientationSelect"]')
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

  getPanalty = () => cy.get('[data-cy="penalty"]').should("be.visible");

  getCheckAnsAttempt = () => cy.get('[data-cy="checkAttempts"]').should("be.visible");

  getEnableAutoScoring = () =>
    cy
      .contains("Enable auto scoring")
      .children()
      .eq(0)
      .should("be.visible");

  getMinScore = () => cy.get("[data-cy=minscore]").should("be.visible");

  getMaxScore = () => cy.get('[data-cy="maxscore"]').should("be.visible");

  getCheckAnswerCheckbox = () =>
    cy
      .contains("Check answer button")
      .children()
      .eq(0)
      .should("be.visible");

  getUnscore = () =>
    cy
      .contains("Unscored")
      .children()
      .eq(0)
      .should("be.visible");

  getNumofCol = () => cy.get('[data-cy="columns"]');

  getSource = () => cy.get('[data-cy="source"]').should("be.visible");

  getCancel = () => cy.contains("Cancel").should("be.visible");

  // default question
  createQuestion(queKey = "default", queIndex = 0) {
    const item = new EditPage();
    item.createNewItem();
    item.chooseQuestion(questionGroup.MCQ, questionType.MCQ_STD);
    cy.fixture("questionAuthoring").then(authoringData => {
      const { quetext, choices, setAns } = authoringData.MCQ_STD[queKey];

      if (quetext) {
        const text = `Q${queIndex + 1} - ${quetext}`;
        this.getQuestionEditor()
          .clear()
          .type(text);
      }

      if (choices) {
        const choicesCount = choices.length;
        this.getAllChoices().then(allChoices => {
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

      if (setAns) {
        const { correct, points } = setAns;
        // uncheck default ans
        this.getAllAnsChoicesLabel()
          .find("input:checked")
          .click({ force: true });

        this.getAllAnsChoicesLabel()
          .contains(correct)
          .click();

        this.header.save();

        item.updateItemLevelScore(points);
        item.header.save();
      }
    });
  }
}

export default MCQStandardPage;
