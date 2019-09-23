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

// attach screenshots in report for all failed tests
Cypress.on("test:after:run", (test, runnable) => {
  if (test.state === "failed") {
    const imgError = test.err.stack.includes("saved snapshot");
    let screenshotFileName = test.title;
    let currentTestContext = runnable;

    while (currentTestContext.parent && currentTestContext.parent.title.length > 0) {
      screenshotFileName = `${currentTestContext.parent.title} -- ${screenshotFileName}`;
      currentTestContext = currentTestContext.parent;
    }

    screenshotFileName = screenshotFileName.replace(/[\/\\<>:]/g, "").slice(0, 220);
    screenshotFileName = imgError ? `${screenshotFileName}.diff.png` : `${screenshotFileName} (failed).png`;
    const imgPath = imgError
      ? `../snapshots/${Cypress.spec.name}/__diff_output__/${screenshotFileName}`
      : `../screenshots/${Cypress.spec.name}/${screenshotFileName}`;
    addContext({ test }, imgPath);
  }
});
