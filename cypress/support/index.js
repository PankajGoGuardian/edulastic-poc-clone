import "cypress-testing-library/add-commands";
import "./commands";
import "./apiCommands";
import "cypress-promise";
import initGlobleRoutes from "./globalRoutes";
import FileHelper from "../e2e/framework/util/fileHelper";

require("cypress-xpath");

const addContext = require("mochawesome/addContext");

const screenResolutions = Cypress.config("SCREEN_SIZES");

const executionEnv = Cypress.env("testExecutionEnv");

/*
 *  Global before hook to delete testdata
 */

// creating testData file if not exists (usually for first spec in CI)
before("create testData file", () => {
  cy.createTestDataFile();
});

/*
 * Making cleanup hook order configurable !!!
 * @before - we need this while developping tests, any interruption in mid of execution causes data not to delete and impacts consecutive runs in some case when there is static data dependencies.
 * @after - we need to this when running in CI(Jenkins/docker), so that running consecutive suites are not blocked when any API error out for DELETE
 */
const cleanupHook = executionEnv === "CI" ? after : before;

cleanupHook("delete test data", () => {
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
  addContext({ test }, { title: "specName", value: `${Cypress.spec.name}` });
  if (test.state === "failed") {
    const imgError = test.err.stack.includes("saved snapshot");
    let screenshotFileName = FileHelper.getTestFullName();
    let width;

    if (Cypress.env().configFile === "visual-regression") {
      for (const res of screenResolutions) {
        width = screenshotFileName.includes(res) ? res[0] : undefined;
        if (width) break;
      }
    }

    screenshotFileName = imgError ? `${screenshotFileName}.diff.png` : `${screenshotFileName} (failed).png`;
    const imgPath = imgError
      ? `../snapshots/${Cypress.spec.name}/${width}/__diff_output__/${screenshotFileName}`
      : `../screenshots/${Cypress.spec.name}/${screenshotFileName}`;

    addContext({ test }, { title: "test case flow - ", value: FileHelper.getTestFlow() });
    addContext({ test }, { title: "screenshot for failed test case", value: imgPath });
    addContext({ test }, { title: "video playback", value: `../videos/${Cypress.spec.name}.mp4` });
  }
});
