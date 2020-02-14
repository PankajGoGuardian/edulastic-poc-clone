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
    cy.wait(1000);
    this.waitForSearchResponse();
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
    this.routeSearch();
    CypressHelper.selectDropDownByAttribute("Collections", collection);
    cy.wait("@search");
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
    cy.wait(1000);
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

  getSearchTextBox = () => cy.get('[placeholder="Search by skills and keywords"]').last();

  typeInSearchBox = key => {
    this.routeSearch();
    this.getSearchTextBox()
      .type("{selectall}")
      .type(key, { force: true });
    cy.wait(1000);
    this.waitForSearchResponse();
  };

  clickOnSearchIcon = () => {
    this.getSearch()
      .find("i")
      .click({ force: true });
    this.waitForSearchResponse();
  };
}
