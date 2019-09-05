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
  };

  clearAll = () => cy.get('[data-cy="clearAll"]').click({ force: true });

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
