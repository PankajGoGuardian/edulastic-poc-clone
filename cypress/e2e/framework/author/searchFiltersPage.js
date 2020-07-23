import CypressHelper from "../util/cypressHelpers";
import Helpers from "../util/Helpers";

export default class SearchFilters {
  // *** ELEMENTS START ***

  getSearch = () => cy.get(".ant-input-search");

  getSearchBar = () => cy.contains("Search by skills and keywords").next();

  getSearchTextBox = () => this.getSearchBar().find("input");

  // *** ELEMENTS END ***

  // *** ACTIONS START ***

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
    const dummyCharToType = Helpers.getRamdomString(2).toUpperCase();
    this.routeSearch();
    this.typeInSearchBox(dummyCharToType);
    cy.get('[data-cy="clearAll"]').click({ force: true });
    return cy.wait("@search").then(() => this.getSearchBar().should("not.contain", dummyCharToType));
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

  typeInSearchBox = key => {
    this.routeSearch();
    this.getSearchTextBox()
      .type("{selectall}", { force: true })
      .type(`${key}{enter}`, { force: true });
    this.waitForSearchResponse();
  };

  clickOnSearchIcon = () => {
    this.getSearch()
      .find("i")
      .click({ force: true });
    this.waitForSearchResponse();
  };

  // *** ACTIONS END ***

  // *** APPHELPERS START ***
  // *** APPHELPERS END ***
}
