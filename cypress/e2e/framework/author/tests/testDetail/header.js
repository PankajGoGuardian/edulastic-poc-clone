import TestAddItemTab from "./testAddItemTab";
import TestSummayTab from "./testSummaryTab";

export default class TestHeader {
  clickOnDescription = () => {
    cy.get('[data-cy="summary"]').click();
    return new TestSummayTab();
  };

  clickOnAddItems = () => {
    cy.server();
    cy.route("POST", "**/search/**").as("search");
    cy.get('[data-cy="addItems"]').click();
    return cy.wait("@search").then(() => new TestAddItemTab());
  };

  clickOnReview = () => cy.wait(2000).then(() => cy.get('[data-cy="review"]').click());

  clickOnSettings = () => cy.get('[data-cy="settings"]').click();

  clickOnEditButton = () => cy.get('[data-cy="edit"]').click();

  clickOnSaveButton = (edited = false) => {
    cy.wait(2000);
    cy.server();
    if (edited) cy.route("PUT", "**/test/**").as("saveTest");
    else cy.route("POST", "**/test").as("saveTest");

    cy.get('[data-cy="save"]').click();
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
    cy.wait(1000);
    cy.server();
    cy.route("PUT", "**/test/**/publish").as("published");
    cy.get('[data-cy="publish"]').click();
    cy.wait("@saveTest").then(xhr => expect(xhr.status).to.eq(200));
    return cy.wait("@published").then(xhr => {
      expect(xhr.status).to.eq(200);
      return JSON.stringify(xhr.request)
        .split("/")
        .reverse()[1];
    });
  };

  clickOnShare = () => cy.get('[data-cy="share"]').click();

  clickOnAssign = () => {
    cy.get('[data-cy="assign"]').click();
    cy.wait("@assignment");
  };
}
