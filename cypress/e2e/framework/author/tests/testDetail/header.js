import TestAddItemTab from "./testAddItemTab";
import TestSummayTab from "./testSummaryTab";

export default class TestHeader {
  clickOnDescription = () => {
    cy.get('[data-cy="summary"]').click();
    return new TestSummayTab();
  };

  clickOnAddItems = () => {
    cy.server();
    cy.route("POST", "**/search/**").as("searchItem");
    return cy
      .get('[data-cy="addItems"]')
      .click()
      .then(() => cy.wait("@searchItem").then(() => new TestAddItemTab()));
  };

  clickOnReview = () => cy.get('[data-cy="review"]').click();

  clickOnSettings = () => cy.get('[data-cy="settings"]').click();

  clickOnEditButton = () => cy.get('[data-cy="edit"]').click();

  clickOnSaveButton = () => {
    cy.server();
    cy.route("POST", "**/test**").as("saveTest");

    cy.get('[data-cy="save"]').click();
    cy.wait("@saveTest").then(xhr => {
      assert(xhr.status === 200, "Creating test failed");
      const testId = xhr.response.body.result._id;
      console.log("test created with _id : ", testId);
      cy.saveTestDetailToDelete(testId);
    });
  };

  clickOnPublishButton = () => cy.get('[data-cy="publish"]').click();

  clickOnShare = () => cy.get('[data-cy="share"]').click();
}
