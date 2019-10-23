import EditToolBar from "../common/editToolBar";
import TemplateMarkupBar from "../common/templateMarkUpBar";
import Header from "../../itemDetail/header";

class ClozeDropDownPage {
  constructor() {
    this.editToolBar = new EditToolBar();
    this.header = new Header();
    this.templateMarkupBar = new TemplateMarkupBar();
    this.scoringTypeOption = { "Exact match": "exactMatch", "Partial match": "partialMatch" };
  }

  // question content
  getQuestionEditor = () => cy.xpath("//div[@class='fr-wrapper']//div[@class='fr-element fr-view']");

  // template content
  getTemplateEditor = () => cy.get('[data-placeholder="[This is the template markup]"');

  // choices
  getChoiceByIndexAndResponseIndex = (responseIndex, choiceIndex) =>
    cy
      .get(`[data-cy="choice-response-${responseIndex}"]`)
      .find(`[data-cy="edit_prefix_${choiceIndex}"]`)
      .should("be.visible");

  // add choice to reponse index
  addNewChoiceByResponseIndex = responseIndex => {
    cy.get(`[data-cy="choice-response-${responseIndex}"]`)
      .contains("Add New Choice")
      .click();
  };

  getAllAnsChoicesLabel = () =>
    cy
      .get('[data-cy="points"]')
      .parent()
      .parent()
      .next()
      .find("label");

  getPoints = () =>
    cy
      .get('[data-cy="tabs"]')
      .next()
      .find("input");

  // advance options
  clickOnAdvancedOptions() {
    cy.contains("ADVANCED OPTIONS")
      .should("be.visible")
      .click();
    return this;
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

  getPanalty = () => cy.get('[data-cy="penalty"]');

  getEnableAutoScoring = () => cy.contains("Enable auto scoring");

  getMinScore = () => cy.get("[data-cy=minscore]").should("be.visible");

  getMaxScore = () => cy.get('[data-cy="maxscore"]').should("be.visible");

  addAlternate() {
    cy.get('[data-cy="tabs"]')
      .find("button")
      .click({ force: true });
    return this;
  }

  getAlternates = () => cy.get('[data-cy="tabs"]').contains("span", "Alternate");

  // correct ans response box
  setChoiceForResponseIndex = (index, choice) => {
    cy.get("[data-cy='drop_down_select']")
      .eq(index)
      .click();

    cy.contains(choice)
      .should("be.visible")
      .click();

    cy.get("[data-cy='drop_down_select']")
      .eq(index)
      .find(".ant-select-selection-selected-value")
      .should("have.text", choice);
  };

  // on preview
  getResponseOnPreview = () => cy.get(".response-btn").should("be.visible");

  getShowAnsBoxOnPreview = () => cy.get(".correctanswer-box").should("be.visible");
}

export default ClozeDropDownPage;
