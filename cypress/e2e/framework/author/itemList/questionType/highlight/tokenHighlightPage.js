/* eslint-disable class-methods-use-this */
import EditToolBar from "../common/editToolBar";
import Header from "../../itemDetail/header";
import Helpers from "../../../../util/Helpers";

class TokenhighLightPage {
  constructor() {
    this.editToolBar = new EditToolBar();
    this.header = new Header();
  }

  // question content
  getQuestionEditor() {
    return cy.get("[contenteditable=true]").eq(0);
  }

  // template
  editTemplate() {
    return cy.get("body").contains("Edit template");
  }

  getTemplateEditor() {
    return cy
      .get("[data-cy=tabs]")
      .eq(0)
      .parent()
      .next()
      .find('[contenteditable="true"]'); //eq(0).xpath('child::div').eq(1)
  }

  // token
  editToken() {
    return cy.get("body").contains("Edit token");
  }

  paragraph = () =>
    cy
      .get('[data-cy="tabs"]')
      .eq(0)
      .parent()
      .next()
      .contains("Paragraph");

  sentence = () =>
    cy
      .get('[data-cy="tabs"]')
      .eq(0)
      .parent()
      .next()
      .contains("Sentence");

  word = () =>
    cy
      .get('[data-cy="tabs"]')
      .eq(0)
      .parent()
      .next()
      .contains("Word");

  getAllTokens() {
    return this.editToken()
      .parent()
      .parent()
      .parent()
      .siblings()
      .filter(".token");
  }

  // correct
  getPoint() {
    return cy.get('[data-cy="points"]');
  }

  getAllTokenAnswer() {
    return cy
      .get("[data-cy=previewWrapper]")

      .find(".answer");
  }

  goToEditToken() {
    this.editToken().click({ force: true });
  }

  goToEditTemplate() {
    this.editTemplate().click();
  }

  // preview
  getAllTokenOnPreview() {
    return cy.get(".token.answer");
  }

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

  getMaxSelection() {
    return cy.contains("Max selection").next();
  }

  getPreviewWrapper() {
    return Helpers.getElement("previewWrapper").should("be.visible");
  }

  checkFontSize(fontSize) {
    this.header.preview();
    this.getPreviewWrapper()
      .should("have.css", "font-size")
      .and("eq", fontSize);

    this.header.edit();
  }
}

export default TokenhighLightPage;
