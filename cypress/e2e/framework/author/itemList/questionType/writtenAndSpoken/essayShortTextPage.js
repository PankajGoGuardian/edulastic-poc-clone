/// <reference types="Cypress"/>
import EditToolBar from "../common/editToolBar";
import Header from "../../itemDetail/header";

class EssayShortTextPage {
  constructor() {
    this.editToolBar = new EditToolBar();

    this.header = new Header();
  }

  // question page
  getQuestionEditor() {
    return cy.get(".fr-element").eq(0);
  }

  getPoints() {
    return cy.get('[data-cy="points"]').should("exist");
  }

  selectAllowType(option) {
    //cy.get('.ant-select-selection')
    cy.get(".ant-select-selection-selected-value");
    cy.contains("Exact Match").click();

    cy.contains(option).click();

    cy.get(".ant-select-selection-selected-value");
    cy.contains("Any text containing").should("have.text", option);
  }

  getCorrectValue() {
    return cy
      .get(".ant-input")
      .eq(1)
      .should("exist");
  }

  // on preview
  getTextEditor() {
    //  return cy.get('.ant-input')
    return cy.get(".ant-input-lg").should("be.visible");
  }

  ansHighLightAsRight = rgb => {
    this.getTextEditor().should("have.css", "background-color", rgb);
  };

  ansHighLightAsWrong = rgb => {
    this.getTextEditor().should("have.css", "background-color", rgb);
  };
}

export default EssayShortTextPage;
