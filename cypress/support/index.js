import "cypress-testing-library/add-commands";
import "./commands";
import "./apiCommands";
import "cypress-promise";

require("cypress-xpath");

/*
 *  Global before hook to delete testdata
 */
before("delete test data", () => {
  cy.setToken();
  cy.deleteTestData();
});
