import CypressHelper from "../../util/cypressHelpers";

export default class PlayListSearchContainer {
  /* GET ELEMNETS */
  getSearchContainer = () => cy.get('[data-cy="play-list-search-container"]');

  getKeywordsSearchBar = () => cy.get('[data-cy="container-search-bar"]');

  getTestInSearchResultsById = id => this.getSearchContainer().find(`[data-cy="${id}"]`);

  getTestInSearchResultsById = id => this.getSearchContainer().find(`[data-cy="${id}"]`);

  getFilterButton = () => cy.get('[data-cy="test-filter"]');

  getSubjectInFilter = () => cy.get('[data-cy="test-grade"]');

  getSharedWithMe = () => this.getSearchContainer().contains("Shared with me");

  getViewTestByTestId = id => cy.get(`[data-cy="${id}"]`).find(".preview-btn");

  getCloseCustomizationTab = () =>
    cy
      .get('[data-cy="curriculum-sequence-right-panel"]')
      .find("svg")
      .eq(0);

  /* ACTIONS START */

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

  clearDropDowns = () => {
    this.setStatus("All");
    this.getSubjectInFilter().then($ele => {
      if ($ele.find(".anticon-close").length > 0)
        cy.wrap($ele)
          .find(".anticon-close")
          .click({ multiple: true });
    });
  };

  clickOnAuthoredbyMeFolder = () =>
    this.getSearchContainer()
      .contains("Authored by me")
      .click();

  clickOnEntireLibrary = () =>
    this.getSearchContainer()
      .contains("Entire Library")
      .click();

  clickOnSharedWithMe = () =>
    this.getSearchContainer()
      .contains("Shared with me")
      .click();

  clickOnTestFilter = () => cy.get('[data-cy="test-filter"]').click();

  clickOnViewTestById = id => {
    cy.server();
    cy.route("GET", "**/test/*").as("viewTest");
    this.getViewTestByTestId(id).click({ force: true });
    return cy.wait("@viewTest").then(xhr => xhr.response.body.result._id);
  };

  verifySearchResultVisible = testId => {
    this.getTestInSearchResultsById(testId).should("be.visible");
  };

  VerififySearchResultNotVisible = testId => {
    this.getTestInSearchResultsById(testId).should("not.be.visible");
  };

  closeCustomizationTab = () => {
    this.getCloseCustomizationTab().click({ force: true });
    cy.get('[placeholder="Search by keywords"]').should("not.exist");
  };

  /* ACTIONS END */

  /* APP HELPERS */
  routeTestSearch = () => {
    cy.server();
    cy.route("POST", "**/search/tests").as("search-container-tests");
  };

  verifyStandardsByTestInSearch = (id, standard) =>
    this.getTestInSearchResultsById(id)
      .find(`[title="${standard}"]`)
      .should("be.visible");

  setFilters = ({ collection, authoredByme, SharedWithMe, entireLibrary, grade, subject, status }) => {
    this.routeTestSearch();
    this.clickOnTestFilter();
    this.clearDropDowns();
    if (collection) this.setCollection(collection);
    if (authoredByme) this.clickOnAuthoredbyMeFolder();
    if (SharedWithMe) this.clickOnSharedWithMe();
    if (entireLibrary) this.clickOnEntireLibrary();
    if (grade) this.setGrade(grade);
    if (subject) this.setSubject(subject);
    if (status) this.setStatus(status);
    this.clickOnTestFilter();
    this.waitForTestSearch();
  };

  waitForTestSearch = () => cy.wait("@search-container-tests");
}
