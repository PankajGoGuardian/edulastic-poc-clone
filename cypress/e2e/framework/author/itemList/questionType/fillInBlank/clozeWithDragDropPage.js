import EditToolBar from "../common/editToolBar";
import TemplateMarkupBar from "../common/templateMarkUpBar";
import Header from "../../itemDetail/header";
import PreviewItemPage from "../../itemDetail/previewPage";
import CypressHelper from "../../../../util/cypressHelpers";
PreviewItemPage;
class ClozeDragDropPage {
  constructor() {
    this.editToolBar = new EditToolBar();
    this.header = new Header();
    this.templateMarkupBar = new TemplateMarkupBar();
    this.previewItemPage = new PreviewItemPage();
    this.scoringTypeOption = { "Exact match": "exactMatch", "Partial match": "partialMatch" };
    this.roundingType = { "Round down": "roundDown", None: "none" };
  }

  // template content
  getTemplateEditor = () => cy.get(".fr-element").eq(0);

  getGroupResponsesCheckbox = () => cy.get('[data-cy="drag-drop-aria-check"]');

  clickOnAdvancedOptions = () => {
    cy.get('[class^="AdvancedOptionsLink"]').then(ele => {
      if (ele.siblings().length === 3) cy.wrap(ele).click();
    });
    return this;
  };

  getMaxScore = () => cy.get('[data-cy="maxscore"]').should("be.visible");

  getAddedGroupTitle = () => cy.contains("legend", "Group");

  getChoiceResponseContainer = () =>
    cy
      .get('[id="cloze-with-drag-&-drop-choices-for-responses"]')
      .parent()
      .next()
      .children()
      .find(".sortable-item-container");

  getAddChoiceButton = () => cy.contains("button", "Add New Choice").should("be.visible");

  getChoiceInputByIndex = index =>
    this.getChoiceResponseContainer()
      .eq(index)
      .find("p")
      .last();

  getEnableAutoScoring = () =>
    cy
      .contains("Enable auto scoring")
      .parent()
      .find("input");

  selectScoringType(option) {
    const selectOp = `[data-cy="${this.scoringTypeOption[option]}"]`;
    cy.get('[data-cy="scoringType"]')
      //.should("be.visible")
      .click({ force: true });

    cy.get(selectOp)
      //.should("be.visible")
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

  setAnswerToResponseBox = (expectedValue, responseIndex, itemIndex) => {
    this.getResponseItemByIndex(itemIndex)
      .customDragDrop(`#drop-container-${responseIndex}`)
      .then(() => {
        this.getResponseContainerByIndex(responseIndex).contains("div", expectedValue);
      });

    return this;
  };

  checkExpectedScore = expectedScore =>
    cy
      .get("body")
      .children()
      .should("contain", `Score ${expectedScore}`);

  getMinScore = () => cy.get("[data-cy=minscore]").should("be.visible");

  getPanalty = () => cy.get('[data-cy="penalty"]'); //.should("be.visible");

  getResponseItemByIndex = index => cy.get(`#response-item-${index}`);

  verifyShuffledChoices = (choices, shuffled = true) => {
    const arrayOfchoices = [];
    for (let i = 0; i < choices.length; i++) {
      this.getResponseItemByIndex(i)
        .invoke("text")
        .then(txt => {
          arrayOfchoices.push(txt);
        });
    }
    cy.wait(1).then(() => {
      console.log(arrayOfchoices, choices);
      if (shuffled) CypressHelper.checkObjectInEquality(choices, arrayOfchoices, "choices are shuffled");
      else CypressHelper.checkObjectEquality(choices, arrayOfchoices, "choices are not shuffled");
    });
  };

  getResponseContainerByIndex = itemIndex => cy.get(`#drop-container-${itemIndex}`);

  getPontsInput = () => cy.get('[data-cy="points"]');

  getDuplicatedResposneCheck = () => cy.contains("span", "Duplicated responses").parent();

  getDraghandleCheck = () => cy.contains("span", "Show Drag Handle").parent();

  getShuffleOptionCheck = () => cy.contains("span", "Shuffle Options").parent();

  getAddAlternative = () => cy.get('[data-cy="alternative"]');

  getAddedAlternateTab = () => cy.contains("span", "Alternate 1");

  updatePoints = points => this.getPontsInput().type(`{selectall}${points}`);

  addAlternative = () => this.getAddAlternative().click({ force: true });

  typeQuestionText = text =>
    this.getTemplateEditor()
      .clear()
      .type(text);

  updatePenalty = penalty => {
    this.getPanalty().type(`{selectall}${penalty}`);
  };
}

export default ClozeDragDropPage;
