import FileHelper from "../framework/util/fileHelper";

const SCREEN_SIZES = Cypress.config("SCREEN_SIZES");

describe(`visual regression tests - ${FileHelper.getSpecName(Cypress.spec.name)}`, () => {
  context(`student home page`, () => {
    const pageURL = "home/assignments";

    before("set token", () => {
      cy.fixture("users").then(users => {
        const user = users["visual-regression"].student;
        cy.setToken(user); // setting auth token for student user
      });
    });

    SCREEN_SIZES.forEach(size => {
      it(`should match with base screenshot when resolution is '${size}'`, () => {
        cy.setResolution(size); // set the screen resolution
        cy.visit(`/${pageURL}`); // go to the required page usign url
        cy.wait("@testactivity"); // wait for xhr to finish
        cy.get("img")
          .should("be.visible")
          .and("have.length.greaterThan", 0); // ensure the dom elements are rendered
        cy.matchImageSnapshot(); // take screenshot and comapare
      });
    });
  });
});
