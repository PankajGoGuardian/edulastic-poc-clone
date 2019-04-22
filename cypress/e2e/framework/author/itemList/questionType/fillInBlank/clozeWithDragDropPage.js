import EditToolBar from "../common/editToolBar";
import TemplateMarkupBar from "../common/templateMarkUpBar";
import Header from "../../itemDetail/header";

class ClozeDragDropPage {
  constructor() {
    this.editToolBar = new EditToolBar();
    this.header = new Header();
    this.templateMarkupBar = new TemplateMarkupBar();

    this.scoringTypeOption = { "Exact match": "exactMatch", "Partial match": "partialMatch" };
  }

  // template content
  getTemplateEditor = () => cy.get('[data-placeholder="[This is the template markup]"');

  getGroupResponsesCheckbox = () =>
    cy
      .get("#groupResponseCheckbox")
      .should("be.visible")
      .next();

  clickOnAdvancedOptions = () => {
    cy.contains("span", "Advanced Options")
      .should("be.visible")
      .click();
    return this;
  };

  getMaxScore = () => cy.get('[data-cy="maxscore"]').should("be.visible");

  getAddedGroupTitle = () => cy.contains("legend", "Group");

  getChoiceResponseContainer = () =>
    cy
      .contains("div", "Choices for Responses")
      .should("be.visible")
      .next()
      .children();

  getAddChoiceButton = () => cy.contains("a", "Add New Choice").should("be.visible");

  getChoiceInputByIndex = index => cy.get(`[data-cy="edit_prefix_${index}"`);

  getEnableAutoScoring = () =>
    cy
      .contains("Enable auto scoring")
      .children()
      .eq(0)
      .should("be.visible");

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

  setAnswerToResponseBox = (expectedValue, responseIndex, itemIndex) => {
    this.getResponseItemByIndex(itemIndex)
      .customDragDrop(`#response-container-${responseIndex}`)
      .then(() => {
        this.getResponseContainerByIndex(responseIndex).contains("div", expectedValue);
      });

    return this;
  };

  checkExpectedScore = expectedScore =>
    cy
      .get("body")
      .children()
      .should("contain", `score: ${expectedScore}`);

  getMinScore = () => cy.get("[data-cy=minscore]").should("be.visible");

  getPanalty = () => cy.get('[data-cy="penalty"]').should("be.visible");

  getResponseItemByIndex = index => cy.get(`#response-item-${index}`);

  getResponseContainerByIndex = index => cy.get(`#response-container-${index}`);

  getPontsInput = () => cy.get('[data-cy="points"]');

  getDuplicatedResposneCheck = () => cy.contains("span", "Duplicated responses").parent();

  getDraghandleCheck = () => cy.contains("span", "Show Drag Handle").parent();

  getShuffleOptionCheck = () => cy.contains("span", "Shuffle Options").parent();

  getAddAlternative = () => cy.get('[data-cy="alternative"]');

  getAddedAlternateTab = () => cy.contains("span", "Alternate 1");
}

export default ClozeDragDropPage;
