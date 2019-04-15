import EditToolBar from "../common/editToolBar";
import TemplateMarkupBar from "../common/templateMarkUpBar";
import Header from "../../itemDetail/header";

class ClozeWithTextPage {
  constructor() {
    this.editToolBar = new EditToolBar();
    this.header = new Header();
    this.TemplateMarkupBar = new TemplateMarkupBar();
  }

  // question content
  getQuestionEditor = () => cy.get('[data-placeholder="[This is the stem.]"');

  // template content
  getTemplateEditor = () => cy.get('[data-placeholder="[This is the template markup]"');

  addAlternate() {
    cy.get('[data-cy="tabs"]')
      .find("button")
      .should("be.visible")
      .click();
    return this;
  }

  getPoints = () =>
    cy
      .get('[data-cy="tabs"]')
      .next()
      .find("input")
      .eq(0)
      .should("be.visible");

  getAlternates = () =>
    cy
      .contains("div", "Set Correct Answer(s)")
      .next()
      .contains("span", "Alternate");

  // correct ans response box
  getResponseBoxByIndex = index =>
    cy
      .get(".template_box")
      .find("input")
      .eq(index);

  clickOnAdvancedOptions = () => {
    cy.contains("span", "Advanced Options")
      .should("be.visible")
      .click();
    return this;
  };

  // on preview
  getResponseOnPreview = () => cy.get(".response-btn").should("be.visible");

  getShowAnsBoxOnPreview = () => cy.get(".correctanswer-box").should("be.visible");
}

export default ClozeWithTextPage;
