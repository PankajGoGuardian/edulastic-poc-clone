import CypressHelper from "../util/cypressHelpers";

export default class SearchFilters {
  routeSearch = () => {
    cy.server();
    cy.route("POST", "**/api/search/**").as("search");
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
}
