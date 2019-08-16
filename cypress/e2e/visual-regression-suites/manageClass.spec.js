/* eslint-disable cypress/no-unnecessary-waiting */
import FileHelper from "../framework/util/fileHelper";

const SCREEN_SIZES = Cypress.config("SCREEN_SIZES");

describe(`visual regression tests - ${FileHelper.getSpecName(Cypress.spec.name)}`, () => {
  context(`manage class page`, () => {
    before("set token", () => {
      cy.fixture("users").then(users => {
        const user = users["visual-regression"].teacher;
        cy.setToken(user.username, user.password); // setting auth token for teacher user
      });
    });

    SCREEN_SIZES.forEach(size => {
      it(`'active-class' should match with base screenshot when resolution is '${size}'`, () => {
        const pageURL = "author/manageClass";
        cy.setResolution(size);
        cy.visit(`/${pageURL}`); // go to the required page usign url
        cy.wait("@courses"); // wait for xhr to finish
        cy.contains("Class Name").should("be.visible");
        cy.matchImageSnapshot(); // take screenshot and comapare
      });

      it(`'create class' should match with base screenshot when resolution is '${size}'`, () => {
        Cypress.Screenshot.defaults({
          onBeforeScreenshot($el) {
            const $img = $el.find('img[alt="Test"]');
            if ($img) {
              $img.hide();
            }
          }
        });

        const pageURL = "author/manageClass/createClass";
        cy.setResolution(size);
        cy.visit(`/${pageURL}`); // go to the required page usign url
        cy.wait("@curriculum"); // wait for xhr to finish
        cy.contains("Class Name").should("be.visible");
        cy.matchImageSnapshot(); // take screenshot and compare
      });
    });
  });
});
