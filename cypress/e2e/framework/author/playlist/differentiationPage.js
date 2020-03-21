import CypressHelper from "../../util/cypressHelpers";

export default class DifferentiationPage {
  // *** ELEMENTS START ***

  getDifferentiationTab = () => cy.get('[data-cy="differentiation"]');

  getClassSelect = () => cy.get("[data-cy=select-group]");

  getReviewWorkContainer = () => cy.get('[data-cy="table-REVIEW"]');

  getPracticeWorkContainer = () => cy.get('[data-cy="table-PRACTICE"]');

  getChallengeWorkContainer = () => cy.get('[data-cy="table-CHALLENGE"]');

  getReviewTestByIndex = index => this.getReviewWorkContainer().find(`[data-row-key="${index}"]`);

  getChallengeTestByIndex = index => this.getChallengeWorkContainer().find(`[data-row-key="${index}"]`);

  getAssignmentSelect = () => cy.get("[data-cy=select-assignment]");

  getReviewSlider = () => this.getReviewWorkContainer().find(".ant-slider");

  getPracticeSlider = () => this.getPracticeWorkContainer().find(".ant-slider");

  getChallengeSlider = () => this.getChallengeWorkContainer().find(".ant-slider");

  // standard rows
  getReviewStandardsRows = () => this.getReviewWorkContainer().find(".ant-table-row-level-0");

  getPracticeStandardsRows = () => this.getPracticeWorkContainer().find(".ant-table-row-level-0");

  getChallengeStandardsRows = () => this.getChallengeWorkContainer().find(".ant-table-row-level-0");

  // checkbox

  getCheckBoxForStandard = standard =>
    cy
      .get("@rows")
      .contains(standard)
      .closest("tr")
      .find('input[type="checkbox"]');

  // *** ELEMENTS END ***

  // *** ACTIONS START ***

  clickOnDifferentiationTab = (loadDefault = false) => {
    cy.server();
    cy.route("GET", "**/recommendations**").as("recommendations");
    this.getDifferentiationTab().click();
    cy.wait("@recommendations");
  };

  clickOnClassSelect = () => this.getClassSelect().click();

  clickOnAssignmentSelect = () => this.getAssignmentSelect().click();

  selectClass = (className, isDefault = false) => {
    cy.server();
    cy.route("GET", "**/recommendations**").as("recommendations");
    this.clickOnClassSelect();
    CypressHelper.selectDropDownByAttribute("select-group", className);
    if (!isDefault) cy.wait("@recommendations");
  };

  selectAssignment = assignmentName => {
    this.clickOnAssignmentSelect();
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

  checkStandardForReview = std => {
    this.getReviewStandardsRows().as("rows");
    this.getCheckBoxForStandard(std).check({ force: true });
  };

  checkStandardForPractice = std => {
    this.getPracticeStandardsRows().as("rows");
    this.getCheckBoxForStandard(std).check({ force: true });
  };

  checkStandardForChallenge = std => {
    this.getChallengeStandardsRows().as("rows");
    this.getCheckBoxForStandard(std).check({ force: true });
  };

  clickOnAddByRecommendationType = type => {
    cy.server();
    cy.route("POST", "**/recommendations/**").as("addRecommendation");
    cy.get(`[data-cy="addButton-${type}"]`).click();
    cy.wait("@addRecommendation")
      .its("status")
      .should("be.eq", 200);
  };

  clickOnAddPracticeWork = () => cy.get('[data-cy="addButton-PRACTICE"]').click();

  clickOnAddChallengeork = () => cy.get('[data-cy="addButton-CHALLENGE"]').click();

  // *** ACTIONS END ***

  // *** APPHELPERS START ***

  verifyAssignmentNotPresentInDropDown = value => {
    this.clickOnAssignmentSelect();
    CypressHelper.getDropDownList().should("not.contain", value);
  };

  verifyStandardRowByStandard = ({ type, standardId, avgMastery, notStartedCount, added = false }) => {
    cy.get(`[data-cy="table-${type}"]`)
      .find(".ant-table-row-level-0")
      .contains(standardId)
      .closest("tr")
      .find("td")
      .then($ele => {
        cy.wrap($ele).as("columns");

        if (added)
          cy.get("@columns")
            .find('input[type="checkbox"]')
            .and("be.disabled");
        else
          cy.get("@columns")
            .find('input[type="checkbox"]')
            .should("not.be.checked")
            .and("be.enabled");

        if (avgMastery) {
          cy.get("@columns")
            .find(".ant-progress-text")
            .should("contain.text", `${avgMastery}%`);
        }

        if (notStartedCount) {
          cy.get("@columns")
            .eq(4)
            .should("contain.text", `${notStartedCount} Students`);
        }

        cy.get("@columns")
          .eq(5)
          .should("have.text", added ? "ADDED" : "RECOMMENDED");
      });
  };

  // *** APPHELPERS END ***
}
