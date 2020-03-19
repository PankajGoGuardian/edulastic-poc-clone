import CypressHelper from "../../util/cypressHelpers";

export default class DifferentiationPage {
  // *** ELEMENTS START ***

  getDifferentiationTab = () => cy.get('[data-cy="differentiation"]');

  getClassSelect = () => cy.get("[data-cy=select-group]");

  getReviewWorkContainer = () => cy.get('[data-cy="table-REVIEW"]');

  getChallengeWorkContainer = () => cy.get('[data-cy="table-CHALLENGE"]');

  getReviewTestByIndex = index => this.getReviewWorkContainer().find(`[data-row-key="${index}"]`);

  getChallengeTestByIndex = index => this.getChallengeWorkContainer().find(`[data-row-key="${index}"]`);

  getAssignmentSelect = () => cy.get("[data-cy=select-assignment]");

  getReviewSlider = () => this.getReviewWorkContainer().find(".ant-slider");

  getPracticeSlider = () => cy.get('[data-cy="table-PRACTICE"]').find(".ant-slider");

  getChallengeSlider = () => this.getChallengeWorkContainer().find(".ant-slider");

  getReviewStandardsRows = () => this.getReviewWorkContainer().find(".ant-table-row-level-0");

  getChallengeStandardsRows = () => this.getChallengeWorkContainer().find(".ant-table-row-level-0");

  // *** ELEMENTS END ***

  // *** ACTIONS START ***

  clickOnDifferentiationTab = () => this.getDifferentiationTab().click();

  clickOnClassSelect = () => this.getClassSelect().click();

  clickOnAssignmentSelect = () => this.getAssignmentSelect().click();

  selectClass = className => {
    this.clickOnClassSelect();
    cy.server();
    cy.route("GET", "**/recommendations**").as("recommendations");
    CypressHelper.selectDropDownByAttribute("select-group", className);
    cy.wait("@recommendations");
  };

  selectAssignment = assignmentName => {
    this.clickOnAssignmentSelect();
    CypressHelper.selectDropDownByAttribute("select-assignment", assignmentName);
  };

  verifyAssignmentNotPresentInDropDown = value => {
    this.clickOnAssignmentSelect();
    CypressHelper.getDropDownList().should("not.contain", value);
  };

  setMasteryRangeSlider = (min, max) => {
    cy.get("@slider")
      .find(".ant-slider-rail")
      .then($ele => {
        const { width } = $ele.get(0).getBoundingClientRect();
        const xMin = (width * min) / 100;
        const xMax = (width * max) / 100;
        cy.wrap($ele)
          .click(xMin, 5, { force: true })
          .click(xMax, 5, { force: true });
      });
  };

  setReviewMasteryRange = (min, max) => {
    this.getReviewSlider().as("slider");
    this.setMasteryRangeSlider(min, max);
  };

  setPracticeMasteryRange = (min, max) => {
    this.getPracticeSlider().as("slider");
    this.setMasteryRangeSlider(min, max);
  };

  setChallengeMasteryRange = (min, max) => {
    this.getChallengeSlider().as("slider");
    this.setMasteryRangeSlider(min, max);
  };

  // *** ACTIONS END ***

  // *** APPHELPERS START ***
  // *** APPHELPERS END ***
}
