export default class PlayListSearchContainer {
  /* GET ELEMNETS */
  getSearchContainer = () => cy.get('[data-cy="play-list-search-container"]');

  getKeywords = () => cy.get('[class*="SearchByTab"]').contains("keywords");

  getStandards = () => cy.get('[class*="SearchByTab"]').contains("standards");

  getKeywordsSearchBar = () => cy.get('[placeholder="Search by keywords"]').should("be.visible");

  getStandardSearchBar = () => cy.get('[placeholder="Search by standards"]').should("be.visible");

  getTestInSearchResultsById = id => this.getSearchContainer().find(`[data-cy="${id}"]`);

  /* ACTIONS */
  clickOnKeyword = () => this.getKeywords().click();

  clickOnStandard = () => this.getStandards().click();

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

  waitForTestSearch = () => cy.wait("@searchTests");
}
