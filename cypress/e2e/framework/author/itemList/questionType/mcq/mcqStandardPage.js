import EditToolBar from "../common/editToolBar";
import Header from "../../itemDetail/header";
import EditItemPage from "../../itemDetail/editPage";
import { questionType, questionGroup } from "../../../../constants/questionTypes";

class MCQStandardPage {
  constructor() {
    this.orientationOption = { Horizontal: "horizontal", Vertical: "vertical" };

    this.styleOptions = {
      Standard: "standard",
      Block: "block",
      "Radio Button Below": "radioBelow"
    };

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

    this.roundingType = { "Round down": "roundDown", None: "none" };

    this.editToolBar = new EditToolBar();

    this.formates = [
      { tag: "strong", sel: "bold-1" },
      { tag: "em", sel: "italic-1" },
      { tag: "u", sel: "underline-1" },
      { tag: "s", sel: "strikeThrough-1" },
      { tag: "sub", sel: "subscript-1" },
      { tag: "sup", sel: "superscript-1" }
    ];

    this.header = new Header();
  }

  // question content
  getQuestionEditor = () => cy.get('[data-cy="questiontext"]').find('[contenteditable="true"]');

  setQuestionEditorText = text =>
    this.getQuestionEditor()
      .clear({ force: true })
      .type(text);

  // choices
  getChoiceByIndex = index => {
    // const selector = `#idprefix${index}`;
    return cy
      .get('[data-cy="quillSortableItem"]')
      .eq(index)
      .find('[contenteditable="true"]');
  };

  deleteChoiceByIndex(index) {
    const selector = `[data-cy=deleteprefix${index}]`;
    cy.get(selector).click({ force: true });
    return this;
  }

  getAllChoices = () =>
    cy
      .get('[data-cy="sortable-list-container"]')
      .first()
      .find('[data-cy="quillSortableItem"]');
  // .find(".ql-editor");

  getAllAnsChoicesLabel = () => cy.get('[data-cy="anwer-labels"]');

  addNewChoice() {
    cy.get('[data-cy="add-new-ch"]')
      .eq(0)
      .should("be.visible")
      .click();
    return this;
  }

  // correct ans

  getPoints = () => cy.get('[data-cy="points"]');

  addAlternate() {
    cy.get("body")
      .contains("Alternative Answer")
      // .should("be.visible")
      .click({ force: true });
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
    cy.contains("ADVANCED OPTIONS")
      .should("be.visible")
      .click();
    return this;
  }

  getStyleOption = () => cy.get('[data-cy="styleSelect"]');

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
      // .should("be.visible")
      .click({ force: true });

    cy.get(selectOp)
      // .should("be.visible")
      .click({ force: true });

    cy.get('[data-cy="scoringType"]')
      .find(".ant-select-selection-selected-value")
      .should("contain", option);

    return this;
  }

  selectRoundingType(option) {
    const selectOp = `[data-cy="${this.roundingType[option]}"]`;
    cy.get('[data-cy="rounding"]')
      .should("be.visible")
      .click();

    cy.get(selectOp)
      .should("be.visible")
      .click();

    cy.get('[data-cy="rounding"]')
      .find(".ant-select-selection-selected-value")
      .should("contain", option);

    return this;
  }

  getPanalty = () => cy.get('[data-cy="penalty"]').should("be.visible");

  getCheckAnsAttempt = () => cy.get('[data-cy="checkAttempts"]').should("be.visible");

  getEnableAutoScoring = () => {
    return cy.get('[data-cy="autoscoreChk"]');
    // return cy.contains("Enable auto scoring").prev();
  };

  getMinScore = () => cy.get("[data-cy=minscore]").should("be.visible");

  getMaxScore = () => cy.get('[data-cy="maxscore"]').should("be.visible");

  getCheckAnswerCheckbox = () =>
    cy
      .contains("Check answer button")
      .children()
      .eq(0)
      .should("be.visible");

  getUnscore = () => cy.get('[data-cy="unscoredChk"]').parent();

  getNumofCol = () => cy.get('[data-cy="columns"]');

  getSource = () => cy.get('[data-cy="source"]').should("be.visible");

  getCancel = () => cy.contains("Cancel").should("be.visible");

  updatePoints = newPoints =>
    this.getPoints()
      .type("{selectall}")
      .type(newPoints);

  // default question
  createQuestion(queKey = "default", queIndex = 0, onlyItem = true) {
    const item = new EditItemPage();
    item.createNewItem(onlyItem);
    item.chooseQuestion(questionGroup.MCQ, questionType.MCQ_STD);
    cy.fixture("questionAuthoring").then(authoringData => {
      const { quetext, choices, setAns } = authoringData.MCQ_STD[queKey];

      if (quetext) {
        const text = `Q${queIndex + 1} - ${quetext}`;
        this.setQuestionEditorText(text);
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
              .clear({ force: true })
              .type(choice, { force: true });
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

        this.getPoints()
          .clear({ force: true })
          .type(`{selectAll}${points}`);

        // this.header.save();
        // item.updateItemLevelScore(points).then(() => item.header.save(true));
      }
    });
  }
}

export default MCQStandardPage;
