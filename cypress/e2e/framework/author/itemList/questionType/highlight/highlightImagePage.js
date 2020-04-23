/* eslint-disable class-methods-use-this */
import EditToolBar from "../common/editToolBar";
import Header from "../../itemDetail/header";
import Helpers from "../../../../util/Helpers";
import { DRAWING_TOOLS } from "../../../../constants/questionAuthoring";

class HighlightImage {
  constructor() {
    this.editToolBar = new EditToolBar();
    this.header = new Header();
  }

  checkFontSize(fontSize) {
    this.header.preview();
    // Helpers.getElement("adaptiveButtonList")
    //   .find('[data-cy="undo"]')
    //   .should("have.css", "font-size")
    //   .and("eq", fontSize);

    // Helpers.getElement("adaptiveButtonList")
    //   .find('[data-cy="redo"]')
    //   .should("have.css", "font-size")
    //   .and("eq", fontSize);

    // Helpers.getElement("adaptiveButtonList")
    //   .find('[data-cy="clear"]')
    //   .should("have.css", "font-size")
    //   .and("eq", fontSize);

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
    cy.get('[placeholder="Width (px)"]')
      .click()
      .clear()
      .type("{selectall}")
      .type(width)
      .should("have.value", width);
    return this;
  };

  changeImageHeight = height => {
    cy.get('[placeholder="Height (px)"]')
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

  getDrawableElementInPreview = () => cy.get('[class^="MathDraw"]').prev();

  getDrawedElements = () => cy.get('[class^="SvgDraw__Path"]');

  getDrawingTools = () => cy.get(".drawing-tool-button");

  selectDrawingToolsByName = name => {
    switch (name) {
      case DRAWING_TOOLS.BREAKING_LINE:
        this.getDrawingTools()
          .eq(3)
          .click();
        break;
      default:
        break;
    }
  };
}

export default HighlightImage;
