import TestHeader from "./header";
import { CALCULATOR, attemptTypes } from "../../../constants/questionTypes";

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

  clickOnEvalByType = type => {
    cy.get(`[ data-cy=${type}]`).click({ force: true });
  };

  selectDontReleaseScoreResponse = () => cy.get('[value="DONT_RELEASE"]').click();

  setRealeasePolicy = policy => cy.get(`[VALUE=${policy}]`).click();

  setMaxAttempt = attempts =>
    cy
      .get('[id="maximum-attempts-allowed"]')
      .find("input")
      .type(attempts);

  getCheckAnswer = () => cy.get("#check-answer-tries-per-question").find("input");

  setCheckAnswer = checkAns => this.getCheckAnswer().type(`{selectall}${checkAns}`);
}
