/* eslint-disable class-methods-use-this */
import EditToolBar from "../common/editToolBar";
import Header from "../../itemDetail/header";
import Helpers from "../../../../util/Helpers";
import PreviewItemPage from "../../itemDetail/previewPage";
import { queColor } from "../../../../constants/questionTypes";
import EditItemPage from "../../itemDetail/editPage";

class ShadingPage {
  constructor() {
    this.editToolBar = new EditToolBar();
    this.header = new Header();
    this.preview = new PreviewItemPage()
    this.editItem = new EditItemPage();

    this.scoringTypeOption = { "Exact match": "exactMatch", "Partial match": "partialMatch" };
    this.roundingOption = { "None": "none", "Round down": "roundDown" };
  }

  getPoints = () => cy.get('[data-cy="points"]');

  getShades = () => cy.get('[data-cy="shadesView"]')

  getRowCount = () => cy.get(`[data-cy="rowCount"]`)

  getColCount = () => cy.get(`[data-cy="colCount"]`)

  getCellHeight = () => cy.get(`[data-cy="cellHeight"]`)

  getCellWidth = () => cy.get(`[data-cy="cellWidth"]`)

  getLockShadedCells = () => cy.contains(`span`,`Lock shaded cells`)

  getStimulus() {
    return cy.get('[data-cy="styled-wrapped-component"]');
  }

  addAlternate = () => {
    cy.get("body")
      .contains("+ Alternative answer and score")
      .click();
    return this;
  };

  enterPoints = (points)=>{
    this.getPoints()
    .clear()
    .type(points);
  }

  enterRowCount = (count) =>{
    this.getRowCount().clear().type(`{selectall}${count}`)
  }

  enterPenalty = (penalty) =>{
    this.getPanalty().clear().type(`{selectall}${penalty}`)
  }

  verifyRowCount = (count) => {
    this.getShadesView().each(($shades) => {
      cy.wrap($shades).find(`ul`).should(`have.length`, count)
    })
  }

  enterColCount = (count) =>{
    this.getColCount().clear().type(`{selectall}${count}`)
  }

  verifyColCount = (count) => {
    this.getShadesView().each(($shades) => {
      cy.wrap($shades).find(`ul > li`).should(`have.length`, count)
    })
  }

  enterCellHeight = (count) =>{
    this.getCellHeight().clear().type(`{selectall}${count}`)
  }

  verifyCellHeight = (height) => {

    this.getShadesView().find(`ul`).first().find(`li`).then($cells => {
      cy.wrap($cells).each(ele => {
        expect(ele).to.have.css("height", height);
      });
    });
    this.getShadesView().find(`ul`).last().find(`li`).then($cells => {
      cy.wrap($cells).each(ele => {
        expect(ele).to.have.css("height", height);
      });
    });
  }

  enterCellWidth = (count) =>{
    this.getCellWidth().clear().type(`{selectall}${count}`)
  }

  verifyCellWidth = (width) => {

    this.getShadesView().find(`ul`).first().find(`li`).then($cells => {
      cy.wrap($cells).each(ele => {
        expect(ele).to.have.css("width", width);
      });
    });
    this.getShadesView().find(`ul`).last().find(`li`).then($cells => {
      cy.wrap($cells).each(ele => {
        expect(ele).to.have.css("width", width);
      });
    });
  }

  clickQuestionShadeCell = (index) => {
    this.getShades().eq(0).find(`ul > li`).eq(index).click()
  }

  clickLockCellCheckbox = () => {
    this.getLockShadedCells().click({ force: true })
  }

  verifyCellLockedInAnswer = (index, lock) => {
    if (lock) {
      this.getShades().eq(1).find(`ul > li`).eq(index)
        .should('have.css', 'cursor').and("eq", "not-allowed");
      this.getShades().eq(1).find(`ul > li`).eq(index).should("have.css", "background-color")
        .and("eq", queColor.SHADING_SELECT);
    } else {
      this.getShades().eq(1).find(`ul > li`).eq(index)
      .should('have.css', 'cursor').and("eq", "pointer");
    this.getShades().eq(1).find(`ul > li`).eq(index).should("have.css", "background-color")
      .and("eq", queColor.SHADING_CLEAR);
    }
  }

  verifyCellLockedInPreview = (index, lock) => {
    this.header.preview();
    if (lock) {
      this.getShades().eq(0).find(`ul > li`).eq(index)
        .should('have.css', 'cursor').and("eq", "not-allowed");
      this.getShades().eq(0).find(`ul > li`).eq(index).should("have.css", "background-color")
        .and("eq", queColor.SHADING_SELECT);
    } else {
      this.getShades().eq(0).find(`ul > li`).eq(index)
      .should('have.css', 'cursor').and("eq", "pointer");
      this.getShades().eq(0).find(`ul > li`).eq(index).should("have.css", "background-color")
      .and("eq", queColor.SHADING_SELECT);
    }
  }

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

