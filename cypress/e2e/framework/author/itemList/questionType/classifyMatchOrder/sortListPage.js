/* eslint-disable class-methods-use-this */
import Header from "../../itemDetail/header";
import Helpers from "../../../../util/Helpers";

class SortListPage {
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
  }

  // advance options
  clickOnAdvancedOptions() {
    cy.get("body")
      .contains("span", "Advanced Options")
      .should("be.visible")
      .click();
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

  getSortListPreview() {
    return Helpers.getElement("sortListPreview");
  }

  getSortListComponent() {
    return Helpers.getElement("sortListComponent");
  }

  getOrientationSelect() {
    return Helpers.getElement("orientationSelect");
  }

  getHorizontalOption() {
    return Helpers.getElement("horizontal");
  }

  getVerticalOption() {
    return Helpers.getElement("vertical");
  }

  checkFontSize(fontSize) {
    this.header.preview();

    this.getSortListPreview()
      .should("have.css", "font-size")
      .and("eq", fontSize);

    this.header.edit();
  }

  checkOrientation(orientation) {
    this.header.preview();

    if (orientation === "horizontal") {
      this.getSortListComponent()
        .should("have.css", "flex-direction")
        .and("eq", "row");
    }

    if (orientation === "vertical") {
      this.getSortListComponent()
        .should("have.css", "flex-direction")
        .and("eq", "column");
    }

    this.header.edit();
  }

  getListInputs = () =>
    cy
      .get('[data-cy="sortable-list-container"]')
      .first()
      .find("div .ql-editor");

  getAddInputButton = () =>
    cy
      .contains("span", "Add new choice")
      .closest("button")
      .first();

  getListInputByIndex = index =>
    cy
      .get(`#drag-handler-prefix${index}`)
      .next()
      .find("div .ql-editor");

  getDeleteChoiceButtons = () =>
    cy
      .get('[data-cy="sortable-list-container"]')
      .first()
      .find('[data-cypress="deleteButton"]');

  getListDeleteByIndex = index => cy.get(`[data-cy="deleteprefix${index}"]`);

  getPonitsInput = () => cy.get('[data-cy="points"]');

  getAnswerLists = () =>
    cy
      .get(`[data-cy="sortable-list-container"]`)
      .last()
      .find("div .ql-editor");

  addAlternate = () => {
    cy.get('[data-cy="alternate"]')
      .should("be.visible")
      .click();
    return this;
  };

  getAddedAlternate = () => cy.get('[data-cy="del-alter"]');

  getPreviewList = () => cy.get('[data-cy="sortListComponent"]');

  getSourceBoard = () => cy.get("#drag-drop-board-0").parent();

  getTargetBoard = () => cy.get("#drag-drop-board-0-target").parent();

  dragAndDropFromAnswerToBoard = (sLabel, sIndex, tIndex) => {
    cy.get(`#drag-drop-board-${sIndex}`)
      .customDragDrop(`#drag-drop-board-${tIndex}-target`)
      .then(() => {
        this.getSourceBoard()
          .contains("p", sLabel)
          .should("not.exist");
        this.getTargetBoard()
          .contains("p", sLabel)
          .should("be.visible");
      });
    return this;
  };

  dragAndDropInsideTarget = (sLabel, sIndex, tIndex) => {
    cy.get(`#drag-drop-board-${tIndex}-target`)
      .customDragDrop(`#drag-drop-board-${sIndex}-target`)
      .then(() => {
        cy.get(`#drag-drop-board-${tIndex}-target`)
          .contains("p", sLabel)
          .should("be.visible");
      });
    return this;
  };

  getCorrectAnswerList = () =>
    cy
      .get("body")
      .find("h3", "Correct Answers")
      .next()
      .children();
}

export default SortListPage;
