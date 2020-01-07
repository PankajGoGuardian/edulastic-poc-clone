import TestHeader from "./header";
import { CALCULATOR } from "../../../constants/questionTypes";

export default class TestSettings {
  constructor() {
    this.header = new TestHeader();
  }

  clickOnCalculatorByType = type => {
    cy.get(`[ data-cy=${type}]`).click();
  };

  clickOnShuffleChoices = () => cy.get('[ data-cy="shuffleChoices"]').click();

  clickOnShuffleQuestions = () => cy.get('[data-cy="shuffleQuestions"]').click();

  clickOnPassword = () =>
    cy
      .contains("Require Password")
      .parentsUntil('[id="test-type"]')
      .find(".ant-select-arrow-icon")
      .click();

  clickOnStaticPassword = () =>
    cy
      .get(".ant-select-dropdown-menu-item")
      .contains("Static Password")
      .click();

  enterStaticPassword = pass => cy.get('[placeholder="Enter Password"]').type(pass);

  clickOnDynamicPassword = () =>
    cy
      .get(".ant-select-dropdown-menu-item")
      .contains("Dynamic Password")
      .click();
}
