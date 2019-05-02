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
  getQuestionEditor = () => cy.get('[data-placeholder="[This is the stem.]"');

  // template content
  getTemplateEditor = () => cy.get('[data-placeholder="[This is the template markup]"');

  // choices
  getChoiceByIndexAndResponseIndex = (responseIndex, choiceIndex) =>
    cy
      .get(`[data-cy=choice-response-${responseIndex}]`)
      .find("input")
      .eq(choiceIndex)
      .should("be.visible");

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
      .find("input")
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

  getPanalty = () => cy.get('[data-cy="penalty"]').should("be.visible");

  getEnableAutoScoring = () => cy.contains("Enable auto scoring").should("be.visible");

  getMinScore = () => cy.get("[data-cy=minscore]").should("be.visible");

  getMaxScore = () => cy.get('[data-cy="maxscore"]').should("be.visible");

  addAlternate() {
    cy.get('[data-cy="tabs"]')
      .find("button")
      .should("be.visible")
      .click();
    return this;
  }

  getAlternates = () =>
    cy
      .contains("div", "Set Correct Answer(s)")
      .next()
      .contains("span", "Alternate");

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
