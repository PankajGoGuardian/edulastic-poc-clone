/* eslint-disable class-methods-use-this */
import EditToolBar from "../common/editToolBar";
import Header from "../../itemDetail/header";
import Helpers from "../../../../util/Helpers";

class HighlightImage {
  constructor() {
    this.editToolBar = new EditToolBar();
    this.header = new Header();
  }

  checkFontSize(fontSize) {
    this.header.preview();
    cy.get('[data-cy="styled-wrapped-component"]')
      .first()
      .should("have.css", "font-size")
      .and("eq", fontSize);

    this.header.edit();
  }

  // get current question from Store

  getCurrentStoreQuestion = () => {
    const storeValue = JSON.parse(window.localStorage.getItem("persist:root")).question;
    return JSON.parse(storeValue).entity.data;
  };

  getDropZoneImageContainer = () => cy.get('[data-cy="dropzone-image-container"]');

  getQuestionText = () => cy.get('[contenteditable="true"]').first();

  changeImageWidth = width => {
    cy.get('[data-cy="image-width-input"]')
      .click()
      .clear()
      .type("{selectall}")
      .type(width)
      .should("have.value", width);
    return this;
  };

  changeImageHeight = height => {
    cy.get('[data-cy="image-height-input"]')
      .click()
      .clear()
      .type("{selectall}")
      .type(height)
      .should("have.value", height);
    return this;
  };

  addImageAlternative = altText => {
    cy.get('[data-cy="image-alternative-input"]')
      .click()
      .clear()
      .type(altText)
      .should("have.value", altText);
    return this;
  };

  getMathInputBox = () => cy.get('[data-cy="answer-math-input-field"]');

  verifyAlternativeTextInImage = value => {
    cy.get(`[alt="${value}"]`).should("exist");
  };

  clickAddColor = () => {
    cy.contains("span", "Add new color")
      .closest("button")
      .should("be.visible")
      .click();
    return this;
  };

  getLayout() {
    return Helpers.getElement("layout");
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

  getLineWidth() {
    return this.getLayout()
      .find("input")
      .first();
  }

  getImagePreview = () => cy.get('[data-cy="previewImage"]');

  getDrawableElementInPreview = () => cy.get('[id="zwibbler-main"]');

  getDrawedElements = () => cy.get('[class^="SvgDraw__Path"]');

  getDrawingTools = name => cy.get(`[id=${name}]`);

  selectDrawingToolsByName = name => {
    this.getDrawingTools(name).click();
  };
}

export default HighlightImage;
