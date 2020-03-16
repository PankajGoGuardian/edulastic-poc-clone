import CypressHelper from "../../util/cypressHelpers";

export default class DifferentiationPage {
  // *** ELEMENTS START ***

  getClassSelect = () => cy.get('[data-cy="select-group"]');

  getAssignmentSelect = () => cy.get('data-cy="select-assignment"');

  getReviewSlider = () => cy.get('[data-cy="table-REVIEW"]').find(".ant-slider");

  getPracticeSlider = () => cy.get('[data-cy="table-PRACTICE"]').find(".ant-slider");

  getChallengeSlider = () => cy.get('[data-cy="table-CHALLENGE"]').find(".ant-slider");

  // *** ELEMENTS END ***

  // *** ACTIONS START ***

  clickOnClassSelect = () => this.getClassSelect().click();

  clickOnAssignmentSelect = () => this.getAssignmentSelect().click();

  selectClass = className => {
    CypressHelper.selectDropDownByAttribute("select-group", className);
  };

  selectAssignment = assignmentName => {
    CypressHelper.selectDropDownByAttribute("select-assignment", assignmentName);
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
