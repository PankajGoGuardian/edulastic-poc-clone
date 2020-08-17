import TestAddItemTab from "./testAddItemTab";
import TestSummayTab from "./testSummaryTab";
import TestReviewTab from "./testReviewTab";

export default class TestHeader {
  // *** ELEMENTS START ***

  getTestNameInTitle = () => cy.get('[data-cy="title"]');

  getPublishRegradeButton = () => cy.get('[data-cy="publish"]');

  getEditTestButton = () => cy.get('[data-cy="edit"]');

  getShareButton = () => cy.get('[data-cy="share"]');

  getAssignButton = () => cy.get('[data-cy="assign"]');

  getSaveBuuton = () => cy.get('[data-cy="save"]');

  getPrintButton = () => cy.get('[data-cy="printTest"]');

  getTestReviewHeader = () => cy.get('[data-cy="review"]');

  getTestSummaryHeader = () => cy.get('[data-cy="description"]');

  getTestSettingsHeader = () => cy.get('[data-cy="settings"]');

  getTestAddItemHeader = () => cy.get('[data-cy="addItems"]');

  getWorkSheetHeader = () => cy.get('[data-cy="edit"]');

  // *** ELEMENTS END ***

  // *** ACTIONS START ***

  clickOnDescription = () => {
    this.getTestSummaryHeader().click({ force: true });
    cy.get('[data-cy="testname"]').should("be.visible");
    return new TestSummayTab();
  };

  clickOnAddItems = () => {
    cy.server();
    cy.route("POST", "**/search/items").as("search-items");
    cy.route("POST", "**/search/browse-standards").as("search-standards");

    this.getTestAddItemHeader().click({ force: true });
    return cy.wait("@search-items").then(() => new TestAddItemTab());
  };

  clickOnReview = () => {
    cy.wait(2000).then(() => this.getTestReviewHeader().click({ force: true }));
    return new TestReviewTab();
  };

  clickOnSettings = () => this.getTestSettingsHeader().click();

  clickOnEditButton = (confirmation = false) => {
    this.getEditTestButton().click();
    if (confirmation) {
      cy.contains("PROCEED").click();
      cy.wait("@saveTest");
    }
  };

  clickOnSaveButton = (edited = false) => {
    cy.wait(2000);
    cy.server();
    if (edited) cy.route("PUT", "**/test/**").as("saveTest");
    else cy.route("POST", "**/test").as("saveTest");

    this.getSaveBuuton().click({ force: true });
    return cy.wait("@saveTest").then(xhr => {
      expect(xhr.status).to.eq(200);
      const testId = xhr.response.body.result._id;
      if (!edited) {
        console.log("test created with _id : ", testId);
        cy.saveTestDetailToDelete(testId);
      }
      return cy.wait(100).then(() => testId);
    });
  };

  clickOnPublishButton = () => {
    cy.server();
    cy.route("PUT", "**/test/**/publish").as("published");
    cy.route("POST", "**/districts/*/users").as("share-test");
    this.clickRegradePublish();
    return cy.wait("@published").then(xhr => {
      expect(xhr.status).to.eq(200);
      // TODO: revisit here and refactor

      if (Cypress.$('[data-cy="Assignments"]').length === 1) {
        // there is significant delay in gettting the success page in app, hence increasing the timeout.
        return cy.contains("Share With Others", { timeout: 20000 }).then(() => {
          return JSON.stringify(xhr.url)
            .split("/")
            .reverse()[1];
        });
      } else
        return cy.wait("@share-test").then(
          () =>
            JSON.stringify(xhr.url)
              .split("/")
              .reverse()[1]
        );
    });
  };

  clickRegradePublish = () => {
    cy.server();
    cy.route("PUT", "**/test/*").as("saveTest");
    this.getPublishRegradeButton().click();
    cy.wait("@saveTest").then(xhr => expect(xhr.status).to.eq(200));
  };

  clickOnShare = () => this.getShareButton().click({ force: true });

  clickOnAssign = () => {
    cy.server();
    cy.route("POST", "**/group/search").as("groups");
    cy.get('[data-cy="assign"]').click();
    cy.wait("@groups");
  };

  clickOnfilters = () =>
    cy
      .get('[data-cy="filter"]')
      .first()
      .click();

  closeFilter = () =>
    cy
      .get(".anticon-close")
      .last()
      .find("svg")
      .click({ force: true });

  // *** ACTIONS END ***

  // *** APPHELPERS START ***

  isDraft = () => cy.get('[data-cy="status"]').contains("draft");

  verifyNameInTitle = name => this.getTestNameInTitle().should("contain", name);

  verifyHeaders = (summary = true, addItem = true, review = true, settings = true, worksheet = false) => {
    if (summary) this.getTestSummaryHeader().should("exist");
    else this.getTestSummaryHeader().should("not.exist");
    if (addItem) this.getTestAddItemHeader().should("exist");
    else this.getTestAddItemHeader().should("not.exist");
    if (review) this.getTestReviewHeader().should("exist");
    else this.getTestReviewHeader().should("not.exist");
    if (settings) this.getTestSettingsHeader().should("exist");
    else this.getTestSettingsHeader().should("not.exist");
    if (worksheet) this.getWorkSheetHeader().should("exist");
    else this.getWorkSheetHeader().should("not.exist");
  };

  verifyHeaderActionButtons = (print = true, share = true, save = true, publish = true, assign = true) => {
    if (print) this.getPrintButton().should("exist");
    else this.getPrintButton().should("not.exist");
    if (share) this.getShareButton().should("exist");
    else this.getShareButton().should("not.exist");
    if (save) this.getSaveBuuton().should("exist");
    else this.getSaveBuuton().should("not.exist");
    if (publish) this.getPublishRegradeButton().should("exist");
    else this.getPublishRegradeButton().should("not.exist");
    if (assign) this.getAssignButton().should("exist");
    else this.getAssignButton().should("not.exist");
  };
  // *** APPHELPERS END ***
}