  enterQuestionText = (text) =>{
    this.getQuestionEditor()
          .clear()
          .type(text)
          .should("have.text", text);
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

    
  setCorrectAnswerByIndex = (index) => {

    this.getCorrectAnsRowByIndex(0)
          .find("li").eq(index).click({ force: true })
  }

  clickCellInPreview = (index)=>{
    this.getCorrectAnsRowByIndexOnPreview(0)
          .find("li").eq(index).click({ force: true });
  }

  verifyCellColorInPreview = (index,color) =>{
    this.getCorrectAnsRowByIndexOnPreview(0)
    .find("li").eq(index).should("have.css", "background-color", color);
  }

  clickClearInPreview = () => {
    this.preview.getClear()
      .click()
    this.getCorrectAnsRowByIndexOnPreview(0)
      .find("li").each(ele => {
        expect(ele).to.have.css("background-color", queColor.SHADING_CLEAR);
      });
  }

  checkShowAnswers = (ansArray) => {
    this.preview.getShowAnswer().click().then(() => {
      ansArray.forEach((ans) => {
        cy.get("body")
        .contains("Correct Answer")
        .parent()
        .find("li")
        .eq(ans).should("have.css", "background-color", queColor.LIGHT_GREEN);
      })
    });
  }

  selectScoringType(option) {
    const selectOp = `[data-cy="${this.scoringTypeOption[option]}"]`;
    this.editItem.showAdvancedOptions()
    cy.wait(500);

    cy.get(`[data-cy="scoringType"]`)
      .click();

    cy.get(selectOp)
      .should("be.visible")
      .click();

    return this;
  }

  selectRoundingOption(option) {
    const selectOp = `[data-cy="${this.roundingOption[option]}"]`;
    this.editItem.showAdvancedOptions()
    cy.wait(500);
    cy.get(`[data-cy="rounding"]`)
      .click();
    cy.get(selectOp)
      .should("be.visible")
      .click();

    return this;
  }

  selectMethod(option) {
    const selectOp = `[data-cy="${this.scoringTypeOption[option]}"]`;
    cy.get("body")
      .contains("Method")
      .parent()
      .parent()
      .find("i")
      .children()
      .click();

    cy.contains(option)
      .should("be.visible")
      .click();

    return this;
  }

  verifyCellsHiddenInAnswer = (hideArray, hidden) => {
    if (hidden) {
      hideArray.forEach(cell => {
        this.getCorrectAnsRowByIndex(0)
          .find("li").eq(cell)
          .should("have.attr", "visibility")
          .and("eq", "hidden");
      })
    } else {
      hideArray.forEach(cell => {
        this.getCorrectAnsRowByIndex(0)
          .find("li").eq(cell)
          .should("have.attr", "visibility")
          .and("eq", "visible");
      })
    }
  }
  
  verifyCellsHiddenInPreview = (hideArray, hidden) => {
    if (hidden) {
      hideArray.forEach(cell => {
        this.getCorrectAnsRowByIndexOnPreview(0)
          .find("li").eq(cell)
          .should("have.attr", "visibility")
          .and("eq", "hidden");
      })
    } else {
      hideArray.forEach(cell => {
        this.getCorrectAnsRowByIndexOnPreview(0)
          .find("li").eq(cell)
          .should("have.attr", "visibility")
          .and("eq", "visible");
      })
    }
  }

  getCellsRowByIndexInLayout = index =>
    cy.get('[data-cy="shadesView"]')
      .eq(2)
      .find("ul")
      .eq(index);

  clickCellsToHide = (hideArray, hide) => {
    if (hide) {
      hideArray.forEach(cell => {
        this.getCellsRowByIndexInLayout(0)
          .find("li").eq(cell).click()
          .should("have.css", "background-color")
          .and("eq", queColor.SHADING_SELECT);
      });
    } else {
      hideArray.forEach(cell => {
        this.getCellsRowByIndexInLayout(0)
          .find("li").eq(cell).click()
          .should("have.css", "background-color")
          .and("eq", queColor.SHADING_CLEAR);
      })
    }
  }

  enterCount(count){
    cy.get("body")
      .contains("Method")
      .parent()
      .parent()
      .find("input")
      .type(`{selectall}${count}`)
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

}




export default ShadingPage;
