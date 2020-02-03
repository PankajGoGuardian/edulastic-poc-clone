/* eslint-disable cypress/no-unnecessary-waiting */
import FileHelper from "../framework/util/fileHelper";

const SCREEN_SIZES = Cypress.config("SCREEN_SIZES");

// TODO : unskip and fix the unknown hanging issue in cypress
// https://github.com/cypress-io/cypress/issues/2294
// provided work around did not work
describe.skip(`${FileHelper.getSpecName(Cypress.spec.name)}`, () => {
  context(`manage classs page`, () => {
    before("set token", () => {
      cy.fixture("usersVisualRegression").then(allusers => {
        const { username, password } = allusers.default.teacher;
        cy.setToken(username, password); // setting auth token for teacher user
      });

      Cypress.Screenshot.defaults({
        onBeforeScreenshot($el) {
          const $img = $el.find("img");
          if ($img) {
            $img.hide();
          }
        }
      });
    });

    SCREEN_SIZES.forEach(size => {
      it(`'active-classs' - when resolution is '${size}'`, () => {
        const pageURL = "author/manageClass";
        cy.setResolution(size);
        cy.visit(`/${pageURL}`); // go to the required page usign url
        cy.wait("@courses"); // wait for xhr to finish
        cy.contains("Class Name").should("be.visible");
        cy.matchImageSnapshotWithSize(); // take screenshot and comapare
      });
    });

    SCREEN_SIZES.forEach(size => {
      it(`'create-classs' - when resolution is '${size}'`, () => {
        const pageURL = "author/manageClass/createClass";
        cy.setResolution(size);
        cy.visit(`/${pageURL}`); // go to the required page usign url
        cy.wait("@curriculum"); // wait for xhr to finish
        cy.contains("Class Name").should("be.visible");
        cy.matchImageSnapshotWithSize(); // take screenshot and compare
      });
    });

    SCREEN_SIZES.forEach(size => {
      it(`'view-classs' - when resolution is '${size}'`, () => {
        const pageURL = "author/manageClass/5d53b53af7efc82f60100347";
        cy.setResolution(size);
        cy.visit(`/${pageURL}`); // go to the required page usign url
        cy.wait("@users"); // wait for xhr to finish
        cy.contains("View Assessments").should("be.visible");
        cy.matchImageSnapshotWithSize(); // take screenshot and compare
      });
    });

    SCREEN_SIZES.forEach(size => {
      it(`'edit-classs' - when resolution is '${size}'`, () => {
        const pageURL = "author/manageClass/5d53b53af7efc82f60100347/edit";
        cy.setResolution(size);
        cy.visit(`/${pageURL}`); // go to the required page usign url
        cy.wait("@curriculum"); // wait for xhr to finish
        cy.contains("Class Name").should("be.visible");
        cy.matchImageSnapshotWithSize(); // take screenshot and compare
      });
    });
  });
});
