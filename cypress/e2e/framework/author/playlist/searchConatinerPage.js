import CypressHelper from "../../util/cypressHelpers";

export default class PlayListSearchContainer {
  /* GET ELEMNETS */
  getSearchContainer = () => cy.get('[data-cy="play-list-search-container"]');

  getKeywords = () => cy.get('[class*="SearchByTab"]').contains("keywords");

  getStandards = () => cy.get('[class*="SearchByTab"]').contains("standards");

  getKeywordsSearchBar = () => cy.get('[placeholder="Search by keywords"]').should("be.visible");

  getStandardSearchBar = () => cy.get('[placeholder="Search by standards"]').should("be.visible");

  getTestInSearchResultsById = id => this.getSearchContainer().find(`[data-cy="${id}"]`);

  getFilterButton = () => cy.get('[data-cy="test-filter"]');

  /* ACTIONS */
  clickOnKeyword = () => this.getKeywords().click();

  clickOnStandard = () => this.getStandards().click();

  clickFilterButton = () => this.getFilterButton().click();

  selectCollection = collection => CypressHelper.selectDropDownByAttribute("test-collection", collection);

  typeInSearchBar = text => {
    this.routeTestSearch();
    this.getKeywordsSearchBar().type(text);
    this.waitForTestSearch();
  };

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
