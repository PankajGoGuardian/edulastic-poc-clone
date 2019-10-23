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
  getQuestionEditor = () => cy.get(".fr-element").eq(0);

  addAlternate() {
    cy.get('[data-cy="tabs"]')
      .find("button")
      .click();

    return this;
  }

  getPoints = () =>
    cy
      .get('[data-cy="tabs"]')
      .next()
      .find("input")
      .eq(0);

  getAlternates = () => cy.get('[data-cy="tabs"]').contains("span", "Alternate");

  // correct ans response box
  getResponseBoxByIndex = index =>
    cy
      .get('[data-cy="styled-wrapped-component"]')
      .next()
      .find("input")
      .eq(index);

  // advance options
  clickOnAdvancedOptions() {
    cy.contains("ADVANCED OPTIONS")
      .should("be.visible")
      .click();
    return this;
  }

  // on preview
  getResponseOnPreview = () => cy.get(".response-btn").should("be.visible");

  getShowAnsBoxOnPreview = () => cy.get(".correctanswer-box").should("be.visible");
}

export default ClozeWithTextPage;
