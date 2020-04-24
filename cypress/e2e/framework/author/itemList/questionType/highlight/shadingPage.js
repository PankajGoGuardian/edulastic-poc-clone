/* eslint-disable class-methods-use-this */
import EditToolBar from "../common/editToolBar";
import Header from "../../itemDetail/header";
import Helpers from "../../../../util/Helpers";

class ShadingPage {
  constructor() {
    this.editToolBar = new EditToolBar();
    this.header = new Header();

    this.scoringTypeOption = { "Exact match": "exactMatch", "Partial match": "partialMatch" };
  }

  getPoints = () => cy.get('[data-cy="points"]');

  getStimulus() {
    return cy.get('[data-cy="styled-wrapped-component"]');
  }

  addAlternate = () => {
    cy.get("body")
      .contains("+ Alternative Answer")
      .click();
    return this;
  };

  switchOnAlternateAnswer = () => {
    cy.get('[data-cy="tabs"')
      .find("span")
      .contains("Alternate")
      .click();
    return this;
  };

  switchOnCorrectAnswer = () => {
    cy.get('[data-cy="correct"]').click();
    return this;
  };

  checkFontSize(fontSize) {
    this.header.preview();
    this.getStimulus()
      .should("have.css", "font-size")
      .and("eq", fontSize);
    this.header.edit();
  }

  // question content
  getQuestionEditor() {
    return cy.get("[contenteditable=true]").eq(0);
  }

  // shading
  getShadingRowByIndex(index) {
    return cy
      .get("body")
      .contains("Shade cells")
      .siblings()
      .find("ul")
      .eq(index);
  }

  // correct ans
  getCorrectAnsCellCOntainer = () => cy.get('[data-cy="shadesView"]').eq(1);

  getCorrectAnsRowByIndex = index =>
    this.getCorrectAnsCellCOntainer()
      .find("ul")
      .eq(index);

  selectScoringType(option) {
    const selectOp = `[data-cy="${this.scoringTypeOption[option]}"]`;
    cy.get("body")
      .contains(" ADVANCED OPTIONS")
      .then(ele => {
        //const a=cy.wrap(ele);
        if (ele.parent().siblings().length === 3) {
          cy.wrap(ele).click({ force: true });
        }
      });

    //.click({ force: true });

    cy.wait(500);

    cy.get("body")
      .contains("Scoring type")
      .parent()
      .find("i")
      .children()
      .click();

    cy.get(selectOp)
      .should("be.visible")
      .click();

    // cy.get('[data-cy="scoringType"]')
    //   .find(".ant-select-selection-selected-value")
    //   .should("contain", option);

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

  getMaxScore = () => cy.get('[data-cy="maxscore"]').should("be.visible");

  // preview page

  getCellContainerInPreview = () => cy.get('[data-cy="shadesView"]').first();

  getCorrectAnsRowByIndexOnPreview(index) {
    return this.getCellContainerInPreview()
      .find("ul")
      .eq(index);
  }

  getLayout() {
    return Helpers.getElement("layout");
  }

  getMaxSelection() {
    return cy
      .get("body")
      .contains("Max selection")
      .parent()
      .find("input");
  }

  getBorderTypeSelect() {
    return Helpers.getElement("borderTypeSelect");
  }

  getOuterOption() {
    return Helpers.getElement("outer");
  }

  getFullOption() {
    return Helpers.getElement("full");
  }

  getNoneOption() {
    return Helpers.getElement("none");
  }

  getHoverStateOption() {
    return Helpers.getElement("hoverStateOption");
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

  getShadesView() {
    return this.getLayout().find('[data-cy="shadesView"]');
  }

  getShadesViewItems() {
    return this.getShadesView().find('[data-cy="shadesViewItem"]');
  }

  getCellsRowByIndexInLayout = index =>
    cy
      .get('[data-cy="shadesView"]')
      .eq(2)
      .find("ul")
      .eq(index);
}

export default ShadingPage;
