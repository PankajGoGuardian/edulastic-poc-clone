import "cypress-testing-library/add-commands";
import "./commands";
import "./apiCommands";
import "cypress-promise";
import initGlobleRoutes from "./globalRoutes";

require("cypress-xpath");

const addContext = require("mochawesome/addContext");

/*
 *  Global before hook to delete testdata
 */
before("delete test data", () => {
  cy.deleteTestData();
});

/*
 *  init global routes for each* test
 */
if (Cypress.env().configFile === "visual-regression") {
  beforeEach("beforeEach", () => {
    initGlobleRoutes();
  });
}

// FixMe : adding block to ignore uncaught error from the app
Cypress.on("uncaught:exception", () => false);

// attach screenshot diff for visual tests
Cypress.on("test:after:run", (test, runnable) => {
  if (Cypress.env("configFile") === "visual-regression" && test.state === "failed") {
    let screenshotFileName = `${test.title}.diff.png`;
    let currentTestContext = runnable;
    while (currentTestContext.parent && currentTestContext.parent.title.length > 0) {
      screenshotFileName = `${currentTestContext.parent.title} -- ${screenshotFileName}`;
      currentTestContext = currentTestContext.parent;
    }
    addContext({ test }, `../snapshots/${Cypress.spec.name}/__diff_output__/${screenshotFileName}`);
  }
});
