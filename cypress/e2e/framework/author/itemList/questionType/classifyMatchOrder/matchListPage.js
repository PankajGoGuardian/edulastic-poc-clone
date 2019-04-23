/* eslint-disable class-methods-use-this */
import EditToolBar from "../common/editToolBar";
import Header from "../../itemDetail/header";
import Helpers from "../../../../util/Helpers";

class MatchListPage {
  constructor() {
    this.editToolBar = new EditToolBar();
    this.header = new Header();

    this.scoringTypeOption = { "Exact match": "exactMatch", "Partial match": "partialMatch" };
  }

  // question content
  getListInputs = () =>
    cy
      .get('[data-cy="list-container"]')
      .next()
      .find("div .ql-editor");

  getAddInputButton = () =>
    cy
      .contains("span", "Add new")
      .closest("button")
      .first();

  getListDeleteByIndex = index => cy.get(`[data-cy="deleteprefix${index}"]`);

  getMaxScore = () => cy.get('[data-cy="maxscore"]').should("be.visible");

  getGroupResponsesCheckbox = () =>
    cy
      .contains("span", "Group possible responses")
      .closest("label")
      .should("be.visible");

  getGroupContainerByIndex = index => cy.get(`[data-cy="group-container-${index}"]`);

  getTitleInputByIndex = index => {
    const group = this.getGroupContainerByIndex(index);
    return group
      .contains("div", "Title")
      .next()
      .should("be.visible");
  };

  getAddNewChoiceByIndex = index => {
    const group = this.getGroupContainerByIndex(index);
    return group.contains("span", "Add new choice").closest("button");
  };

  getChoiceListByGroup = index => {
    const group = this.getGroupContainerByIndex(index);
    return group
      .find('[data-cy="group-choices"]')
      .children()
      .first()
      .children();
  };

  deleteChoiceByGroup = (gIndex, index) => {
    cy.get(`[data-cy="deletegroup${gIndex}${index}"]`).click();
    return this;
  };

  getChoiceEditorByGroup = (gIndex, index) => cy.get(`#idgroup${gIndex}${index}`);

  getDragDropBox = () => cy.contains("h3", "Drag & Drop the answer").next();

  getAddNewGroupButton = () =>
    cy
      .contains("span", "ADD NEW GROUP")
      .closest("button")
      .should("be.visible");

  getPontsInput = () => cy.get('[data-cy="points"]');

  getItemByIndex = index => cy.get('[data-cy="drag-drop-board-undefined"]').find(`[data-cy="drag-drop-item-${index}"]`);

  getDragDropItemByIndex = index => cy.get(`[data-cy="drag-drop-item-${index}"]`);

  getDragDropBoardByIndex = index => cy.get(`[data-cy="drag-drop-board-${index}"]`).find(">div");

  addAlternate = () => {
    cy.get('[data-cy="alternate"]')
      .should("be.visible")
      .click();
    return this;
  };

  getAddedAlternate = () => cy.get('[data-cy="del-alter"]');

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

  getPreview() {
    return Helpers.getElement("matchListPreview");
  }

  getPreviewWrapper() {
    return this.getPreview().find('[data-cy="previewWrapper"]');
  }

  getResponseContainerPositionSelect() {
    return Helpers.getElement("responseContainerPositionSelect");
  }

  getTopResContainerOption() {
    return Helpers.getElement("top");
  }

  getBottomResContainerOption() {
    return Helpers.getElement("bottom");
  }

  getLeftResContainerOption() {
    return Helpers.getElement("left");
  }

  getRightResContainerOption() {
    return Helpers.getElement("right");
  }

  getStemNumerationSelect() {
    return Helpers.getElement("stemNumerationSelect");
  }

  getNumericalOption() {
    return Helpers.getElement("numerical");
  }

  getUppercaseAlphabetOption() {
    return Helpers.getElement("upper-alpha");
  }

  getLowercaseAlphabetOption() {
    return Helpers.getElement("lower-alpha");
  }

  checkFontSize(fontSize) {
    this.header.preview();

    this.getPreview()
      .should("have.css", "font-size")
      .and("eq", fontSize);

    this.header.edit();
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

  getEnableAutoScoring = () =>
    cy
      .contains("Enable auto scoring")
      .children()
      .eq(0)
      .should("be.visible");

  getMinScore = () => cy.get("[data-cy=minscore]").should("be.visible");

  checkResponseContainerPosition(position) {
    this.header.preview();

    switch (position) {
      case "top":
        this.getPreviewWrapper()
          .should("have.css", "flex-direction")
          .and("eq", "column-reverse");
        break;
      case "bottom":
        this.getPreviewWrapper()
          .should("have.css", "flex-direction")
          .and("eq", "column");
        break;
      case "left":
        this.getPreviewWrapper()
          .should("have.css", "flex-direction")
          .and("eq", "row-reverse");
        break;
      case "right":
        this.getPreviewWrapper()
          .should("have.css", "flex-direction")
          .and("eq", "row");
        break;
      default:
        break;
    }

    this.header.edit();
  }
}

export default MatchListPage;
