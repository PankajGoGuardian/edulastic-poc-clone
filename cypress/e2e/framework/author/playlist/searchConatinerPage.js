import CypressHelper from "../../util/cypressHelpers";

export default class PlayListSearchContainer {
  /* GET ELEMNETS */
  getSearchContainer = () => cy.get('[data-cy="play-list-search-container"]');

  getKeywords = () => cy.get('[class*="SearchByTab"]').contains("keywords");

  getStandards = () => cy.get('[class*="SearchByTab"]').contains("standards");

  getKeywordsSearchBar = () => cy.get('[placeholder="Search by keywords"]').should("be.visible");

  getTestInSearchResultsById = id => this.getSearchContainer().find(`[data-cy="${id}"]`);

  getTestInSearchResultsById = id => this.getSearchContainer().find(`[data-cy="${id}"]`);

  getFilterButton = () => cy.get('[data-cy="test-filter"]');

  /* ACTIONS START*/

  getSharedWithMe = () => cy.get('[class *= "FilterContainer"]').contains("Shared with me");

  setGrade = grade => {
    CypressHelper.selectDropDownByAttribute("test-grade", grade);
  };
  setSubject = subject => {
    CypressHelper.selectDropDownByAttribute("test-subject", subject);
  };

  setStatus = status => {
    CypressHelper.selectDropDownByAttribute("test-status", status);
  };

  setCollection = collection => {
    CypressHelper.selectDropDownByAttribute("test-collection", collection);
  };

  clickOnKeyword = () => this.getKeywords().click();

  clickOnStandard = () => this.getStandards().click();

  clickOnAuthoredbyMeFolder = () =>
    cy
      .get('[class *= "FilterContainer"]')
      .contains("Authored by me")
      .click();

  clickOnEntireLibrary = () =>
    cy
      .get('[class *= "FilterContainer"]')
      .contains("Entire Library")
      .click();

  clickOnSharedWithMe = () =>
    cy
      .get('[class *= "FilterContainer"]')
      .contains("Shared with me")
      .click();

  clickOnTestFilter = () => cy.get('[data-cy="test-filter"]').click();

  typeInSearchBar = text => {
    this.routeTestSearch();
    this.getKeywordsSearchBar()
      .clear()
      .type(text);
    this.waitForTestSearch();
  };

  verifySearchResultVisible = testId => {
    this.getTestInSearchResultsById(testId).should("be.visible");
  };

  VerififySearchResultNotVisible = testId => {
    this.getTestInSearchResultsById(testId).should("not.be.visible");
  };

  /* ACTIONS END*/

  /* APP HELPERS */
  routeTestSearch = () => {
    cy.server();
    cy.route("POST", "**/search/tests").as("searchTests");
  };

  setFilters = ({ collection }) => {
    this.clickFilterButton();
    if (collection) this.selectCollection(collection);
    this.clickFilterButton();
  };

  waitForTestSearch = () => cy.wait("@searchTests");
}
