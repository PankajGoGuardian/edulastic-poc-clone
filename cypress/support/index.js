import "cypress-testing-library/add-commands";
import "./commands";
import "./apiCommands";
import "cypress-promise";

require("cypress-xpath");

/*
 *  Global before hook to delete testdata
 */
before("delete test data", () => {
  cy.login();
  cy.deleteTestData();
});

// FixMe : adding block to ignore uncaught error from the app
Cypress.on("uncaught:exception", (err, runnable) => {
  return false;
});
