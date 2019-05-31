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
}
