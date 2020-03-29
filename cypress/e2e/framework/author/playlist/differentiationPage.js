import CypressHelper from "../../util/cypressHelpers";
import PlayListSearchContainer from "./searchConatinerPage";

const searchContainer = new PlayListSearchContainer();
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

  getReviewSliderHandle = () => this.getReviewWorkContainer().find(".ant-slider-handle");

  getPracticeSliderHandle = () => this.getPracticeWorkContainer().find(".ant-slider-handle");

  getChallengeSliderHandle = () => this.getChallengeWorkContainer().find(".ant-slider-handle");

  getAddButton = type => cy.get(`[data-cy="addButton-${type}"]`);

  getManageContentButton = () => cy.get("[data-cy=manage-content]");

  // standard rows
  getReviewStandardsRows = () => this.getReviewWorkContainer().find(".ant-table-row-level-0");

  getPracticeStandardsRows = () => this.getPracticeWorkContainer().find(".ant-table-row-level-0");

  getChallengeStandardsRows = () => this.getChallengeWorkContainer().find(".ant-table-row-level-0");

  getAllTableRows = () => cy.get(".ant-table-row-level-0");

  // checkbox

  getCheckBoxForStandard = standard =>
    cy
      .get("@rows")
      .contains(standard)
      .closest("tr")
      .find('input[type="checkbox"]');

  getCheckBoxByTestName = testName =>
    this.getAllTableRows()
      .contains(testName)
      .closest("tr")
      .find('input[type="checkbox"]');

  // *** ELEMENTS END ***

  // *** ACTIONS START ***

  clickOnManageContent = () => {
    searchContainer.routeTestSearch();
    this.getManageContentButton().click();
    searchContainer.waitForTestSearch();
  };

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

  setMasteryRangeSlider = (minvalue, maxvalue) => {
    let sliderhandle1 = 0;
    let sliderhandle2 = 1;
    if (!minvalue || !maxvalue) {
      sliderhandle2 = 0;
    }
    if (minvalue) {
      cy.get("@slider-handlers")
        .eq(sliderhandle1)
        .as("min-handler")
        .invoke("attr", "aria-valuenow")
        .then(val => {
          let currentvalue;
          if (sliderhandle2 === 0) {
            currentvalue = 100 - parseInt(val);
          } else {
            currentvalue = parseInt(val);
          }
          if (minvalue < currentvalue) {
            cy.get("@min-handler").type("{leftarrow}".repeat(currentvalue - minvalue));
          } else if (minvalue > currentvalue) {
            cy.get("@min-handler").type("{rightarrow}".repeat(minvalue - currentvalue));
          }
        });
    }
    if (maxvalue) {
      cy.get("@slider-handlers")
        .eq(sliderhandle2)
        .as("max-handler")
        .invoke("attr", "aria-valuenow")
        .then(val => {
          let currentvalue = parseInt(val);
          if (maxvalue < currentvalue) {
            cy.get("@max-handler").type("{leftarrow}".repeat(currentvalue - maxvalue));
          } else if (maxvalue > currentvalue) {
            cy.get("@max-handler").type("{rightarrow}".repeat(maxvalue - currentvalue));
          }
        });
    }
  };

  setAndVerifyReviewMasteryRange = max => {
    this.getReviewSliderHandle().as("slider-handlers");
    this.setMasteryRangeSlider(undefined, max);
    this.verifyReviewMasteryRange(`Below ${max}%`);
  };

  setAndVerifyPracticeMasteryRange = (min, max) => {
    this.getPracticeSliderHandle().as("slider-handlers");
    this.setMasteryRangeSlider(min, max);
    this.verifyPracticeMasteryRange(`Between ${min}% and ${max}%`);
  };

  setAndVerifyChallengeMasteryRange = min => {
    this.getChallengeSliderHandle().as("slider-handlers");
    this.setMasteryRangeSlider(min, undefined);
    this.verifyChallengeMasteryRange(`Above ${min}%`);
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
    this.getAddButton(type).click();
    cy.wait("@addRecommendation")
      .its("status")
      .should("be.eq", 200);
  };

  clickOnAddPracticeWork = () => cy.get('[data-cy="addButton-PRACTICE"]').click();

  clickOnAddChallengeork = () => cy.get('[data-cy="addButton-CHALLENGE"]').click();

  checkCheckBoxByTestName = testName => this.getCheckBoxByTestName(testName).check({ force: true });

  // *** ACTIONS END ***

  // *** APPHELPERS START ***

  verifyAssignmentNotPresentInDropDown = value => {
    this.clickOnAssignmentSelect();
    CypressHelper.getDropDownList().should("not.contain", value);
  };

  verifyCheckBox = (type, status) => {
    cy.get(`[data-cy="table-${type}"]`)
      .find(".ant-table-row-level-0")
      .closest("tr")
      .find("td")
      .then($ele => {
        cy.wrap($ele).as("columns");
        if (status == "checked") {
          cy.get("@columns")
            .find('input[type="checkbox"]')
            .should("be.checked")
            .and("be.enabled");
        }
        if (status == "unchecked") {
          cy.get("@columns")
            .find('input[type="checkbox"]')
            .should("not.be.checked")
            .and("be.enabled");
        }
      });
  };

  verifySelectAllReviewWork = () => {
    cy.get('[data-cy="select-all"]')
      .eq(0)
      .click();
    this.verifyCheckBox("REVIEW", "checked");
  };

  verifyUnselectAllReviewWork = () => {
    cy.get('[data-cy="deselect-all"]')
      .eq(0)
      .click();
    this.verifyCheckBox("REVIEW", "unchecked");
  };

  verifySelectAllPracticeWork = () => {
    cy.get('[data-cy="select-all"]')
      .eq(1)
      .click();
    this.verifyCheckBox("PRACTICE", "checked");
  };

  verifyUnselectAllPracticeWork = () => {
    cy.get('[data-cy="deselect-all"]')
      .eq(1)
      .click();
    this.verifyCheckBox("PRACTICE", "unchecked");
  };

  verifySelectAllChallengeWork = () => {
    cy.get('[data-cy="select-all"]')
      .eq(2)
      .click();
    this.verifyCheckBox("CHALLENGE", "checked");
  };

  verifyUnselectAllChallengeWork = () => {
    cy.get('[data-cy="deselect-all"]')
      .eq(2)
      .click();
    this.verifyCheckBox("CHALLENGE", "unchecked");
  };

  verifyAddButtonVisibility = type => {
    this.getAddButton(type).should("be.visible");
  };

  verifyReviewMasteryRange = value => {
    this.getReviewSlider()
      .next()
      .should("contain", value);
  };

  verifyPracticeMasteryRange = value => {
    this.getPracticeSlider()
      .next()
      .should("contain", value);
  };

  verifyChallengeMasteryRange = value => {
    this.getChallengeSlider()
      .next()
      .should("contain", value);
  };

  verifyReviewStudentCount = count => {
    this.getReviewWorkContainer()
      .find('[data-cy="student"]')
      .parent()
      .should("contain.text", count);
  };

  verifyPracticeStudentCount = count => {
    this.getPracticeWorkContainer()
      .find('[data-cy="student"]')
      .parent()
      .should("contain.text", count);
  };

  verifyChallengeStudentCount = count => {
    this.getChallengeWorkContainer()
      .find('[data-cy="student"]')
      .parent()
      .should("contain.text", count);
  };

  verifyStandardRow = ({ type, standardId, testName, avgMastery, notStartedCount, added = false }) => {
    cy.get(`[data-cy="table-${type}"]`)
      .find(".ant-table-row-level-0")
      .contains(standardId || testName)
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

  dragTestFromSearchToSectionAndVerify = (targetmode, testId, testName) => {
    searchContainer.typeInSearchBar(testName);
    cy.get(`[data-cy="table-${targetmode}"]`).as("target-container"); // get review container
    searchContainer
      .getTestInSearchResultsById(testId)
      .first()
      .as("source-container");

    const opts = {
      offsetX: 0,
      offsetY: 0
    };

    cy.get("@source-container")
      .trigger("dragstart")
      .trigger("drag");

    cy.get("@target-container").then($el => {
      const { x, y } = $el.get(0).getBoundingClientRect();
      cy.wrap($el.get(0)).as("target");
      cy.get("@target").trigger("dragover");
      cy.get("@target").trigger("drop", {
        clientX: x + opts.offsetX,
        clientY: y + opts.offsetY
      });
    });
    cy.get("@target-container")
      .find(`[data-row-key="1"]`)
      .should("contain", testName);
  };

  // *** APPHELPERS END ***
}
