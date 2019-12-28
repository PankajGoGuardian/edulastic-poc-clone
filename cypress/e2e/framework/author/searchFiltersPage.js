import CypressHelper from "../util/cypressHelpers";

export default class SearchFilters {
  routeSearch = () => {
    cy.server();
    cy.route("POST", "**/search/**").as("search");
  };

  waitForSearchResponse = () => cy.wait("@search");

  getAuthoredByMe = () => {
    this.routeSearch();
    cy.xpath("//li[text()='Authored by me']").click();
    this.waitForSearchResponse();
    cy.wait(1000);
  };

  clearAll = () => {
    this.routeSearch();
    cy.get('[data-cy="clearAll"]').click({ force: true });
    return cy.wait("@search");
  };

  setGrades = grades => {
    grades.forEach(grade => {
      CypressHelper.selectDropDownByAttribute("selectGrades", grade);
      cy.wait("@search");
    });
  };

  setCollection = collection => {
    CypressHelper.selectDropDownByAttribute("Collections", collection);
  };

  scrollFiltersToTop = () =>
    cy
      .get(".scrollbar-container")
      .eq(1)
      .then($elem => {
        $elem.scrollTop(0);
      });

  sharedWithMe = () => {
    cy.get('[data-icon="share-alt"]').click({ force: true });
    cy.wait("@search");
  };

  getAuthoredByMe = () => {
    this.routeSearch();
    cy.xpath("//li[text()='Authored by me']").click();
    this.waitForSearchResponse();
    cy.wait(1000);
  };

  getEntireLibrary = () => {
    this.routeSearch();
    cy.get('[data-icon="book"]').click({ force: true });
    this.waitForSearchResponse();
    cy.wait(1000);
  };

  getSearch = () => cy.get(".ant-input-search");

  getSearchTextBox = () => this.getSearch().find("input");

  typeInSearchBox = key => {
    this.routeSearch();
    this.getSearchTextBox()
      .clear({ force: true })
      .type(key, { force: true });
    this.waitForSearchResponse();
  };

  clickOnSearchIcon = () => {
    this.getSearch()
      .find("i")
      .click({ force: true });
    this.waitForSearchResponse();
  };
}
