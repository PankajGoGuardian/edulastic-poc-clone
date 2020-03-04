import TestAddItemTab from "./testAddItemTab";
import TestSummayTab from "./testSummaryTab";
import TestReviewTab from "./testReviewTab";

export default class TestHeader {
  clickOnDescription = () => {
    cy.get('[data-cy="description"]').click({ force: true });
    return new TestSummayTab();
  };

  clickOnAddItems = (assignmentActions = false) => {
    cy.server();
    cy.route("POST", "**/search/**").as("search");
    cy.get('[data-cy="addItems"]').click({ force: true });
    if (assignmentActions) cy.wait("@search");
    return cy.wait("@search").then(() => new TestAddItemTab());
  };

  clickOnReview = () => {
    cy.wait(2000).then(() => cy.get('[data-cy="review"]').click({ force: true }));
    return new TestReviewTab();
  };

  clickOnSettings = () => cy.get('[data-cy="settings"]').click();

  clickOnEditButton = (confirmation = false) => {
    cy.get('[data-cy="edit"]').click();
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

    cy.get('[data-cy="save"]').click({ force: true });
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

  clickOnPublishButton = (assigned = false) => {
    cy.wait(1000);
    cy.server();
    cy.route("PUT", "**/test/**/publish").as("published");
    cy.route("PUT", "**/test/*").as("saveTest");
    cy.get('[data-cy="publish"]').click();
    if (!assigned) {
      cy.wait("@saveTest").then(xhr => expect(xhr.status).to.eq(200));
      return cy.wait("@published").then(xhr => {
        expect(xhr.status).to.eq(200);
        // TODO: revisit here and refactor
        if (Cypress.$('[data-cy="Assignments"]').length === 1) {
          return cy.contains("Share With Others").then(() => {
            return JSON.stringify(xhr.url)
              .split("/")
              .reverse()[1];
          });
        }
      });
    }
  };

  clickOnShare = () => cy.get('[data-cy="share"]').click({ force: true });

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

  isDraft = () =>
    cy
      .get('[data-cy="description"]')
      .parent()
      .parent()
      .children()
      .eq(0)
      .find("span")
      .contains("draft");

  getTestNameInTitle = () => cy.get('[data-cy="title"]');

  verifyNameInTitle = name => this.getTestNameInTitle().should("contain", name);
}
